/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

export default class AVAPIManager {
  // Readers and listeners from the signaling server

  subscribeToAVCallStatuses = (userID, callback) => {}

  retrieveCallChannel = async callID => {}

  retrieveUserData = async userID => {}

  // Writers to the signaling server

  startCall = async (
    callID,
    callTitle,
    callType,
    currentUser,
    callParticipants,
  ) => {}

  acceptCall = async (callID, userID) => {}

  rejectCallByCallID = async (callID, userID) => {}

  removeCallData = async (callID, userID) => {}

  removeUserFromCall = async (callID, userID) => {}

  // Signaling - connection data (the signals while in a call)

  subscribeToCallConnectionData = (callID, userID, callback) => {}

  addCallConnectionData = async (callID, data) => {}
}
