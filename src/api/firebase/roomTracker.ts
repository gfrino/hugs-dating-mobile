import { IUser } from '~/Core/onboarding/hooks/useCurrentUser'
import * as firebaseSwipe from './roomSwipes'
import { SwipeType } from './types'
import { firebase } from '~/Core/api/firebase/config'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export default class RoomSwipeTracker {
  userID: string
  genderPref: string
  roomID: string
  userDocRef: FirebaseFirestoreTypes.DocumentReference
  unsubscribeComputingStatus?: () => void
  unsubscribeMatches?: () => void

  constructor(userID: string, genderPref: string, roomID: string) {
    this.userID = userID
    this.roomID = roomID
    this.genderPref = genderPref
    this.userDocRef = firebase.firestore().collection('users').doc(userID)
  }

  unsubscribe = () => {
    if (this.unsubscribeComputingStatus) {
      this.unsubscribeComputingStatus()
    }
    if (this.unsubscribeMatches) {
      this.unsubscribeMatches()
    }
  }

  subscribeComputingStatus = (callback: (isComputing: boolean) => void) => {
    if (!this.userID || !callback) {
      return;
    }
    this.unsubscribeComputingStatus = firebaseSwipe.subscribeComputingStatus(
      this.userID,
      callback,
    )
  }

  fetchRecommendations = async () => {
    return firebaseSwipe.fetchRecommendations(
      this.userID,
      this.roomID,
      this.genderPref,
    )
  }

  triggerComputeRecommendationsIfNeeded = async (user: IUser) => {
    return firebaseSwipe.triggerComputeRecommendationsIfNeeded(user)
  }

  fetchRemoteUserRooms = async () => {
    return firebaseSwipe.fetchRemoteUserRooms(this.userID)
  }

  undoSwipe = (swipedUserToUndo?: IUser) => {
    if (!swipedUserToUndo) {
      return
    }
    return firebaseSwipe.undoSwipe(swipedUserToUndo, this.userID)
  }

  addSwipe = async (fromUser: IUser, toUser: IUser, type: SwipeType) => {
    return firebaseSwipe.addSwipe(fromUser, toUser, type, this.roomID)
  }

  getUserSwipeCount = async () => {
    return firebaseSwipe.getUserSwipeCount(this.userID)
  }

  updateUserSwipeCount = async (count: number) => {
    return firebaseSwipe.updateUserSwipeCount(this.userID, count)
  }
}
