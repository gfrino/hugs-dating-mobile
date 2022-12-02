/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

import { setFriends, setFriendships } from '../../redux'
import { setUserData } from '../../../../onboarding/redux/auth'
import { mockData } from '../../../../onboarding/utils/api/local/localData'
import { mockFriendships, mockFriends } from './localData'
export default class FriendshipTracker {
  /**
   *
   * @param {an object: redux store to update app state} reduxStore
   * @param {a string: the id of the logged in user} userID
   * @param {a boolean: whether to persist friendship count} persistFriendshipsCounts
   * @param {a boolean:whether the users just became friends} extendFollowers
   * @param {a boolean: whether to enable feed update} enableFeedUpdates
   */
  constructor(
    reduxStore,
    userID,
    persistFriendshipsCounts = false,
    extendFollowers = false,
    enableFeedUpdates = false,
  ) {
    this.reduxStore = reduxStore
    this.reduxStore.dispatch(setFriendships(mockFriendships))
    this.reduxStore.dispatch(setFriends(mockFriends))
    this.reduxStore.dispatch(setUserData({ user: mockData }))
  }

  /**
   * Subscribe to friendships, abuses and user apis if they have not been subscribed to
   */
  subscribeIfNeeded = () => {}

  /**
   * Unsubscribe to friendships, abuses and user apis
   */
  unsubscribe = () => {}

  /**
   * @function Add new friend
   *
   * @param {the object of user requesting} fromUser
   * @param {the object of the user being requested} toUser
   * @param {callback to be executed when a change occurs on the friendship backend} callback
   */
  addFriendRequest = (fromUser, toUser, callback) => {
    callback(null)
  }

  /**
   * Unfriend a friend
   *
   * @param {the object of the user unfriending the other} outBound
   * @param {the object of the user being unfriended} toUser
   * @param {callback function be executed after the action has been executed} callback
   */
  unfriend = (outBound, toUser, callback) => {
    callback(null)
    return
    // unfriend user
    // callback
  }

  /**
   *
   * cancel friend request
   *
   * @param {the object of the user canceling friend request} outBound
   * @param {the object of the user friend request being cancelled } toUser
   * @param {callback function be executed after the action has been executed} callback
   */
  cancelFriendRequest = (outBound, toUser, callback) => {
    callback(null)
  }
}
