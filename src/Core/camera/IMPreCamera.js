import React, { useRef, useEffect, useState } from 'react'
import { TouchableOpacity, Animated, Text, View, Image } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity)

const videoSpeedConfig = [
  { title: '0.3x', rate: 0.35 },
  { title: '0.5x', rate: 0.55 },
  { title: '1x', rate: 1 },
  { title: '2x', rate: 1.3 },
  { title: '3x', rate: 2 },
]

function IMPreCamera(props) {
  const {
    onCameraClose,
    onCameraFlip,
    takePicture,
    record,
    stopRecording,
    flashMode,
    onOpenPhotos,
    onFlashToggle,
    onSoundPress,
    onVideoSpeedChange,
    soundTitle,
    soundDuration,
    useExternalSound,
  } = props

  const [minutesCounter, setMinutesCounter] = useState('00')
  const [secondsCounter, setSecondsCounter] = useState('00')
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeedVisible, setIsSpeedVisible] = useState(true)
  const [selectedVideoSpeed, setSelectedVideoSpeed] = useState(2)

  const minutesCounterRef = useRef('00')
  const secondsCounterRef = useRef('00')
  const recordAnimatedValue = useRef(new Animated.Value(1))
  const caputureAnimatedValue = useRef(new Animated.Value(0))
  const longPressActive = useRef(false)
  const shouldAnimate = useRef(true)
  const timer = useRef(null)

  const flashModeIcon = {
    0: require('../../assets/icons/flash-on.png'),
    1: require('../../assets/icons/flash-auto.png'),
    2: require('../../assets/icons/flash-off.png'),
  }

  useEffect(() => {
    if (!soundDuration) {
      return
    }
    const currentDurration = Number(`${minutesCounter}${secondsCounter}`)
    const durationLimit = Number(soundDuration?.replace(/\:/g, ''))
    if (soundDuration && currentDurration >= durationLimit) {
      onCaptureButtonPressOut()
    }
  }, [soundDuration, secondsCounter, minutesCounter])

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isSpeedVisible) {
      onVideoSpeedChange(videoSpeedConfig[selectedVideoSpeed].rate)
    } else {
      onVideoSpeedChange(null)
    }
  }, [isSpeedVisible])

  const onTimerStart = () => {
    timer.current = setInterval(() => {
      let num = (Number(secondsCounterRef.current) + 1).toString(),
        count = minutesCounterRef.current

      if (Number(secondsCounterRef.current) === 59) {
        count = (Number(minutesCounterRef.current) + 1).toString()
        num = '00'
      }

      minutesCounterRef.current = count.length === 1 ? '0' + count : count
      secondsCounterRef.current = num.length === 1 ? '0' + num : num

      setSecondsCounter(secondsCounterRef.current)
      setMinutesCounter(minutesCounterRef.current)
    }, 1000)
  }

  const onTimerStop = () => {
    clearInterval(timer.current)
  }

  const onTimerClear = () => {
    timer.current = null
    minutesCounterRef.current = '00'
    secondsCounterRef.current = '00'
    setMinutesCounter('00')
    setSecondsCounter('00')
  }

  const onRecordAnimate = () => {
    Animated.sequence([
      Animated.timing(recordAnimatedValue.current, {
        duration: 1000,
        toValue: 2,
        useNativeDriver: false,
      }),
      Animated.timing(recordAnimatedValue.current, {
        duration: 1000,
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (shouldAnimate.current) {
        onRecordAnimate()
      }
    })
  }

  const onButtonAnimate = end => {
    Animated.timing(caputureAnimatedValue.current, {
      duration: 1200,
      toValue: end,
      useNativeDriver: false,
    }).start()
  }

  const onCaptureButtonPressOut = () => {
    if (longPressActive.current) {
      longPressActive.current = false
      onButtonAnimate(0)
      shouldAnimate.current = false
      onTimerStop()
      onTimerClear()
      stopRecording()
      setIsRecording(false)
    }
  }

  const startAnimation = () => {
    longPressActive.current = true
    shouldAnimate.current = true
    onButtonAnimate(1)
    onRecordAnimate()
    onTimerStart()
    record()
    setIsRecording(true)
  }

  const backgroundColor = recordAnimatedValue.current.interpolate({
    inputRange: [1, 2],
    outputRange: ['rgba(255, 0, 0, 0.2)', 'rgba(255, 0, 0, 0.6)'],
  })

  const captureBackgroundColor = caputureAnimatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f5f6f5', '#ff0000'],
  })

  const opacity = recordAnimatedValue.current.interpolate({
    inputRange: [1, 2],
    outputRange: [0, 0.5],
  })

  const scale = recordAnimatedValue.current.interpolate({
    inputRange: [1, 2],
    outputRange: [1, 2.5],
  })

  const transformScaleStyle = {
    transform: [
      {
        scale,
      },
    ],
  }

  const onVideoSpeedSelected = (speedConfig, index) => {
    setSelectedVideoSpeed(index)
    onVideoSpeedChange(speedConfig.rate)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCameraClose} style={styles.closeButton}>
        <View
          style={[styles.closeCross, { transform: [{ rotate: '45deg' }] }]}
        />
        <View
          style={[styles.closeCross, { transform: [{ rotate: '-45deg' }] }]}
        />
      </TouchableOpacity>
      {longPressActive.current && (
        <View style={styles.timerContainer}>
          <View style={styles.recordDot} />
          <Text style={styles.timer}>
            {minutesCounter} : {secondsCounter}
          </Text>
        </View>
      )}

      {useExternalSound && !isRecording && (
        <TouchableOpacity
          onPress={onSoundPress}
          style={styles.headerTitleContainer}>
          <Image
            source={require('../../assets/icons/musical-notes.png')}
            style={styles.optionIcon}
          />
          <Text style={styles.headerTitle}>{soundTitle}</Text>
        </TouchableOpacity>
      )}

      {useExternalSound && !isRecording && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={onCameraFlip}
            style={styles.optionItemContainer}>
            <Image
              source={require('../../assets/icons/camera-rotate.png')}
              style={styles.optionIcon}
            />
            <Text style={styles.iconTitle}>{'Flip'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsSpeedVisible(!isSpeedVisible)}
            style={styles.optionItemContainer}>
            <Image
              source={require('../../assets/icons/speed.png')}
              style={styles.optionIcon}
            />
            <Text style={styles.iconTitle}>{'Speed'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onFlashToggle}
            style={styles.optionItemContainer}>
            <Image
              source={flashModeIcon[flashMode]}
              style={styles.optionIcon}
            />
            <Text style={styles.iconTitle}>{'Flash'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {useExternalSound && isSpeedVisible && (
        <View style={styles.speedContainer}>
          {videoSpeedConfig.map((speedConfig, index) => {
            const isSelectedSpeed = selectedVideoSpeed === index
            return (
              <TouchableOpacity
                onPress={() => onVideoSpeedSelected(speedConfig, index)}
                key={`${index}`}
                style={[
                  styles.speedItemContainer,
                  isSelectedSpeed && styles.selectedSpeedItemContainer,
                ]}>
                <Text
                  style={[
                    styles.speedTitle,
                    isSelectedSpeed && styles.selectedSpeedTitle,
                  ]}>
                  {speedConfig.title}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}

      <View style={styles.control}>
        <TouchableOpacity onPress={onCameraFlip}>
          <Image
            source={require('../../assets/icons/camera-rotate.png')}
            style={styles.imageIcon}
          />
        </TouchableOpacity>
        <View style={{ marginHorizontal: 11 }}>
          <Animated.View
            style={[
              styles.capture,
              { backgroundColor },
              transformScaleStyle,
              { opacity },
            ]}></Animated.View>
          <AnimatedButton
            activeOpacity={0.7}
            onLongPress={startAnimation}
            onPressOut={onCaptureButtonPressOut}
            onPress={takePicture}
            style={[
              styles.capture,
              {
                position: 'absolute',
                top: 0,
                backgroundColor: captureBackgroundColor,
              },
            ]}
          />
        </View>

        <TouchableOpacity onPress={onOpenPhotos}>
          <Image
            source={require('../../assets/icons/library-landscape.png')}
            style={styles.imageIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

IMPreCamera.propTypes = {
  onCameraClose: PropTypes.func,
  onCameraFlip: PropTypes.func,
  takePicture: PropTypes.func,
  onOpenPhotos: PropTypes.func,
}

export default IMPreCamera
