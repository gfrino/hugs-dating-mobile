/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

export default class AVTracker {
  constructor(reduxStore, userID, apiManager) {
    this.reduxStore = reduxStore
    this.userID = userID
    this.apiManager = apiManager
  }

  subscribeIfNeeded = () => {}

  unsubscribe = () => {}
}
