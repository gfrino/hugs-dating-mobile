import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Text,
  Alert,
} from 'react-native'
import { Audio } from 'expo-av'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import { KeyboardAccessoryView } from 'react-native-ui-lib/keyboard'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import './BottomAudioRecorder'

const assets = {
  cameraFilled: require('../assets/camera-filled.png'),
  send: require('../assets/send.png'),
  mic: require('../assets/microphone.png'),
  close: require('../assets/close-x-icon.png'),
  newDocument: require('../assets/new-document.png'),
}

function BottomInput(props) {
  const {
    value,
    onChangeText,
    onAudioRecordDone,
    onSend,
    onAddMediaPress,
    onAddDocPress,
    uploadProgress,
    inReplyToItem,
    onReplyingToDismiss,
    isPremium,
  } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const textInputRef = useRef(null)
  const [customKeyboard, setCustomKeyboard] = useState({
    component: undefined,
    initialProps: undefined,
  })

  useEffect(() => {
    // textInputRef.current?.focus();
  }, [])

  const isDisabled = () => {
    if (/\S/.test(value)) {
      return false
    } else {
      return true
    }
  }

  const onKeyboardResigned = useCallback(() => {
    resetKeyboardView()
  }, [resetKeyboardView])

  const resetKeyboardView = () => {
    setCustomKeyboard({})
  }

  const onVoiceRecord = useCallback(async () => {
    const response = await Audio.getPermissionsAsync()
    if (response.status === 'granted') {
      showKeyboardView('BottomAudioRecorder')
    } else if (response.status === 'denied') {
      Alert.alert(
        localized('Audio permission denied'),
        localized(
          'You must enable audio recording permissions in order to send a voice note.',
        ),
      )
    } else {
      const response = await Audio.requestPermissionsAsync()
      if (response.status === 'granted') {
        onVoiceRecord()
      }
    }
  }, [onVoiceRecord, localized])

  const showKeyboardView = useCallback(
    component => {
      setCustomKeyboard({
        component,
        initialProps: { theme, appearance, localized },
      })
    },
    [setCustomKeyboard],
  )

  const onCustomKeyboardItemSelected = (keyboardId, params) => {
    onAudioRecordDone(params)
  }

  const renderBottomInput = () => {
    return (
      <View style={styles.bottomContentContainer}>
        {inReplyToItem && (
          <View style={styles.inReplyToView}>
            <Text style={styles.replyingToHeaderText}>
              {localized('Replying to')}{' '}
              <Text style={styles.replyingToNameText}>
                {inReplyToItem.senderFirstName || inReplyToItem.senderLastName}
              </Text>
            </Text>
            <Text style={styles.replyingToContentText}>
              {inReplyToItem.content}
            </Text>
            <TouchableHighlight
              style={styles.replyingToCloseButton}
              onPress={onReplyingToDismiss}>
              <Image source={assets.close} style={styles.replyingToCloseIcon} />
            </TouchableHighlight>
          </View>
        )}
        <View style={[styles.progressBar,{ width: `${uploadProgress}%` }]} />
        <View style={styles.inputBar}>
          <TouchableOpacity
            onPress={onAddDocPress}
            style={styles.inputIconContainer}>
            <Image style={styles.inputIcon} source={assets.newDocument} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAddMediaPress}
            style={styles.inputIconContainer}>
            <Image style={styles.inputIcon} source={assets.cameraFilled} />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            {isPremium ? (
              <TouchableOpacity
                onPress={onVoiceRecord}
                style={styles.micIconContainer}>
                <Image style={styles.micIcon} source={assets.mic} />
              </TouchableOpacity>
            ) : null}
            <AutoGrowingTextInput
              maxHeight={100}
              style={styles.input}
              ref={textInputRef}
              value={value}
              multiline={true}
              placeholder={localized('Start typing')}
              placeholderTextColor={theme.colors[appearance].secondaryText}
              underlineColorAndroid="transparent"
              onChangeText={text => onChangeText(text)}
              onFocus={resetKeyboardView}
            />
          </View>
          <TouchableOpacity
            disabled={isDisabled()}
            onPress={onSend}
            style={[
              styles.inputIconContainer,
              isDisabled() ? { opacity: 0.2 } : { opacity: 1 },
            ]}>
            <Image style={styles.inputIcon} source={assets.send} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAccessoryView
      renderContent={renderBottomInput}
      useSafeArea={false}
      kbInputRef={textInputRef}
      kbComponent={customKeyboard.component}
      kbInitialProps={customKeyboard.initialProps}
      onItemSelected={onCustomKeyboardItemSelected}
      onKeyboardResigned={onKeyboardResigned}
      manageScrollView={false}
      requiresSameParentToManageScrollView={true}
      revealKeyboardInteractive={true}
    />
  )
}

export default BottomInput
