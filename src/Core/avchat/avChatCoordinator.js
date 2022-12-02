import { setActiveCallData } from './redux'
import uuidv4 from 'uuidv4'
import { notificationManager } from '../notifications'

const pushKitEndpoint =
  'https://us-central1-hugs-datings.cloudfunctions.net/initiateChatCall'
const iOSBundleID = 'com.root.hugsdatings'

export default class AVChatCoordinator {
  constructor(apiManager) {
    this.apiManager = apiManager
  }

  startCall = (channel, callType, currentUser, dispatch, localized) => {
    // The current user is starting a new call

    // Sometimes the channel does not contain the current user as a participant in the participants field, so we make sure we add it before the call starts, so we have all the participants propagated properly in the signaling process
    const participants = [currentUser].concat(
      channel.participants.filter(u => u.id !== currentUser.id),
    )
    const callID = uuidv4()
    const callTitle = channel.name ?? channel.title ?? ''

    // We first set the active call data on the current redux state, so the calling screens will show up automatically on the initiator device
    const activeCallData = {
      status: 'outgoing',
      callType: callType,
      callID: callID,
      channelName: callTitle,
      allChannelParticipants: participants,
      activeParticipants: [currentUser],
      controlsState: {
        muted: false,
        speaker: false,
      },
    }
    dispatch(setActiveCallData(activeCallData))

    // Then, we let the server know there has been a call initiated, so the server can then signal all the call recipients
    this.apiManager.startCall(
      callID,
      callTitle,
      callType,
      currentUser,
      participants,
    )
    // Then, we initiate a push kit notification (iOS) and a push notification (Android)
    this.sendCallInitiationRemoteNotification(
      currentUser,
      channel?.otherParticipants,
      callType,
      callTitle,
      callID,
      localized,
    )
  }

  acceptCall = (callID, currentUser) => {
    if (callID) {
      this.apiManager.acceptCall(callID, currentUser?.id)
    }
  }

  rejectCall = (activeCallData, currentUser, dispatch) => {
    dispatch(setActiveCallData(null))

    // if one to one chat, remove the whole call session
    if (activeCallData?.allChannelParticipants?.length == 2) {
      this.apiManager.removeCallData(activeCallData.callID, currentUser?.id)
      return
    }

    // if there's a group chat, and one user rejects the call, we keep the call alive, but we remove the current user from it
    this.apiManager.removeUserFromCall(activeCallData.callID, currentUser?.id)
  }

  rejectCallByCallID = (callID, currentUser, dispatch) => {
    dispatch(setActiveCallData(null))
    this.apiManager.rejectCallByCallID(callID, currentUser?.id)
  }

  sendCallInitiationRemoteNotification = (
    caller,
    recipients,
    callType,
    channelName,
    callID,
    localized,
  ) => {
    // We send a push kit notification (in case the recipients are on iOS)
    const data = {
      callerID: caller.id,
      recipientIDs: recipients.map(recipient => recipient.id),
      callType,
      channelName,
      topic: iOSBundleID,
      uuid: callID,
    }

    fetch(pushKitEndpoint, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })

    // We send a push notification (in case the recipients are on Android)
    recipients.forEach(recipient => {
      notificationManager.sendCallNotification(
        caller,
        recipient,
        callType,
        callID,
      )
    })

    // We also send a push notification in case the user is on iOS and the app is in locked screen
    recipients.forEach(recipient => {
      notificationManager.sendPushNotification(
        recipient,
        'Hugs Dating',
        (caller?.firstName ?? localized('Someone')) +
          localized(' is ' + callType + ' calling you...'),
        callType + '_call',
        { callID: callID },
      )
    })
  }
}
