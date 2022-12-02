import { firebase } from '~/Core/api/firebase/config'
import functions from '@react-native-firebase/functions'
import { getUnixTimeStamp } from '~/Core/helpers/timeFormat'
import { ISwipeCountDoc, IUserSwipe, SwipeType } from './types'
import { IUser } from '~/Core/onboarding/hooks/useCurrentUser'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

type QuerySnapshot =
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>

type MatchesCallbackType = (data: IUser[]) => void

const db = firebase.firestore()

const emptySwipeCountDoc: ISwipeCountDoc = {
  authorID: '',
  count: 0,
  createdAt: 0,
}

const usersRef = firebase.firestore().collection('users')

const matchesRef = firebase.firestore().collection('matches')
const swipesRef = db.collection('user_swipes')
const recommendationsRef = firebase
  .firestore()
  .collection('dating_recommendations')

const swipeCountRef = firebase.firestore().collection('swipe_counts')
const datingRecRef = firebase.firestore().collection('dating_recommendations')

const onCollectionUpdate = (
  querySnapshot: QuerySnapshot,
  callback: MatchesCallbackType,
) => {
  const data: IUser[] = []
  querySnapshot?.forEach(doc => {
    const temp = doc.data() as IUser
    temp.id = doc.id
    data.push(temp)
  })
  return callback(data)
}

export const subscribeMatches = (
  userId: string,
  callback: MatchesCallbackType,
) => {
  return matchesRef
    .doc(userId)
    .collection('my_matches')
    .onSnapshot(querySnapshot => onCollectionUpdate(querySnapshot, callback))
}

export const subscribeComputingStatus = (
  userId: string,
  callback: (isComputing: boolean) => void,
) => {
  return recommendationsRef.doc(userId).onSnapshot(querySnapshot => {
    if (querySnapshot.metadata.fromCache === true) {
      return
    }
    const data = querySnapshot.data()
    if (data && data.isComputingRecommendation !== undefined) {
      callback(data.isComputingRecommendation)
    }
  })
}

export const getUsersLikes = async (userId: string) => {
  const usersWhoLikesMeRef = swipesRef
    .doc(userId)
    .collection('people_who_likes_me')
    .where('userHasBeenSwiped', '==', false)
  const snapshot = await usersWhoLikesMeRef.get({
    source: 'server',
  })
  return snapshot.docs.map(doc => doc.data().userData)
}

export const removeUserLikedBy = async (
  userId: string,
  likedByUserId: string,
) => {
  const userWhoLikesMeRef = swipesRef
    .doc(userId)
    .collection('people_who_likes_me')
    .doc(likedByUserId)
  await userWhoLikesMeRef.update({ userHasBeenSwiped: true })
}

export const undoSwipe = (swipedUserToUndo: IUser, authorUserID: string) => {
  const swipedUserId = swipedUserToUndo.id || swipedUserToUndo.userID
  const batch = db.batch()
  const mydatingRecRef = datingRecRef.doc(authorUserID)
  const myRecRef = mydatingRecRef.collection('recommendations')
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

export const addSwipe = async (
  fromUser: IUser,
  toUser: IUser,
  type: SwipeType,
) => {
  const batch = db.batch()
  const mydatingRecRef = datingRecRef.doc(fromUser.id)
  const myRecRef = mydatingRecRef.collection('recommendations').doc(toUser.id)

  const instance = functions().httpsCallable('addUserSwipe')
  const timestamp = getUnixTimeStamp()

  batch.delete(myRecRef)

  batch.commit()

  try {
    const res = await instance({
      authorID: fromUser.id,
      swipedProfileID: toUser.id,
      swipedProfileBoosted: toUser.boost?.activeBoost || false,
      type: type,
      created_at: timestamp,
      createdAt: timestamp,
      roomID: '',
    })
    const responseData = res.data
    return responseData
  } catch (error) {
    console.log('ERROR [addSwipe]', error)
    return null
  }
}

export const triggerComputeRecommendationsIfNeeded = async (user: IUser) => {
  let didTrigger = false
  try {
    if (user?.currentRecommendationSize) {
      return didTrigger
    }
    didTrigger = true
    // trigger compute recommendations in firebase functions
    await usersRef.doc(user.id).update({ hasComputedRcommendations: false })

    return didTrigger
  } catch (error) {
    console.warn(error)
  }
}

export const fetchRecommendations = async (user: IUser) => {
  try {
    const fieldPath = new firebase.firestore.FieldPath('boost', 'activeBoost')
    const mydatingRecRef = datingRecRef
      .doc(user.id)
      .collection('recommendations')
      .orderBy(fieldPath, 'desc')
      .limit(20)

    const snapshot = await mydatingRecRef.get({
      source: 'server',
    })

    const data = snapshot.docs.map(doc => doc.data())

    return data
  } catch (error) {
    console.error('ERROR [fetchRecommendations]', error)
    return []
  }
}

export const getUserSwipeCount = async (userID: string) => {
  try {
    const swipeCount = await swipeCountRef.doc(userID).get()

    const data = swipeCount.data() as ISwipeCountDoc

    return data || null
  } catch (error) {
    console.log('ERROR [getUserSwipeCount]', error)
    return null
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

export const getUserSwipes = async (userId: string) => {
  const [likes, dislikes] = await Promise.all([
    getUserSwipesByType(userId, SwipeType.like),
    getUserSwipesByType(userId, SwipeType.dislike),
  ])
  let swipedUserIds: { [key: string]: SwipeType } = {}

  likes.forEach(like => {
    swipedUserIds[like.swipedProfileID] = like.type
  })
  dislikes.forEach(dislike => {
    swipedUserIds[dislike.swipedProfileID] = dislike.type
  })
  return swipedUserIds
}

const getUserSwipesByType = async (userId: string, type: SwipeType) => {
  const swipesRef = db
    .collection('user_swipes')
    .doc(userId)
    // Here the enum is "like" or "dislike" so we add an S to the end because the collection is in plural
    .collection(type + 's')
  const swipes = await swipesRef.get()

  return swipes.docs.map(doc => doc.data() as IUserSwipe)
}
