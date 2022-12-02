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

  onActiveCallsUpdate = async allCalls => {
    this.allCalls = allCalls
    this.updateCallUXIfNeeded()
  }

  updateCallUXIfNeeded = async () => {
    // If user instantiated the call in this app session, we want to maintain the button states for speaker and microphone
    const state = this.reduxStore.getState()
    const activeCallData = state.avChat?.activeCallData
    const controlsState = activeCallData?.controlsState ?? {
      muted: false,
      speaker: false,
    }

    const allCalls = this.allCalls
    // We retrieved a new list of active calls that the current user is involved it
    // Since we only show a single call at a time in the UI, we need to find which one has the highest priority
    // First, we try to find whether the user is already in a call (an "active" status)
    const activeCalls = allCalls.filter(call => call.status === 'active')
    for (var i = 0; i < activeCalls.length; ++i) {
      const currentActiveCall = activeCalls[i]
      const callChannel = await this.apiManager.retrieveCallChannel(
        currentActiveCall.callID,
      )
      if (callChannel) {
        // We found a valid call that the current user is already involved in, so we show the UI for it (USER IS IN A CALL) by setting the avChat reducer:
        this.reduxStore.dispatch(
          setActiveCallData({
            status: 'active',
            callType: callChannel.callType,
            callID: callChannel.callID,
            channelName: callChannel.channelName,
            allChannelParticipants: callChannel.allChannelParticipants,
            activeParticipants: callChannel.activeParticipants,
            callStartTimestamp: callChannel.callStartTimestamp,
            controlsState: controlsState,
          }),
        )
        return
      }
    }

    // If we were not able to find any valid call where the user is already involved in, we look for the incoming calls
    const incomingCalls = allCalls.filter(call => call.status === 'incoming')
    for (var i = 0; i < incomingCalls.length; ++i) {
      const currentCall = incomingCalls[i]
      const callChannel = await this.apiManager.retrieveCallChannel(
        currentCall.callID,
      )
      if (callChannel) {
        // We found a valid incoming call for the current user, so we display it (USER IS RECEIVING A CALL)
        this.reduxStore.dispatch(
          setActiveCallData({
            status: 'incoming',
            callType: callChannel.callType,
            callID: callChannel.callID,
            channelName: callChannel.channelName,
            allChannelParticipants: callChannel.allChannelParticipants,
            activeParticipants: callChannel.activeParticipants,
            callStartTimestamp: callChannel.callStartTimestamp,
            controlsState: controlsState,
          }),
        )
        return
      }
    }

    // If we were not able to find any valid incoming or active calls we look for outgoing calls
    const outgoingCalls = allCalls.filter(call => call.status === 'outgoing')
    for (var i = 0; i < outgoingCalls.length; ++i) {
      const currentCall = outgoingCalls[i]
      const callChannel = await this.apiManager.retrieveCallChannel(
        currentCall.callID,
      )
      if (callChannel) {
        // We found a valid outgoing call for the current user, so we display it (USER IS INITIATING A CALL)

        this.reduxStore.dispatch(
          setActiveCallData({
            status: 'outgoing',
            callType: callChannel.callType,
            callID: callChannel.callID,
            channelName: callChannel.channelName,
            allChannelParticipants: callChannel.allChannelParticipants,
            activeParticipants: callChannel.activeParticipants,
            callStartTimestamp: callChannel.callStartTimestamp,
            controlsState: controlsState,
          }),
        )
        return
      }
    }

    // We were not able to find any calls at all, so we make sure we don't show any UI, including the user who just initiated the current call
    this.reduxStore.dispatch(setActiveCallData(null))
  }
}
