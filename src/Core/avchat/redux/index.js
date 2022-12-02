const SET_ACTIVE_CALL_DATA = 'SET_ACTIVE_CALL_DATA'

export const setActiveCallData = data => ({
  type: SET_ACTIVE_CALL_DATA,
  data,
})

const initialState = {
  activeCallData: null,
}

/*
activeCallData : {
    status: incoming | outgoing | active | rejected
    callType: audio | video
    callID, (an UUID formatted string, compatible with UUID class in Swift for iOS)
    channelName, // for groups, this is the group name. Fot 1-1 channels, this is empty
    allChannelParticipants,
    activeParticipants,
    callStartTimestamp,
    controlsState: {
      muted: true | false,
      speaker: true | false
    }
*/

export const avChat = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_CALL_DATA:
      return {
        ...state,
        activeCallData: action.data,
      }
    default:
      return state
  }
}
