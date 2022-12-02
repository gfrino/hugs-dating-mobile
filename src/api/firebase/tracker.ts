import { IUser } from '~/Core/onboarding/hooks/useCurrentUser'
import * as firebaseSwipe from './swipes'
import { SwipeType } from './types'

export default class SwipeTracker {
  userID: string
  unsubscribeComputingStatus?: () => void
  unsubscribeMatches?: () => void

  constructor(userID: string) {
    this.userID = userID
  }

  unsubscribe = () => {
    if (this.unsubscribeComputingStatus) {
      this.unsubscribeComputingStatus()
    }
    if (this.unsubscribeMatches) {
      this.unsubscribeMatches()
    }
  }

  subscribeMatches = (callback?: () => void) => {
    if (!this.userID || !callback) {
      return
    }
    this.unsubscribeMatches = firebaseSwipe.subscribeMatches(
      this.userID,
      callback,
    )
  }

  subscribeComputingStatus = (callback?: () => void) => {
    if (!this.userID || !callback) {
      return
    }
    this.unsubscribeComputingStatus = firebaseSwipe.subscribeComputingStatus(
      this.userID,
      callback,
    )
  }

  triggerComputeRecommendationsIfNeeded = async (user: IUser) => {
    return firebaseSwipe.triggerComputeRecommendationsIfNeeded(user)
  }

  fetchRecommendations = async (user: IUser) => {
    return firebaseSwipe.fetchRecommendations(user)
  }

  undoSwipe = (swipedUserToUndo?: IUser, authorUserID?: string) => {
    if (!swipedUserToUndo || !authorUserID) {
      return
    }
    return firebaseSwipe.undoSwipe(swipedUserToUndo, authorUserID)
  }

  addSwipe = async (fromUser: IUser, toUser: IUser, type: SwipeType) => {
    return firebaseSwipe.addSwipe(fromUser, toUser, type)
  }

  getUserSwipeCount = async (userID: string) => {
    return firebaseSwipe.getUserSwipeCount(userID)
  }

  updateUserSwipeCount = async (userID: string, count: number) => {
    return firebaseSwipe.updateUserSwipeCount(userID, count)
  }

  getUserSwipes = async () => {
    return firebaseSwipe.getUserSwipes(this.userID)
  }
}
