import React, { useState } from 'react'
import { Image, Platform, TouchableOpacity, View } from 'react-native'
import { RTCView } from 'react-native-webrtc'
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc'
import styles from './styles'

const assets = {
  phoneCallIcon: require('../../assets/phone-call.png'),
  endCallIcon: require('../../assets/end-call.png'),
  microphoneIcon: require('../../assets/microphone.png'),
  mutedMicrophoneIcon: require('../../assets/muted-mic-icon.png'),
  speakerIcon: require('../../assets/speaker.png'),
}

const IMAVActiveVideoCallView = props => {
  const {
    localStream,
    remoteStreams,
    isTwilioEnabled,
    twilioVideoTracksMap,
    isMuted,
    isSpeaker,
    onToggleSpeaker,
    onToggleMute,
    onCallExit,
  } = props

  const streams = (
    remoteStreams
      ? Object.keys(remoteStreams).map(key => remoteStreams[key])
      : []
  ).concat([localStream])

  const twilioVideoTracksArray = twilioVideoTracksMap
    ? Array.from(twilioVideoTracksMap, ([trackSid, trackIdentifier]) => ({
        trackSid: trackSid,
        trackIdentifier: trackIdentifier,
      }))
    : []

  const [fullscreenStreamIndex, setFullscreenStreamIndex] = useState(0)

  const switchStreams = newIndex => {
    // Make the newIndex stream fullscreen
    setFullscreenStreamIndex(newIndex)
  }

  const renderSecondaryStream = (stream, index) => {
    if (index == fullscreenStreamIndex) {
      return null
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          switchStreams(index)
        }}
        key={index + ''}
        style={styles.secondaryStream}>
        <RTCView
          style={styles.rtcStream}
          objectFit={Platform.OS === 'ios' ? 'cover' : 'contain'}
          zOrder={2}
          streamURL={stream.toURL()}
        />
      </TouchableOpacity>
    )
  }

  // Start Twilio
  const twilioRenderPrimaryVideoTrack = () => {
    if (fullscreenStreamIndex == -1) {
      // If user selected the own stream to be the full screen one
      return (
        <View style={styles.fullscreenStreamContainer}>
          <TwilioVideoLocalView enabled={true} style={styles.rtcStream} />
        </View>
      )
    }
    if (fullscreenStreamIndex < twilioVideoTracksArray?.length) {
      // If someone else's stream is full screen
      const track = twilioVideoTracksArray[fullscreenStreamIndex]
      return (
        <View style={styles.fullscreenStreamContainer}>
          <TwilioVideoParticipantView
            style={styles.rtcStream}
            key={track.trackSid}
            trackIdentifier={track.trackIdentifier}
            scaleType="fill"
          />
        </View>
      )
    }
    return null
  }

  const twilioRenderSecondaryVideoTrack = (
    [trackSid, trackIdentifier],
    index,
  ) => {
    if (fullscreenStreamIndex == index) {
      // the index-th stream is the full screen one (primary), so we don't render it as a secondary stream
      return null
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          switchStreams(index)
        }}
        key={index + ''}
        style={styles.secondaryStream}>
        <TwilioVideoParticipantView
          style={styles.rtcStream}
          key={trackSid}
          trackIdentifier={trackIdentifier}
          scaleType="fill"
        />
      </TouchableOpacity>
    )
  }

  const twilioRenderSecondaryVideoTracks = () => {
    if (fullscreenStreamIndex == -1) {
      // If user selected the own stream to be the full screen one, we simply render all videoTracks (so *other* streams as secondary)
      return (
        <View style={styles.secondaryStreamsContainer}>
          {Array.from(twilioVideoTracksMap, twilioRenderSecondaryVideoTrack)}
        </View>
      )
    }
    // If the full screen stream is from a different user, we render the local stream view as the first stream in the secondary streams list, and then all the others
    return (
      <View style={styles.secondaryStreamsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Platform.OS === 'ios' && switchStreams(-1) // allow switching the local stream as the full screen stream only on iOS, as Twilio has a bug on Android, when overlapping a TwilioVideoParticipantView *underneath* a TwilioVideoLocalView
          }}
          key={'-1'}
          style={styles.secondaryStream}>
          <TwilioVideoLocalView enabled={true} style={styles.rtcStream} />
        </TouchableOpacity>

        {Array.from(twilioVideoTracksMap, twilioRenderSecondaryVideoTrack)}
      </View>
    )
  }
  // End Twilio

  const renderActiveCallButtons = () => {
    return (
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={onToggleSpeaker}
          style={[
            styles.controlIconContainer,
            !isSpeaker && { backgroundColor: '#5b5b5c' },
          ]}>
          <Image
            source={assets.speakerIcon}
            style={[styles.imageIcon, !isSpeaker && { tintColor: '#fff' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onToggleMute}
          style={[
            styles.controlIconContainer,
            isMuted && { backgroundColor: '#5b5b5c' },
          ]}>
          <Image
            source={
              isMuted ? assets.mutedMicrophoneIcon : assets.microphoneIcon
            }
            style={[styles.imageIcon, isMuted && { tintColor: '#fff' }]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlIconContainer, { backgroundColor: '#fc2e50' }]}
          onPress={onCallExit}>
          <Image source={assets.endCallIcon} style={styles.imageIcon} />
        </TouchableOpacity>
      </View>
    )
  }

  if (isTwilioEnabled) {
    return (
      <View style={styles.container}>
        {twilioRenderPrimaryVideoTrack()}
        {twilioRenderSecondaryVideoTracks()}
        {renderActiveCallButtons()}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {streams &&
        fullscreenStreamIndex < streams?.length &&
        streams[fullscreenStreamIndex] && (
          <TouchableOpacity style={styles.fullscreenStreamContainer}>
            <RTCView
              style={styles.rtcStream}
              mirror={true}
              objectFit={'cover'}
              zOrder={1}
              streamURL={streams[fullscreenStreamIndex].toURL()}
            />
          </TouchableOpacity>
        )}

      {streams?.length > 1 && (
        <View style={styles.secondaryStreamsContainer}>
          {streams.map((stream, index) => renderSecondaryStream(stream, index))}
        </View>
      )}
      {renderActiveCallButtons()}
    </View>
  )
}

export default IMAVActiveVideoCallView
