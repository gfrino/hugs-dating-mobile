import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, BackHandler, View, Dimensions } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import ImagePicker from 'react-native-image-crop-picker'
import * as DocumentPicker from 'expo-document-picker'
import { useFocusEffect } from '@react-navigation/native'
import { IMIconButton } from '../../truly-native'
import { useCurrentUser } from '../../onboarding'
import IMChat from '../IMChat/IMChat'
import {
  useChatMessages,
  useChatChannels,
  useChatSingleChannel,
} from '../../chat'
import { storageAPI } from '../../media'
import { useUserReportingMutations } from '../../user-reporting'
import { notificationManager } from '../../notifications'
// VIDEO_CALL_FLAG_ENABLED_BEGIN
import { initiateAVCall } from '../../avchat'
// VIDEO_CALL_FLAG_ENABLED_END
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IS_ANDROID } from '../../helpers/statics'
import CardDetailsView from '../../../components/swipe/CardDetailsView/CardDetailsView'
import {
  Text,
  Pressable
} from 'react-native'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const IMChatScreen = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const currentUser = useCurrentUser()
  const dispatch = useDispatch()
  const { unblockUser } = useUserReportingMutations()

  const safeAreas = useSafeAreaInsets()

  const { navigation, route } = props
  const openedFromPushNotification = route.params.openedFromPushNotification

  const {
    messages,
    subscribeToMessages,
    loadMoreMessages,
    sendMessage: sendMessageAPI,
    deleteMessage,
  } = useChatMessages()

  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [downloadObject, setDownloadObject] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false)
  const [isRenameDialogVisible, setIsRenameDialogVisible] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(-1)
  const [inReplyToItem, setInReplyToItem] = useState(null)
  const [images, setImages] = useState([])
  const [lockData, setLockData] = useState({
    locked: false,
    message: "",
  });

  const [showModes, setShowModes] = useState(0)

  const { createChannel, markChannelMessageAsRead, updateGroup, leaveGroup } =
    useChatChannels()
  const { remoteChannel, subscribeToSingleChannel } = useChatSingleChannel(
    channel?.id,
  )

  const { markAbuse, cancelMatch } = useUserReportingMutations()
  const subscribeMessagesRef = useRef(null)

  const groupSettingsActionSheetRef = useRef(null)
  const privateSettingsActionSheetRef = useRef(null)

  useLayoutEffect(() => {
    if (!openedFromPushNotification) {
      configureNavigation(
        channelWithHydratedOtherParticipants(route.params.channel),
      )
    } else {
      navigation.setOptions({ headerTitle: '' })
    }
  }, [navigation])


  useEffect(() => {
    if (messages) {
      configureImages()
    }
  }, [messages])

  useEffect(() => {
    if (selectedMediaIndex !== -1) {
      setIsMediaViewerOpen(true)
    } else {
      setIsMediaViewerOpen(false)
    }
  }, [selectedMediaIndex])

  useEffect(() => {
    const hydratedChannel = channelWithHydratedOtherParticipants(
      route.params.channel,
    )
    if (!hydratedChannel) {
      return
    }

    setChannel(hydratedChannel)
    subscribeMessagesRef.current = subscribeToMessages(hydratedChannel?.id)
    const unsubscribe = subscribeToSingleChannel(hydratedChannel?.id)

    return () => {
      subscribeMessagesRef.current && subscribeMessagesRef.current()
      unsubscribe && unsubscribe()
    }
  }, [currentUser?.id])

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      )
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        )
      }
    }, [onBackButtonPressAndroid]),
  )

  useEffect(() => {
    if (downloadObject !== null) {
      // We've just finished the photo upload, so we send the message out
      setUploadProgress(0)
      onSendInput()
    }
  }, [downloadObject])

  const onListEndReached = useCallback(() => {
    loadMoreMessages(route?.params?.channel?.id)
  }, [loadMoreMessages, route?.params?.channel?.id])

  const configureNavigation = channel => {
    var title = channel?.name
    var isGroupChat = channel?.otherParticipants?.length > 1
    if (!title && channel?.otherParticipants?.length > 0) {
      // console.log("----->",JSON.stringify(channel.otherParticipants[0]));
      title =
        channel.otherParticipants[0]?.firstName +
        ' ' +
        channel.otherParticipants[0]?.lastName ||
        channel.otherParticipants[0]?.fullname
    }

    navigation.setOptions({
      headerTitle: (title || route.params.title || localized('Chat')) + (lockData.locked ? ` (${lockData.message})` : ""),
      headerStyle: {
        backgroundColor: theme.colors[appearance].primaryBackground,
      },
      headerBackTitleVisible: false,
      headerTitleStyle: isGroupChat
        ? {
          width: Dimensions.get('window').width - 110,
        }
        : null,
      headerTintColor: theme.colors[appearance].primaryText,
      headerRight: () => (
        <>
        <View style={{ flexDirection: 'row' }}>
          <IMIconButton
            source={require('../assets/user.png')}
            tintColor={theme.colors[appearance].primaryForeground}
            onPress={() => {setShowModes(1)}}
            marginRight={15}
            width={20}
            height={20}
          />
          <IMIconButton
            source={require('../assets/settings-icon.png')}
            tintColor={theme.colors[appearance].primaryForeground}
            onPress={onSettingsPress}
            marginRight={15}
            width={20}
            height={20}
          />          
          
          {/* VIDEO_CALL_FLAG_ENABLED_BEGIN */}
          <IMIconButton
            source={require('../assets/call.png')}
            tintColor={theme.colors[appearance].primaryForeground}
            onPress={onAudioChat}
            disabled={lockData.locked}
            marginRight={15}
            width={20}
            height={20}
          />
          {isPremium ? (
            <IMIconButton
              source={require('../assets/video-camera-filled.png')}
              tintColor={theme.colors[appearance].primaryForeground}
              onPress={onVideoChat}
              disabled={lockData.locked}
              marginRight={15}
              width={20}
              height={20}
            />
          ) : null}
          {/* VIDEO_CALL_FLAG_ENABLED_END */}
        </View>        
      </>
      ),
    })
  }

  const renderCardDetail = (item, isDone) => {
    {console.log("channel.otherParticipants",item)}
    if (item == null) {
      return false;
    }
    item = item.otherParticipants[0];
    const profilePic =
      item.profilePictureURL || getDefaultProfilePicture(item.userCategory)
    return (
      item && (
        <CardDetailsView
          key={'CardDetail' + item.id}
          profilePictureURL={profilePic}
          firstName={item.firstName}
          lastName={item.lastName}
          age={item.age}
          school={item.school}
          distance={item.distance}
          bio={item.bio}
          instagramPhotos={
            item?.photos?.length > 0 ? item.photos : [profilePic]
          }
          uid={item.id}
          setShowMode={(mode) => {console.log("///////",mode),setShowModes(mode)}}
          onSwipeTop={onSuperLikePressed}
          onSwipeRight={onLikePressed}
          onSwipeLeft={onDislikePressed}
          bottomTabBar={false}
        />
      )
    )
  }
  const onDislikePressed = () => {
    // useSwiper.current.swipeLeft()
    console.log("asasas");
  }

  const onSuperLikePressed = () => {
    // useSwiper.current.swipeTop()
    console.log("asasas");
  }

  const onLikePressed = () => {
    // useSwiper.current.swipeRight()
    console.log("asasas");
  }
  useEffect(() => {
    if (!remoteChannel) {
      return
    }
    // We have a hydrated channel, so we replace the partial channel we have on the state
    const hydratedChannel = channelWithHydratedOtherParticipants(remoteChannel)
    setChannel(hydratedChannel)
    markThreadItemAsReadIfNeeded(hydratedChannel)

    // We have a hydrated channel, so we update the title of the screen
    if (openedFromPushNotification) {
      configureNavigation(hydratedChannel)
    }
  }, [remoteChannel])

  useEffect(() => {
    if (!channel) return;
    configureNavigation(channel);
  }, [channel, channel?.otherParticipants?.length, lockData]);

  useEffect(() => {
    if (!channel) return;
    if (channel.lockedBy === undefined) return;

    const chatIsLocked = channel.lockedBy.length > 0;
    const isLockedByTheUser = channel.lockedBy
      .find(blockerUID => blockerUID === currentUser.id) !== -1;

    setLockData({
      locked: chatIsLocked,
      message: isLockedByTheUser
        ? localized("blocked")
        : localized("unavailable"),
    });
  }, [channel]);

  const channelWithHydratedOtherParticipants = channel => {
    const allParticipants = channel?.participants
    if (!allParticipants) {
      return channel
    }
    // otherParticipants are all the participants in the chat, except for the currently logged in user
    const otherParticipants =
      allParticipants &&
      allParticipants.filter(
        participant => participant && participant.id != currentUser.id,
      )
    return { ...channel, otherParticipants }
  }

  const onBackButtonPressAndroid = useCallback(() => {
    navigation.goBack()
    return true
  }, [navigation])

  // VIDEO_CALL_FLAG_ENABLED_BEGIN
  const onVideoChat = useCallback(() => {
    if (channel?.otherParticipants) {
      initiateAVCall(channel, 'video', currentUser, dispatch, localized)
    }
  }, [channel, currentUser, dispatch, localized])

  const onAudioChat = useCallback(() => {
    if (channel?.otherParticipants) {
      initiateAVCall(channel, 'audio', currentUser, dispatch, localized)
    }
  }, [channel, currentUser, dispatch, localized])
  // VIDEO_CALL_FLAG_ENABLED_END

  const onSettingsPress = useCallback(() => {
    if (channel?.otherParticipants?.length > 1) {
      groupSettingsActionSheetRef.current.show()
    } else {
      privateSettingsActionSheetRef.current.show()
    }
  }, [
    channel,
    groupSettingsActionSheetRef.current,
    privateSettingsActionSheetRef.current,
  ])

  const onChangeName = useCallback(
    async text => {
      setIsRenameDialogVisible(false)
      const data = { ...channel, name: text }
      await updateGroup(channel?.id, currentUser?.id, data)
      setChannel(data)
      configureNavigation(data)
    },
    [
      channel,
      currentUser?.id,
      setChannel,
      configureNavigation,
      updateGroup,
      setIsRenameDialogVisible,
    ],
  )
  const onLeave = useCallback(() => {
    Alert.alert(
      localized(`Leave ${channel?.name ?? 'group'}`),
      localized('Are you sure you want to leave this group?'),
      [
        {
          text: 'Yes',
          onPress: onLeaveGroupConfirmed,
          style: 'destructive',
        },
        { text: 'No' },
      ],
      { cancelable: false },
    )
  }, [onLeaveGroupConfirmed, channel])

  const onLeaveGroupConfirmed = useCallback(async () => {
    await leaveGroup(channel?.id, currentUser?.id)
    navigation.goBack(null)
  }, [leaveGroup, navigation, channel, currentUser?.id])

  const showRenameDialog = useCallback(
    show => {
      setIsRenameDialogVisible(show)
    },
    [setIsRenameDialogVisible],
  )

  const markThreadItemAsReadIfNeeded = channel => {
    const {
      id: channelID,
      lastThreadMessageId,
      readUserIDs,
      participants,
      lastMessage,
    } = channel
    const userID = currentUser?.id
    const isRead = readUserIDs?.includes(userID)

    if (!isRead && channelID && lastMessage && userID) {
      const newReadUserIDs = readUserIDs ? [...readUserIDs, userID] : [userID]
      markChannelMessageAsRead(
        channelID,
        userID,
        lastThreadMessageId,
        newReadUserIDs,
        participants,
      )
    }
  }

  const onChangeTextInput = useCallback(
    text => {
      setInputValue(text)
    },
    [setInputValue],
  )

  const createOne2OneChannel = async () => {
    const response = await createChannel(
      currentUser,
      channelWithHydratedOtherParticipants(channel)?.otherParticipants,
    )
    if (response) {
      setChannel(channelWithHydratedOtherParticipants(response))
      subscribeMessagesRef.current && subscribeMessagesRef.current()
      subscribeMessagesRef.current = subscribeToMessages(channel?.id)
    }
    return response
  }

  const onSendInput = async () => {
    if (messages?.length > 0 || channel?.otherParticipants?.length > 1) {
      await sendMessage()
      return
    }

    // If we don't have a chat message, we need to create a 1-1 channel first
    setLoading(true)
    const newChannel = await createOne2OneChannel()
    if (newChannel) {
      await sendMessage(newChannel)
    }
    setLoading(false)
  }

  const getParticipantPictures = () => {
    if (channel?.otherParticipants) {
      return channel.otherParticipants.map(participant => {
        return {
          participantId: participant.id || participant.userID,
          profilePictureURL: participant.profilePictureURL,
        }
      })
    } else {
      return []
    }
  }

  const sendMessage = async (newChannel = channel) => {
    const tempInputValue = inputValue
    const tempInReplyToItem = inReplyToItem
    const participantProfilePictureURLs = getParticipantPictures()
    setInputValue('')
    setInReplyToItem(null)

    const response = await sendMessageAPI(
      currentUser,
      newChannel,
      tempInputValue,
      downloadObject,
      tempInReplyToItem,
      participantProfilePictureURLs,
    )
    if (response?.error) {
      alert(error)
      setInputValue(tempInputValue)
      setInReplyToItem(tempInReplyToItem)
    } else {
      setDownloadObject(null)
      broadcastPushNotifications(tempInputValue, downloadObject)
    }
  }

  const broadcastPushNotifications = (inputValue, downloadObject) => {
    const participants = channel.otherParticipants
    if (!participants || participants.length == 0) {
      return
    }
    const sender = currentUser
    const isGroupChat = channel.name && channel.name.length > 0
    const fromTitle = isGroupChat
      ? channel.name
      : sender.firstName + ' ' + sender.lastName
    var message = sender.firstName
    if (isGroupChat) {
      message = +' ' + sender.lastName
      if (downloadObject?.mime?.includes('video')) {
        message = message + ' ' + localized('sent a video.')
      }
      if (downloadObject?.mime?.includes('photo')) {
        message = message + ' ' + localized('sent a photo.')
      }
      if (downloadObject?.mime?.includes('audio')) {
        message = message + ' ' + localized('sent an audio.')
      }
      if (downloadObject?.mime?.includes('file')) {
        message = message + ' ' + localized('sent a file.')
      }

      message = message + ': ' + inputValue
    } else {
      if (downloadObject?.mime?.includes('video')) {
        message = message + ' ' + localized('sent you a video.')
      }
      if (downloadObject?.mime?.includes('audio')) {
        message = message + ' ' + localized('sent you an audio message.')
      }
      if (downloadObject?.mime?.includes('photo')) {
        message = message + ' ' + localized('sent you a photo.')
      }
      if (downloadObject?.mime?.includes('file')) {
        message = message + ' ' + localized('sent you a file.')
      }

      message = inputValue
    }

    participants.forEach(participant => {
      if (participant.id !== currentUser.id) {
        notificationManager.sendPushNotification(
          participant,
          fromTitle,
          message,
          'chat_message',
          { channelID: channel.id },
        )
      }
    })
  }

  const onAddMediaPress = useCallback(photoUploadDialogRef => {
    photoUploadDialogRef.current.show()
  })

  const onAudioRecordSend = useCallback(
    audioRecord => {
      startUpload(audioRecord)
    },
    [startUpload],
  )

  const onLaunchCamera = useCallback(() => {
    ImagePicker.openCamera({
      cropping: false,
    })
      .then(image => {
        startUpload(image)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [startUpload])

  const onOpenPhotos = useCallback(() => {
    ImagePicker.openPicker({
      cropping: false,
      multiple: false,
    })
      .then(image => {
        startUpload(image)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [startUpload])

  const onAddDocPress = useCallback(async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync()
      if (res) {
        startUpload({
          ...res,
          mime: 'file',
          fileID: +new Date() + res.name,
        })
      }
    } catch (e) {
      console.warn(e)
    }
  }, [startUpload])

  const startUpload = uploadData => {
    const { mime } = uploadData

    storageAPI.processAndUploadMediaFileWithProgressTracking(
      uploadData,
      async snapshot => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress(uploadProgress)
      },
      async url => {
        if (url) {
          setDownloadObject({
            ...uploadData,
            source: url,
            uri: url,
            url,
            mime,
          })
        }
      },
      error => {
        setUploadProgress(0)
        alert(localized('Oops! An error has occurred. Please try again.'))
        console.log(error)
      },
    )
  }

  const configureImages = () => {
    var images = []

    messages?.forEach(item => {
      if (item && item.url && item.url !== '') {
        if (item.url.mime && item.url.mime.startsWith('image')) {
          images.push({
            id: item.id,
            url: item.url,
          })
        } else if (!item.url.mime && item.url.startsWith('https://')) {
          // To handle old format before video feature
          images.push({
            id: item.id,
            url: item.url,
          })
        }
      }
    })
    setImages(images)
  }

  const onChatMediaPress = useCallback(
    item => {
      const index = images?.findIndex(image => {
        return image.id === item.id
      })
      setSelectedMediaIndex(index)
    },
    [images, setSelectedMediaIndex],
  )

  const onMediaClose = useCallback(() => {
    setSelectedMediaIndex(-1)
  }, [setSelectedMediaIndex])

  const onUserBlockPress = useCallback(() => {
    reportAbuse("block");
  }, [reportAbuse])

  const onUserUnblockPress = useCallback(
    async () => {
      if (!lockData) {
        return false;
      }
      setLoading(true)
      const participants = route.params.channel?.participants;
      console.log("participants", participants);

      for (item in participants) {
        console.log(" ========= item", participants[item]);
        console.log(" ========= >>>>>>> currentUser.id", currentUser.id);
        console.log(" ========= >>>>>>> item", participants[item].id);
        await unblockUser(currentUser.id, participants[item].id)
      }
      setLockData(false);
      setLoading(false)
      // navigation.goBack(null)
    },
    [onUserUnblockPress, currentUser.id],
  )


  const onUserReportPress = useCallback(() => {
    reportAbuse("report");
  }, [reportAbuse])

  const onCancelMatchPress = useCallback(
    (mode) => {
      const channelParam = route.params.channel
      const participants = channelParam?.participants || []
      const destUserID = participants[0]?.id

      if (!channelParam?.id || !currentUser?.id || !destUserID) {
        Alert.alert(localized('Oops! An error has occured. Please try again'))
        return
      }
      cancelMatch(currentUser.id, destUserID, channelParam.id)
        .then((response) => {
          if (response.success) {
            if (mode) {
              return markAbuse(currentUser.id, destUserID, mode)
                .finally(() => {
                  navigation.goBack(null);
                });
            } else {
              navigation.goBack(null);
            }
          } else {
            Alert.alert(localized('Oops! An error has occured. Please try again'))
          }
        })
    },
    [route.params.channel, currentUser],
  )

  const reportAbuse = useCallback(
    type => {
      const participants = route.params.channel?.participants
      if (!participants || participants.length != 1) {
        return
      }
      const myID = currentUser.id
      const otherUserID = participants[0].id
      markAbuse(myID, otherUserID, type).then(response => {
        if (!response.error) {
          navigation.goBack(null)
        }
      })
    },
    [route.params.channel, currentUser, navigation],
  )


  const onReplyActionPress = useCallback(
    inReplyToItem => {
      setInReplyToItem(inReplyToItem)
    },
    [setInReplyToItem, inReplyToItem],
  )

  const onReplyingToDismiss = useCallback(() => {
    setInReplyToItem(null)
  }, [setInReplyToItem])

  const onDeleteThreadItem = useCallback(
    message => {
      deleteMessage(channel, message?.id)
    },
    [channel, deleteMessage],
  )

  const isPremium = useSelector(state => state.inAppPurchase.isPlanActive)

  return (
    <>
    <IMChat
      user={currentUser}
      messages={messages}
      inputValue={inputValue}
      inReplyToItem={inReplyToItem}
      loading={loading}
      onAddMediaPress={onAddMediaPress}
      onAddDocPress={onAddDocPress}
      onSendInput={onSendInput}
      onAudioRecordSend={onAudioRecordSend}
      onChangeTextInput={onChangeTextInput}
      onLaunchCamera={onLaunchCamera}
      onOpenPhotos={onOpenPhotos}
      uploadProgress={uploadProgress}
      mediaItemURLs={images.flatMap(i => i.url?.url)}
      isMediaViewerOpen={isMediaViewerOpen}
      selectedMediaIndex={selectedMediaIndex}
      onChatMediaPress={onChatMediaPress}
      onMediaClose={onMediaClose}
      isRenameDialogVisible={isRenameDialogVisible}
      groupSettingsActionSheetRef={groupSettingsActionSheetRef}
      privateSettingsActionSheetRef={privateSettingsActionSheetRef}
      showRenameDialog={showRenameDialog}
      onChangeName={onChangeName}
      onLeave={onLeave}
      onUserBlockPress={onUserBlockPress}
      onUserUnblockPress={onUserUnblockPress}
      onUserReportPress={onUserReportPress}
      onCancelMatchPress={onCancelMatchPress}
      onReplyActionPress={onReplyActionPress}
      onReplyingToDismiss={onReplyingToDismiss}
      onDeleteThreadItem={onDeleteThreadItem}
      channelItem={channel}
      onListEndReached={onListEndReached}
      isPremiumUser={isPremium}
      lockData={lockData}
      />
              
      <Modal        
        style={{
          flex: 1,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          margin: 0,
          alignItems: 'center',
        }}
        onBackdropPress={() => setShowModes(0)}
        onBackButtonPress={() => setShowModes(0)}
        isVisible={showModes}
        >
        <View style={{
          alignItems: 'center',
          width: SCREEN_WIDTH,
          marginTop: safeAreas.top,
          height: SCREEN_HEIGHT - safeAreas.top * (IS_ANDROID ? -1 : 1),
        }}>          
          {renderCardDetail(channel)}
        </View>
      </Modal>
      </>
    
  )
}

export default IMChatScreen
