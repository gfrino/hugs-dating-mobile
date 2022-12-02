import { Platform } from 'react-native'
import InCallManager from 'react-native-incall-manager'
import RNCallKeep from 'react-native-callkeep'

export default class IMTwilioStreamManager {
  constructor(twilioVideoRef, callID) {
    this.twilioVideoRef = twilioVideoRef
    this.callID = callID
  }

  updateMicStatusForLocalStream = isMuted => {
    Platform.OS == 'ios' && RNCallKeep.setMutedCall(this.callID, isMuted)
  }

  updateSpeakerStatusForLocalStream = speakerEnabled => {
    console.log('speaker set to ' + speakerEnabled)
    InCallManager.setSpeakerphoneOn(speakerEnabled)
    InCallManager.setForceSpeakerphoneOn(speakerEnabled)
  }

  handleChangesInActiveParticipants = async activeParticipants => {}

  closeAllConnections = () => {}
}
