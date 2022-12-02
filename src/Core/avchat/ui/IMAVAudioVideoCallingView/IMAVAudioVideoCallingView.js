import React, { useEffect } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import InCallManager from 'react-native-incall-manager'
import { BlurView } from 'expo-blur'
import styles from './styles'

const assets = {
  phoneCallIcon: require('../../assets/phone-call.png'),
  endCallIcon: require('../../assets/end-call.png'),
  microphoneIcon: require('../../assets/microphone.png'),
  mutedMicrophoneIcon: require('../../assets/muted-mic-icon.png'),
  speakerIcon: require('../../assets/speaker.png'),
}

const IMAVAudioVideoCallingView = props => {
  const {
    channelTitle,
    callType,
    otherParticipants,
    shouldDisplayAcceptButton,
    shouldStartRingtone,
    callStatusLabelTitle,
    isSpeaker,
    isMuted,
    onToggleSpeaker,
    onToggleMute,
    onRejectCall,
    onAcceptCall,
  } = props

  const title =
    channelTitle?.length > 0
      ? channelTitle
      : `${otherParticipants[0]?.firstName ?? ''} ${
          otherParticipants[0]?.lastName ?? ''
        }`

  useEffect(() => {
    if (callType === 'video') {
      console.log('InCallManager start')
      if (shouldStartRingtone) {
        InCallManager.start({ media: 'audio/video', ringback: '_DTMF_' })
      } else {
        InCallManager.start({ media: 'audio/video' })
      }
    } else {
      if (shouldStartRingtone) {
        InCallManager.start({ media: 'audio', ringback: '_DTMF_' })
      } else {
        InCallManager.start({ media: 'audio' })
      }
    }
    return () => {
      InCallManager.stop()
    }
  }, [])

  const renderUserAvatar = (user, index) => {
    const isMultiAvatar = otherParticipants.length > 1
    if (index < 3) {
      return (
        <View
          key={index + ''}
          style={[
            styles.profilePictureContainer,
            index === 0 && isMultiAvatar && styles.profilePictureContainerLeft,
            index === 1 &&
              isMultiAvatar &&
              otherParticipants.length > 2 &&
              styles.profilePictureContainerCenter,
            index === 2 && isMultiAvatar && styles.profilePictureContainerLeft,
          ]}>
          <FastImage
            source={{ uri: user.profilePictureURL }}
            style={styles.profilePicture}
          />
        </View>
      )
    }
    return null
  }

  return (
    <FastImage
      blurRadius={20}
      source={{ uri: otherParticipants[0]?.profilePictureURL }}
      style={styles.imageBackground}>
      <BlurView tint={'dark'} intensity={100} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            {otherParticipants.map((user, index) =>
              renderUserAvatar(user, index),
            )}
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.callStatusLabelTitle}>
            {callStatusLabelTitle}
          </Text>
        </View>
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
            style={[
              styles.controlIconContainer,
              { backgroundColor: '#fc2e50' },
            ]}
            onPress={onRejectCall}>
            <Image source={assets.endCallIcon} style={styles.imageIcon} />
          </TouchableOpacity>
          {shouldDisplayAcceptButton && (
            <TouchableOpacity
              style={[
                styles.controlIconContainer,
                { backgroundColor: '#6abd6e' },
              ]}
              onPress={onAcceptCall}>
              <Image source={assets.phoneCallIcon} style={styles.imageIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </FastImage>
  )
}

export default IMAVAudioVideoCallingView
