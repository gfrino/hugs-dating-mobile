import React, { useEffect, useRef, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { BlurView } from 'expo-blur'
import styles from './styles'

const assets = {
  phoneCallIcon: require('../../assets/phone-call.png'),
  endCallIcon: require('../../assets/end-call.png'),
  microphoneIcon: require('../../assets/microphone.png'),
  mutedMicrophoneIcon: require('../../assets/muted-mic-icon.png'),
  speakerIcon: require('../../assets/speaker.png'),
}

const IMAVActiveAudioCallView = props => {
  const {
    channelTitle,
    callStartTimestamp,
    otherParticipants,
    isSpeaker,
    isMuted,
    onToggleSpeaker,
    onToggleMute,
    onEndCall,
  } = props

  const [seconds, setSeconds] = useState(null)
  const [minutes, setMinutes] = useState(null)
  const [hours, setHours] = useState(null)
  const timer = useRef(null)

  const title =
    channelTitle?.length > 0
      ? channelTitle
      : `${otherParticipants[0]?.firstName ?? ''} ${
          otherParticipants[0]?.lastName ?? ''
        }`

  useEffect(() => {
    if (callStartTimestamp) {
      timer.current = setInterval(() => {
        const currentTimestamp = Math.round(new Date().getTime() / 1000)
        var difference =
          parseInt(currentTimestamp) - parseInt(callStartTimestamp)

        var hoursDifference = Math.floor(difference / 60 / 60)
        difference -= hoursDifference * 60 * 60
        var minutesDifference = Math.floor(difference / 60)
        difference -= minutesDifference * 60
        var secondsDifference = Math.floor(difference)

        setMinutes(minutesDifference)
        setHours(hoursDifference)
        setSeconds(secondsDifference)
      }, 1000)
    }
    return () => {
      timer.current && clearInterval(timer.current)
    }
  }, [callStartTimestamp])

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
            index === 2 && isMultiAvatar && styles.profilePictureContainerRight,
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

  const formatTime = time => {
    if (time < 10) {
      return '0' + time.toString()
    }
    return time.toString()
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
          {callStartTimestamp && minutes != null && seconds != null && (
            <Text style={styles.callStatusLabelTitle}>
              {hours !== null && hours > 0 && (
                <Text>{formatTime(hours)} :</Text>
              )}
              {formatTime(minutes)} : {formatTime(seconds)}
            </Text>
          )}
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
            onPress={onEndCall}>
            <Image source={assets.endCallIcon} style={styles.imageIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </FastImage>
  )
}

export default IMAVActiveAudioCallView
