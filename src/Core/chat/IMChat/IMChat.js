import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Alert, ImageBackground, SafeAreaView } from 'react-native'
import PropTypes from 'prop-types'
import ActionSheet from 'react-native-actionsheet'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { useTheme, useTranslations } from 'dopenative'
import TNMediaViewerModal from '../../truly-native/TNMediaViewerModal'
import DialogInput from 'react-native-dialog-input'
import { useChatChannels } from '../.'
import BottomInput from './BottomInput'
import MessageThread from './MessageThread'
import dynamicStyles from './styles'
import { TNActivityIndicator } from '../../truly-native'
import { getUnixTimeStamp } from '~/Core/helpers/timeFormat'

function IMChat(props) {
  const {
    onSendInput,
    onAudioRecordSend,
    messages,
    inputValue,
    onChangeTextInput,
    user,
    loading,
    inReplyToItem,
    onLaunchCamera,
    onOpenPhotos,
    onAddMediaPress,
    uploadProgress,
    mediaItemURLs,
    isMediaViewerOpen,
    selectedMediaIndex,
    onChatMediaPress,
    onMediaClose,
    onChangeName,
    onAddDocPress,
    isRenameDialogVisible,
    groupSettingsActionSheetRef,
    privateSettingsActionSheetRef,
    showRenameDialog,
    onLeave,
    onUserBlockPress,
    onUserReportPress,
    onCancelMatchPress,
    onSenderProfilePicturePress,
    onReplyActionPress,
    onReplyingToDismiss,
    onDeleteThreadItem,
    channelItem,
    onListEndReached,
    isPremium,
    lockData,
  } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const { updateTypingUsers } = useChatChannels()

  const [channel] = useState({})
  const [temporaryInReplyToItem, setTemporaryInReplyToItem] = useState(null)
  const [threadItemActionSheet, setThreadItemActionSheet] = useState({})

  const photoUploadDialogRef = useRef()
  const threadItemActionSheetRef = useRef()

  const hasPreviouslyMarkedTyping = useRef(false)
  const staleUserTyping = useRef(null)

  const inBoundThreadItemSheetOptions = [
    localized('Reply'),
    localized('Cancel'),
  ]
  const outBoundThreadItemSheetOptions = [
    localized('Reply'),
    localized('Delete'),
    localized('Cancel'),
  ]

  useEffect(() => {
    return () => {
      handleIsUserTyping('')
    }
  }, [])

  useEffect(() => {
    if (threadItemActionSheet.options) {
      threadItemActionSheetRef.current.show()
    }
  }, [threadItemActionSheet])

  const handleIsUserTyping = inputValue => {
    clearTimeout(staleUserTyping.current)
    const userID = user.id
    const typingUsers = channelItem?.typingUsers || []
    const typingUsersCopy = [...typingUsers]
    const timestamp =  getUnixTimeStamp();
    const notTypingUser = {
      userID,
      isTyping: false,
      lastUpdate: timestamp,
    }
    const typingUser = {
      userID,
      isTyping: true,
      lastUpdate: timestamp,
    }
    let typingUserIndex = -1

    typingUserIndex = typingUsers.findIndex(
      existingTypingUser => existingTypingUser.userID === userID,
    )

    if (inputValue?.length > 0) {
      if (typingUserIndex > -1) {
        typingUsersCopy[typingUserIndex] = typingUser
      } else {
        typingUsersCopy.push(typingUser)
      }

      (!hasPreviouslyMarkedTyping.current && channelItem) &&
        updateTypingUsers(channelItem.id, typingUsersCopy)
      hasPreviouslyMarkedTyping.current = true
      return
    }

    if (inputValue?.length === 0) {
      if (typingUserIndex > -1) {
        typingUsersCopy[typingUserIndex] = notTypingUser
      } else {
        typingUsersCopy.push(notTypingUser)
      }

      (hasPreviouslyMarkedTyping.current && channelItem) &&
        updateTypingUsers(channelItem.id, typingUsersCopy)
      hasPreviouslyMarkedTyping.current = false
      return
    }
  }

  const handleStaleUserTyping = () => {
    staleUserTyping.current = setTimeout(() => {
      handleIsUserTyping('')
    }, 2000)
  }

  const onChangeText = useCallback(
    text => {
      onChangeTextInput(text)
      handleIsUserTyping(text)
      handleStaleUserTyping()
    },
    [onChangeTextInput, handleIsUserTyping, handleStaleUserTyping],
  )

  const onAudioRecordDone = useCallback(
    item => {
      onAudioRecordSend(item)
    },
    [onAudioRecordSend],
  )

  const onSend = useCallback(() => {
    onSendInput()
    handleIsUserTyping('')
  }, [onSendInput, handleIsUserTyping])

  const onPhotoUploadDialogDone = useCallback(
    index => {
      if (index == 0) {
        onLaunchCamera()
      }

      if (index == 1) {
        onOpenPhotos()
      }
    },
    [onLaunchCamera, onOpenPhotos],
  )

  const onGroupSettingsActionDone = useCallback(
    index => {
      if (index == 0) {
        showRenameDialog(true)
      } else if (index == 1) {
        onLeave()
      }
    },
    [onLeave, showRenameDialog],
  )

  const onPrivateSettingsActionDone = useCallback(
    index => {
      if (index == 3) {
        return
      }
      var message, actionCallback
      if (index == 0) {
        actionCallback = onUserBlockPress
        message = localized(
          "Are you sure you want to block this user? You won't see their messages again.",
        )
      } else if (index == 1) {
        actionCallback = onUserReportPress
        message = localized(
          "Are you sure you want to report this user? You won't see their messages again.",
        )
      } else if (index == 2) {
        actionCallback = onCancelMatchPress 
        message = localized(
          "Are you sure you want to cancel your match with this user? You won't see their messages again.",
        )
      }
      Alert.alert(localized('Are you sure?'), message, [
        {
          text: localized('Yes'),
          onPress: actionCallback,
        },
        {
          text: localized('Cancel'),
          style: 'cancel',
        },
      ])
    },
    [localized, onUserBlockPress, onUserReportPress],
  )

  const onMessageLongPress = useCallback(
    inReplyToItem => {
      setTemporaryInReplyToItem(inReplyToItem)

      if (user.id === inReplyToItem.senderID) {
        setThreadItemActionSheet({
          inBound: false,
          options: outBoundThreadItemSheetOptions,
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        })
      } else {
        setThreadItemActionSheet({
          inBound: true,
          options: inBoundThreadItemSheetOptions,
          cancelButtonIndex: 1,
        })
      }
    },
    [setThreadItemActionSheet, setTemporaryInReplyToItem, user.id],
  )

  const onReplyPress = useCallback(
    index => {
      if (index == 0) {
        onReplyActionPress && onReplyActionPress(temporaryInReplyToItem)
      }
    },
    [onReplyActionPress, temporaryInReplyToItem],
  )

  const handleInBoundThreadItemActionSheet = useCallback(
    index => {
      if (index == 0) {
        onReplyPress(index)
      }
    },
    [onReplyPress],
  )

  const handleOutBoundThreadItemActionSheet = useCallback(
    index => {
      if (index == 0) {
        onReplyPress(index)
      }

      if (index == 1) {
        onDeleteThreadItem && onDeleteThreadItem(temporaryInReplyToItem)
      }
    },
    [onDeleteThreadItem, onReplyPress],
  )

  const onThreadItemActionSheetDone = useCallback(
    index => {
      if (threadItemActionSheet.inBound) {
        handleInBoundThreadItemActionSheet(index)
      } else {
        handleOutBoundThreadItemActionSheet(index)
      }
    },
    [threadItemActionSheet.inBound, handleInBoundThreadItemActionSheet],
  )
  return (
    <SafeAreaView style={styles.personalChatContainer}>
      <ImageBackground 
        style={{ flex: 1 }} 
        source={theme.icons.Leaves_BG}
        imageStyle={{ opacity: 0.15}}
      >
      <KeyboardAwareView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.nonkeyboardContainer}>
        <MessageThread
          messages={messages}
          user={user}
          onChatMediaPress={onChatMediaPress}
          onSenderProfilePicturePress={onSenderProfilePicturePress}
          onMessageLongPress={onMessageLongPress}
          channelItem={channelItem}
          onListEndReached={onListEndReached}
        />
      </KeyboardAwareView>
      {!lockData.locked && (
        <BottomInput
          uploadProgress={uploadProgress}
          value={inputValue}
          onAudioRecordDone={onAudioRecordDone}
          onChangeText={onChangeText}
          onSend={onSend}
          trackInteractive={true}
          onAddMediaPress={() => onAddMediaPress(photoUploadDialogRef)}
          onAddDocPress={onAddDocPress}
          inReplyToItem={inReplyToItem}
          onReplyingToDismiss={onReplyingToDismiss}
          isPremium={isPremium}
        />
      )}
      <ActionSheet
        title={localized('Group Settings')}
        options={[
          localized('Rename Group'),
          localized('Leave Group'),
          localized('Cancel'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
      />
      <ActionSheet
        title={'Are you sure?'}
        options={['Confirm', 'Cancel']}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
      />
      <DialogInput
        isDialogVisible={isRenameDialogVisible}
        title={localized('Change Name')}
        hintInput={channel.name}
        textInputProps={{ selectTextOnFocus: true }}
        submitText={localized('OK')}
        submitInput={onChangeName}
        closeDialog={() => {
          showRenameDialog(false)
        }}
      />
      <ActionSheet
        ref={photoUploadDialogRef}
        title={localized('Photo Upload')}
        options={[
          localized('Launch Camera'),
          localized('Open Photo Gallery'),
          localized('Cancel'),
        ]}
        cancelButtonIndex={2}
        onPress={onPhotoUploadDialogDone}
      />
      <ActionSheet
        ref={groupSettingsActionSheetRef}
        title={localized('Group Settings')}
        options={[
          localized('Rename Group'),
          localized('Leave Group'),
          localized('Cancel'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={onGroupSettingsActionDone}
      />
      <ActionSheet
        ref={privateSettingsActionSheetRef}
        title={localized('Actions')}
        options={[
          localized('Block user'),
          localized('Report user'),
          localized('Cancel'),
        ]}
        cancelButtonIndex={2}
        onPress={onPrivateSettingsActionDone}
      />
      {threadItemActionSheet?.options && (
        <ActionSheet
          ref={threadItemActionSheetRef}
          title={localized('Actions')}
          options={threadItemActionSheet.options}
          cancelButtonIndex={threadItemActionSheet.cancelButtonIndex}
          destructiveButtonIndex={threadItemActionSheet.destructiveButtonIndex}
          onPress={onThreadItemActionSheetDone}
        />
      )}
      <TNMediaViewerModal
        mediaItems={mediaItemURLs}
        isModalOpen={isMediaViewerOpen}
        onClosed={onMediaClose}
        selectedMediaIndex={selectedMediaIndex}
      />
      {loading && <TNActivityIndicator />}
      </ImageBackground>
    </SafeAreaView>
  )
}

IMChat.propTypes = {
  onSendInput: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeTextInput: PropTypes.func,
  onLaunchCamera: PropTypes.func,
  onOpenPhotos: PropTypes.func,
  onAddMediaPress: PropTypes.func,
  user: PropTypes.object,
  uploadProgress: PropTypes.number,
  isMediaViewerOpen: PropTypes.bool,
  isRenameDialogVisible: PropTypes.bool,
  selectedMediaIndex: PropTypes.number,
  onChatMediaPress: PropTypes.func,
  onMediaClose: PropTypes.func,
  showRenameDialog: PropTypes.func,
  onLeave: PropTypes.func,
}

export default IMChat
