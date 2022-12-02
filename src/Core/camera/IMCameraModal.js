import React, {
  PureComponent,
  Fragment,
  useRef,
  useState,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import IMPreCamera from './IMPreCamera'
import IMPostCamera from './IMPostCamera'
import styles from './styles'

export default function IMCameraModal(props) {
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
  const [isCameraPlay, setIsCameraPlay] = useState(true)
  const [imageSource, setImageSource] = useState('')
  const [videoRate, setVideoRate] = useState(1.0)

  const cameraRef = useRef(null)

  useEffect(() => {
    if (imageSource?.uri) {
      toggleCameraPlay()
    }
  }, [imageSource])

  const toggleCameraPlay = () => {
    setIsCameraPlay(prevIsCameraPlay => !prevIsCameraPlay)
  }

  const onMediaFileAvailable = mediaFile => {
    const { uri, type } = mediaFile
    if (props.muteRecord) {
      toggleCameraPlay()
      props.onStopRecordingVideo(mediaFile, videoRate)
      return
    }
    setImageSource({
      ...mediaFile,
      uri,
      mime: type,
      rate: videoRate,
    })
  }

  const takePicture = async () => {
    if (props.useExternalSound) {
      return
    }
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, pauseAfterCapture: true }
      const file = await cameraRef.current.takePictureAsync(options)
      const uri = file.uri
      console.log('takePicture', file)
      if (uri) {
        onMediaFileAvailable({ uri, type: 'image' })
      }
    }
  }

  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        props.onStartRecordingVideo && props.onStartRecordingVideo()
        const videoRecordPromise = cameraRef.current.recordAsync({
          mute: props.muteRecord,
          quality: '720p',
        })

        if (videoRecordPromise) {
          const file = await videoRecordPromise
          const uri = file.uri
          if (uri) {
            onMediaFileAvailable({ uri, type: 'video' })
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const stopVideoRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording()
    }
  }

  const onOpenPhotos = async () => {
    const pickerMediaType =
      ImagePicker.MediaTypeOptions[props.pickerMediaType] ??
      ImagePicker.MediaTypeOptions.All
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync(false)

    if (permissionResult.granted === false) {
      return
    }

    let mediaFile = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: pickerMediaType,
    })

    if (mediaFile.uri) {
      onMediaFileAvailable(mediaFile)
    }
  }

  const onFlashToggle = () => {
    let newFlashMode = Camera.Constants.FlashMode.torch

    if (flashMode === newFlashMode) {
      newFlashMode = Camera.Constants.FlashMode.off
    }

    if (flashMode === Camera.Constants.FlashMode.off) {
      newFlashMode = Camera.Constants.FlashMode.torch
    }

    setFlashMode(newFlashMode)
  }

  const onCameraFlip = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    )
  }

  const onCancelPostCamera = () => {
    cameraRef.current.resumePreview()
    toggleCameraPlay()
    setImageSource('')
    props.onCancelPost && props.onCancelPost()
  }

  const onPost = () => {
    props.onImagePost(imageSource)
    toggleCameraPlay()
  }

  const onVideoSpeedChange = newSpeed => {
    setVideoRate(newSpeed)
  }

  const onVideoLoadStart = () => {}

  const { isCameraOpen, onCameraClose } = props
  const Container = props.wrapInModal ? Modal : Fragment
  const modalProps = {
    style: styles.container,
    visible: isCameraOpen,
    onDismiss: onCameraClose,
    onRequestClose: onCameraClose,
    animationType: 'slide',
  }

  return (
    <Container {...(props.wrapInModal ? modalProps : {})}>
      <Camera
        ref={cameraRef}
        style={styles.preview}
        type={cameraType}
        flashMode={flashMode}
      />
      {isCameraPlay && (
        <IMPreCamera
          onCameraClose={onCameraClose}
          onCameraFlip={onCameraFlip}
          takePicture={takePicture}
          flashMode={flashMode}
          soundTitle={props.soundTitle}
          onOpenPhotos={onOpenPhotos}
          onFlashToggle={onFlashToggle}
          onSoundPress={props.onSoundPress}
          onVideoSpeedChange={onVideoSpeedChange}
          record={recordVideo}
          soundDuration={props.soundDuration}
          stopRecording={stopVideoRecording}
          useExternalSound={props.useExternalSound}
        />
      )}

      {!!(props.mediaSource || imageSource) && !isCameraPlay && (
        <IMPostCamera
          onCancel={onCancelPostCamera}
          imageSource={props.muteRecord ? props.mediaSource : imageSource}
          onPost={onPost}
          onVideoLoadStart={onVideoLoadStart}
        />
      )}
    </Container>
  )
}

IMCameraModal.propTypes = {
  isCameraOpen: PropTypes.bool,
  onCameraClose: PropTypes.func,
  onImagePost: PropTypes.func,
}

IMCameraModal.defaultProps = {
  muteRecord: false,
  useExternalSound: false,
  wrapInModal: true,
}
