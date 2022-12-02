import React, { useContext, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector, ReactReduxContext } from 'react-redux'
import {
  Modal,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native'
import { useTranslations } from 'dopenative'
import RNCallKeep from 'react-native-callkeep'

// Twilio imports
import { TwilioVideo } from 'react-native-twilio-video-webrtc'
import { TWILIO_SERVER_ENDPOINT } from '../../streaming/twilio/config'
import IMTwilioStreamManager from '../../streaming/twilio/streamManager'
// End Twilio imports

const { LaunchManager } = NativeModules

import { setActiveCallData } from '../../redux'
import { IMAVAudioVideoCallingView } from '../'
import { AVTracker, AVAPIManager } from '../../api'
import AVChatCoordinator from '../../avChatCoordinator'
import IMWebRTCStreamManager from '../../streaming/webRTC/streamManager'
import IMAVActiveVideoCallView from '../IMAVActiveVideoCallView/IMAVActiveVideoCallView'
import IMAVActiveAudioCallView from '../IMAVActiveAudioCallView/IMAVActiveAudioCallView'
import { useCurrentUser } from '../../../onboarding'

const IMAVCallContainerView = props => {
  const { localized } = useTranslations()

  const { store } = useContext(ReactReduxContext)
  const dispatch = useDispatch()
  const currentUser = useCurrentUser()
  const activeCallData = useSelector(state => state.avChat.activeCallData)

  const [localStream, setLocalStream] = useState(null)
  const [remoteStreams, setRemoteStreams] = useState(null)

  const apiManager = useRef(null)
  const avTracker = useRef(null)
  const avChatCoordinator = useRef(null)
  const streamManager = useRef(null)
  const streamManagerConstructorLock = useRef(false) // we need to create a single instance of streamManager per device. We need this lock to avoid a race condition between the signaling server and the getLocalStream method, needed for instantiating a stream manager
  const isSessionCallingPendingRef = useRef(false) // we keep track of whether there's a calling session of any kind or not

  // Twilio variant - turn this to true if you want to use Twilio instead of custom STUN servers
  // If you want to remove Twilio entirely, search for "twilio" in the codebase, and remove all the related code
  const isTwilioEnabled = false
  const twilioVideoRef = useRef()
  const [twilioVideoTracks, setTwilioVideoTracks] = useState(new Map())

  useEffect(() => {
    if (currentUser?.id) {
      processLaunchDataIfNeeded()
      configureCallKeep()

      apiManager.current = new AVAPIManager()
      avChatCoordinator.current = new AVChatCoordinator(apiManager.current)
      avTracker.current = new AVTracker(
        store,
        currentUser?.id,
        apiManager.current,
      )
      avTracker.current.subscribeIfNeeded()
      return () => {
        avTracker.current.unsubscribe()
      }
    }
  }, [currentUser?.id])

  useEffect(() => {
    if (!activeCallData && streamManager.current) {
      // If there's no active call data anymore, but we had a streaming session, we need to tear it down
      tearDownActiveCallSession()
      return
    }

    if (
      isSessionCallingPendingRef.current === false &&
      (activeCallData?.status === 'incoming' ||
        activeCallData?.status === 'outgoing' ||
        activeCallData?.status === 'active')
    ) {
      // if this is the first time we identify a valid session of any kind
      isSessionCallingPendingRef.current = true
    }
    if (isSessionCallingPendingRef.current === true && !activeCallData) {
      // If we used to have a valid user session of any kind, but not anymore
      isSessionCallingPendingRef.current = false
      RNCallKeep.endAllCalls() // We end all call keep calls
    }

    if (activeCallData?.status === 'active' && streamManager.current) {
      // We have an active call, we already had a streaming session, so we update the WebRTC connections
      streamManager.current.handleChangesInActiveParticipants(
        activeCallData.activeParticipants,
      )
    }
    if (
      activeCallData?.status === 'active' &&
      !streamManager.current &&
      !streamManagerConstructorLock.current
    ) {
      streamManagerConstructorLock.current = true

      if (isTwilioEnabled) {
        // The current user just joined the call, so we start a streaming connection
        streamManager.current = new IMTwilioStreamManager(
          twilioVideoRef,
          activeCallData?.callID,
        )
        if (activeCallData?.controlsState.muted === true) {
          streamManager.current.updateMicStatusForLocalStream(true)
          muteTwilioStream(false)
        }
        streamManager.current.updateSpeakerStatusForLocalStream(
          activeCallData?.controlsState?.speaker === true,
        )
        startTwilioConnection()
      } else {
        // The current user just joined the call, so we start a streaming session and we update the WebRTC connections
        IMWebRTCStreamManager.getLocalStream(activeCallData?.callType).then(
          localStream => {
            streamManager.current = new IMWebRTCStreamManager(
              currentUser?.id,
              activeCallData?.callID,
              localStream,
              activeCallData?.callType,
              apiManager.current,
              onRemoteStreamsUpdate,
            )
            streamManager.current.handleChangesInActiveParticipants(
              activeCallData.activeParticipants,
            )
            if (activeCallData?.controlsState.muted === true) {
              streamManager.current.updateMicStatusForLocalStream(true)
            }
            streamManager.current.updateSpeakerStatusForLocalStream(
              activeCallData?.controlsState?.speaker === true,
            )
            setLocalStream(localStream)
          },
        )
      }
    }
  }, [activeCallData])

  const onRemoteStreamsUpdate = remoteStreams => {
    setRemoteStreams(remoteStreams)
  }

  const onAcceptCall = () => {
    RNCallKeep.answerIncomingCall(activeCallData.callID)
    avChatCoordinator.current.acceptCall(activeCallData.callID, currentUser)
  }

  const onRejectCall = () => {
    if (isTwilioEnabled) {
      tearDownTwilioConnections()
    }

    RNCallKeep.rejectCall(activeCallData?.callID)

    avChatCoordinator.current.rejectCall(activeCallData, currentUser, dispatch)
  }

  const onCallExit = () => {
    // The current user was in a call, and they exited it
    tearDownActiveCallSession()
    avChatCoordinator.current.rejectCall(activeCallData, currentUser, dispatch)
  }

  const onToggleMute = () => {
    const newMutedStatus =
      activeCallData?.controlsState?.muted === true ? false : true
    const updatedActiveCallData = {
      ...activeCallData,
      controlsState: {
        speaker: activeCallData.controlsState.speaker,
        muted: newMutedStatus,
      },
    }
    if (streamManager.current) {
      streamManager.current.updateMicStatusForLocalStream(newMutedStatus)
    }
    if (isTwilioEnabled) {
      muteTwilioStream(!newMutedStatus)
    }
    dispatch(setActiveCallData(updatedActiveCallData))
  }

  const onToggleSpeaker = () => {
    const newSpeakerStatus =
      activeCallData?.controlsState?.speaker === true ? false : true

    const updatedActiveCallData = {
      ...activeCallData,
      controlsState: {
        speaker: newSpeakerStatus,
        muted: activeCallData.controlsState.muted,
      },
    }
    if (streamManager.current) {
      streamManager.current.updateSpeakerStatusForLocalStream(newSpeakerStatus)
    }
    dispatch(setActiveCallData(updatedActiveCallData))
  }

  const tearDownActiveCallSession = () => {
    console.log('tearDownActiveCallSession for user ' + currentUser?.id)
    if (streamManager.current) {
      streamManager.current.closeAllConnections()
      streamManager.current = null
      streamManagerConstructorLock.current = false
    }
    RNCallKeep.endAllCalls()
    if (isTwilioEnabled) {
      tearDownTwilioConnections()
    }
  }

  const configureCallKeep = () => {
    console.log('configureCallKeep')
    RNCallKeep.addEventListener('answerCall', body => {
      console.log(
        'RNCallKeep - answered call from native UI ' + JSON.stringify(body),
      )
      const callID = body.callUUID
      if (callID && currentUser) {
        avChatCoordinator.current.acceptCall(callID, currentUser)
      }
    })
    RNCallKeep.addEventListener('endCall', body => {
      console.log(
        'RNCallKeep - ended call from native UI ' + JSON.stringify(body),
      )
      const callID = body.callUUID
      if (callID && currentUser) {
        if (isTwilioEnabled) {
          tearDownTwilioConnections()
        }
        avChatCoordinator.current.rejectCallByCallID(
          callID,
          currentUser,
          dispatch,
        )
      }
    })
  }

  /*
   * On Android, the app is woken up when a remote message is received (background push notification), and it presents
   * the native calling screen. Once user accepts the native calling screen, the app becomes active, and we place the user
   * in the call directly. This is what this method does.
   * This method basically enables calls when screen is locked on Android.
   */
  const processLaunchDataIfNeeded = () => {
    if (Platform.OS !== 'android') {
      return
    }
    console.log('processLaunchDataIfNeeded')

    LaunchManager.getLaunchManagerData(callID => {
      console.log(' android app awake with data: ')
      console.log(callID)
      if (callID) {
        avChatCoordinator.current.acceptCall(callID, currentUser)
      }
    })
  }

  // Twilio methods - remove all these if you want to remove Twilio entirely:

  const getTwilioAccessToken = async () => {
    const identity = currentUser?.id
    const callID = activeCallData?.callID

    try {
      const res = await fetch(
        `${TWILIO_SERVER_ENDPOINT}/?identity=${identity}&room=${callID}`,
        {
          method: 'GET',
          headers: new Headers({
            'content-type': 'application/json',
          }),
        },
      )

      return res.json()
    } catch (error) {
      console.log(error)
    }
  }

  const startTwilioConnection = async () => {
    console.log('startTwilioConnection for user ' + currentUser?.id)

    const callID = activeCallData?.callID
    const token = await getTwilioAccessToken()
    console.log(
      'retrieved twilio token for user ' + currentUser?.id + ' ' + token,
    )

    if (token) {
      if (Platform.OS === 'android') {
        await requestAudioPermission()
        await requestCameraPermission()
      }
      twilioVideoRef.current.connect({
        roomName: callID,
        accessToken: token,
      })
      if (activeCallData?.controlsState?.muted == true) {
        muteTwilioStream(false)
      }
    }
  }

  const tearDownTwilioConnections = () => {
    console.log('tearDownTwilioConnections')
    twilioVideoRef.current?.disconnect()
    setTwilioVideoTracks(new Map())
  }

  const muteTwilioStream = audioEnabled => {
    twilioVideoRef.current?.setLocalAudioEnabled(audioEnabled)
  }

  const onFlipButtonPress = () => {
    twilioVideoRef.current?.flipCamera()
  }

  const onRoomDidConnect = () => {
    console.log('onRoomDidConnect')
    // twilio streams always start on speaker, this is an workaround to honor the actual speaker flag - keep in mind we need to hack around this bug with a 1 second timeout
    setTimeout(() => {
      streamManager.current?.updateSpeakerStatusForLocalStream(
        activeCallData?.controlsState?.speaker == true,
      )
      twilioVideoRef.current?.toggleSoundSetup(
        activeCallData?.controlsState?.speaker == true,
      )
    }, 1000)
  }

  const onRoomDidDisconnect = ({ error }) => {
    console.log('onRoomDidDisconnect ERROR: ', error)
  }

  const onRoomDidFailToConnect = error => {
    console.log('onRoomDidFailToConnect ERROR: ', error)
  }

  const onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log(
      'onParticipantAddedVideoTrack for user ' +
        currentUser?.id +
        ' track sid ' +
        track.trackSid +
        ' participant sid ' +
        participant.sid,
    )
    const newVideoTracks = new Map([
      ...twilioVideoTracks,
      [
        track.trackSid,
        { participantSid: participant.sid, videoTrackSid: track.trackSid },
      ],
    ])
    setTwilioVideoTracks(newVideoTracks)
  }

  const onParticipantAddedAudioTrack = track => {
    console.log('onParticipantAddedAudioTrack for user ' + currentUser?.id)
  }

  const onParticipantRemovedVideoTrack = ({ participant, track }) => {
    var newVideoTracks = twilioVideoTracks
    newVideoTracks.delete(track.trackSid)
    setTwilioVideoTracks(new Map([...newVideoTracks]))
  }

  const requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: localized('Need permission to access microphone'),
        message: localized(
          'To run this demo we need permission to access your microphone',
        ),
        buttonNegative: localized('Cancel'),
        buttonPositive: localized('OK'),
      },
    )
  }

  const requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: localized('Need permission to access camera'),
      message: localized(
        'To run this demo we need permission to access your camera',
      ),
      buttonNegative: localized('Cancel'),
      buttonPositive: localized('OK'),
    })
  }

  const renderTwilioVideoIfNeeded = () => {
    if (isTwilioEnabled) {
      return (
        <TwilioVideo
          ref={twilioVideoRef}
          onRoomDidConnect={onRoomDidConnect}
          onRoomDidDisconnect={onRoomDidDisconnect}
          onRoomDidFailToConnect={onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={onParticipantAddedVideoTrack}
          onParticipantAddedAudioTrack={onParticipantAddedAudioTrack}
          onParticipantRemovedVideoTrack={onParticipantRemovedVideoTrack}
        />
      )
    }
    return null
  }
  // End of Twilio methods

  // Rendering the views
  if (!activeCallData) {
    // No calls were requested
    return null
  }
  /*
  activeCallData : {
    status: incoming | outgoing | active | ending
    callType: audio | video
    channelID,
    channelTitle,
    allChannelParticipants,
    activeParticipants,
    controlsState: {
      muted: true | false,
      speaker: true | false
    }
*/
  if (
    activeCallData?.status === 'incoming' ||
    activeCallData?.status === 'outgoing'
  ) {
    // Call hasn't started yet, but it was requested by someone
    const allChannelParticipants = activeCallData?.allChannelParticipants
    const otherParticipants = allChannelParticipants?.filter(
      user => user?.id !== currentUser?.id,
    )
    const callStatusLabelTitle =
      activeCallData.callType == 'video'
        ? activeCallData?.status == 'incoming'
          ? localized('Incoming Video Call') + '...'
          : localized('Video Calling') + '...'
        : activeCallData?.status == 'incoming'
        ? localized('Incoming Audio Call') + '...'
        : localized('Audio Calling') + '...'

    return (
      <Modal
        visible={true}
        animationType={'fade'}
        presentationStyle={'fullScreen'}>
        <IMAVAudioVideoCallingView
          channelTitle={activeCallData.channelName}
          callType={activeCallData.callType}
          otherParticipants={otherParticipants}
          shouldDisplayAcceptButton={activeCallData.status === 'incoming'}
          shouldStartRingtone={activeCallData.status === 'incoming'}
          callStatusLabelTitle={callStatusLabelTitle}
          isSpeaker={activeCallData?.controlsState?.speaker}
          isMuted={activeCallData?.controlsState?.muted}
          onToggleSpeaker={onToggleSpeaker}
          onToggleMute={onToggleMute}
          onAcceptCall={onAcceptCall}
          onRejectCall={onRejectCall}
        />
        {renderTwilioVideoIfNeeded()}
      </Modal>
    )
  }

  if (
    activeCallData?.status === 'active' &&
    activeCallData?.callType === 'video'
  ) {
    // Video call already started yet, and current user status is "active" in the call, so we land them directly in the call
    return (
      <Modal
        visible={true}
        animationType={'fade'}
        presentationStyle={'fullScreen'}>
        <IMAVActiveVideoCallView
          localStream={localStream}
          remoteStreams={remoteStreams}
          isTwilioEnabled={isTwilioEnabled}
          twilioVideoTracksMap={twilioVideoTracks}
          isSpeaker={activeCallData?.controlsState.speaker}
          isMuted={activeCallData?.controlsState.muted}
          onToggleSpeaker={onToggleSpeaker}
          onToggleMute={onToggleMute}
          onCallExit={onCallExit}
        />
        {renderTwilioVideoIfNeeded()}
      </Modal>
    )
  }

  if (
    activeCallData?.status === 'active' &&
    activeCallData?.callType === 'audio'
  ) {
    // Audio call already started yet, and current user status is "active" in the call, so we land them directly in the call
    const allChannelParticipants = activeCallData?.allChannelParticipants
    const otherParticipants = allChannelParticipants.filter(
      user => user?.id !== currentUser?.id,
    )
    return (
      <Modal
        visible={true}
        animationType={'fade'}
        presentationStyle={'fullScreen'}>
        <IMAVActiveAudioCallView
          callStartTimestamp={activeCallData?.callStartTimestamp}
          channelTitle={activeCallData.channelName}
          otherParticipants={otherParticipants}
          isSpeaker={activeCallData?.controlsState.speaker}
          isMuted={activeCallData?.controlsState.muted}
          onToggleSpeaker={onToggleSpeaker}
          onToggleMute={onToggleMute}
          onEndCall={onCallExit}
        />
        {renderTwilioVideoIfNeeded()}
      </Modal>
    )
  }

  return null
}

export default IMAVCallContainerView
