import functions from '@react-native-firebase/functions'
import { firebase } from '~/Core/api/firebase/config'
import { getUnixTimeStamp } from '~/Core/helpers/timeFormat'
import { IUser } from '~/Core/onboarding/hooks/useCurrentUser'
import { ISwipeCountDoc, SwipeType } from './types'

const db = firebase.firestore()

const swipesRef = db.collection('user_swipes')

const usersRef = firebase.firestore().collection('users')

const swipeCountRef = firebase.firestore().collection('swipe_counts')
const datingRecRef = firebase.firestore().collection('dating_recommendations')

export const getUsersLikes = async (userId: string) => {
  const mySwipesRef = swipesRef.doc(userId).collection('people_who_likes_me')
  const snapshot = await mySwipesRef.get({
    source: 'server',
  })
  return snapshot.docs.map(doc => doc.data().userData)
}

export const undoSwipe = (swipedUserToUndo: IUser, authorUserID: string) => {
  const swipedUserId = swipedUserToUndo.id || swipedUserToUndo.userID
  const batch = db.batch()
  const mydatingRecRef = datingRecRef.doc(authorUserID)
  const myRecRef = mydatingRecRef.collection('roomsRecommendations')
  const dislikesTypeRef = swipesRef
    .doc(swipedUserId)
    .collection('dislikes')
    .doc(authorUserID)
  const likesTypeRef = swipesRef
    .doc(swipedUserId)
    .collection('likes')
    .doc(authorUserID)

  batch.set(myRecRef.doc(swipedUserId), swipedUserToUndo)

  batch.delete(dislikesTypeRef)
  batch.delete(likesTypeRef)

  batch.commit().catch(error => {
    console.warn(error)
  })
}

export const fetchRemoteUserRooms = async (userId: string) => {
  const userDoc = await usersRef.doc(userId).get()
  const userRooms = userDoc.data()?.rooms || []
  return userRooms as string[]
}

export const subscribeComputingStatus = (
  userId: string,
  callback: (isComputing: boolean) => void,
) => {
  return datingRecRef.doc(userId).onSnapshot(querySnapshot => {

    if (querySnapshot.metadata.fromCache === true) {
      return
    }
    const data = querySnapshot.data()
    if (data && data.isComputingRoomRecs !== undefined) {
      callback(data.isComputingRoomRecs)
    }
  })
}

export const triggerComputeRecommendationsIfNeeded = async (user: IUser) => {
  let didTrigger = false
  try {
    if (user?.currentRoomsRecommendationSize) {
      return didTrigger
    }
    didTrigger = true
    // trigger compute recommendations in firebase functions
    await usersRef.doc(user.id).update({ hasComputedRoomRcommendations: false })

    return didTrigger
  } catch (error) {
    console.warn(error)
  }
}

export const addSwipe = async (
  fromUser: IUser,
  toUser: IUser,
  type: SwipeType,
  roomID: string,
) => {
  const batch = db.batch()
  const mydatingRecRef = datingRecRef.doc(fromUser.id)
  const myRecRef = mydatingRecRef
    .collection('roomsRecommendations')
    .doc(toUser.id)

  const instance = functions().httpsCallable('addUserSwipe')
  const timestamp = getUnixTimeStamp()

  batch.delete(myRecRef)

  batch.commit()

  try {
    const res = await instance({
      authorID: fromUser.id,
      swipedProfileID: toUser.id,
      swipedProfileBoosted: toUser.boost.activeBoost,
      type: type,
      created_at: timestamp,
      createdAt: timestamp,
      roomID,
    })
    const matchedUser = res.data as IUser
    return matchedUser
  } catch (error) {
    console.log('ERROR [addSwipe]', error)
    return null
  }
}

export const fetchRecommendations = async (
  userID: string,
  roomID: string,
  genderPref: string,
) => {
  try {
    const fieldPath = new firebase.firestore.FieldPath('boost', 'activeBoost')
    let mydatingRecRef = datingRecRef
      .doc(userID)
      .collection('roomsRecommendations')
      .where('rooms', 'array-contains', roomID)

    if (roomID === 'dating' && genderPref !== 'all' && genderPref) {
      
      mydatingRecRef = mydatingRecRef.where('settings.gender', '==', genderPref)
    }

    mydatingRecRef = mydatingRecRef.orderBy(fieldPath, 'desc').limit(20)

    const snapshot = await mydatingRecRef.get({
      source: 'server',
    })

    const data = snapshot.docs.map(doc => doc.data())

    return data as IUser[]
  } catch (error) {
    console.error('ERROR [fetchRecommendations]', error)
    return []
  }
}

export const getUserSwipeCount = async (userID: string) => {
  try {
    const swipeCount = await swipeCountRef.doc(userID).get()

    if (swipeCount.data()) {
      return swipeCount.data()
    }
  } catch (error) {
    console.log('ERROR [getUserSwipeCount]', error)
    return
  }
}

export const updateUserSwipeCount = (userID: string, count: number) => {
  const data: Partial<ISwipeCountDoc> = {
    authorID: userID,
    count: count,
  }

  if (count === 1) {
    data.createdAt = getUnixTimeStamp()
  }

  try {
    swipeCountRef.doc(userID).set(data, { merge: true })
  } catch (error) {
    console.log('ERROR [updateUserSwipeCount]', error)
  }
}
