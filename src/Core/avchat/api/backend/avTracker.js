import { setActiveCallData } from '../../redux'

export default class AVTracker {
  constructor(reduxStore, userID, apiManager) {
    this.reduxStore = reduxStore
    this.userID = userID
    this.apiManager = apiManager
  }

  subscribeIfNeeded = () => {
    if (!this.unsubscribeTracker) {
      this.unsubscribeTracker = this.apiManager.subscribeToAVCallStatuses(
        this.userID,
        this.onActiveCallsUpdate,
      )
    }
  }

  unsubscribe = () => {
    this.unsubscribeTracker && this.unsubscribeTracker()
  }

  onActiveCallsUpdate = async newActiveCallData => {
    if (!newActiveCallData) {
      // We were not able to find any calls at all, so we make sure we don't show any UI, including the user who just initiated the current call
      this.reduxStore.dispatch(setActiveCallData(null))
      return
    }
    // If user instantiated the call in this app session, we want to maintain the button states for speaker and microphone
    const state = this.reduxStore.getState()
    const activeCallData = state.avChat?.activeCallData
    const controlsState = activeCallData?.controlsState ?? {
      muted: false,
      speaker: false,
    }

    this.reduxStore.dispatch(
      setActiveCallData({
        ...newActiveCallData,
        controlsState: controlsState,
      }),
    )
  }
}
