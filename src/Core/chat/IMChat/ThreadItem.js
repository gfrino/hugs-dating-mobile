import React, { useState, useRef, useEffect } from 'react'
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  Platform,
  NativeModules,
  TouchableWithoutFeedback,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme, useTranslations } from 'dopenative'
import ThreadMediaItem from './ThreadMediaItem'
import { IMRichTextView } from '../../mentions'
import FacePile from './FacePile'
import dynamicStyles from './styles'

const { VideoPlayerManager } = NativeModules

const assets = {
  boederImgSend: require('../assets/borderImg1.png'),
  boederImgReceive: require('../assets/borderImg2.png'),
  textBoederImgSend: require('../assets/textBorderImg1.png'),
  textBoederImgReceive: require('../assets/textBorderImg2.png'),
  reply: require('../assets/reply-icon.png'),
}

function ThreadItem(props) {
  const {
    item,
    user,
    onChatMediaPress,
    onSenderProfilePicturePress,
    onMessageLongPress,
    isRecentItem,
    isLongPress,
    onisLongPress
  } = props
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const senderProfilePictureURL = item.senderProfilePictureURL
  const [readFacePile, setReadFacePile] = useState([])
  const [hasisLongPress,setHasisLongPress] = useState(false);
  const videoRef = useRef(null)
  const imagePath = useRef()

  const updateItemImagePath = path => {
    imagePath.current = path
  }

  const isAudio = item.url && item.url.mime && item.url.mime.startsWith('audio')
  const isFile = item.url && item.url.mime && item.url.mime.startsWith('file')
  const isVideo = item.url && item.url.mime && item.url.mime.startsWith('video')
  const outBound = item.senderID === user.userID
  const inBound = item.senderID !== user.userID

  useEffect(() => {
    getReadFacePile()
  }, [item?.readUserIDs])

  useEffect(() => {
    if(isLongPress == false){
      setHasisLongPress(isLongPress)
    }
    
  }, [isLongPress])

  const getReadFacePile = () => {
    const facePile = []
    if (
      outBound &&
      isRecentItem &&
      item?.participantProfilePictureURLs &&
      item?.readUserIDs
    ) {
      item?.readUserIDs.forEach(readUserID => {
        const userFace = item?.participantProfilePictureURLs.find(
          participant => participant.participantId === readUserID,
        )

        userFace && facePile.push(userFace)
      })
    }
    setReadFacePile(facePile)
  }

  const didPressMediaChat = () => {
    if (isAudio) {
      return
    }

    const newLegacyItemURl = imagePath.current
    const newItemURl = { ...item.url, url: imagePath.current }
    let ItemUrlToUse

    if (!item.url.url) {
      ItemUrlToUse = newLegacyItemURl
    } else {
      ItemUrlToUse = newItemURl
    }

    if (isVideo) {
      if (Platform.OS === 'android') {
        VideoPlayerManager.showVideoPlayer(item.url.url)
      } else {
        if (videoRef.current) {
          videoRef.current.presentFullscreenPlayer()
        }
      }
    } else {
      onChatMediaPress({ ...item, senderProfilePictureURL, url: ItemUrlToUse })
    }
  }

  const renderTextBoederImg = () => {
    if (item.senderID === user.userID) {
      return (
        <Image
          source={assets.textBoederImgSend}
          style={styles.textBoederImgSend}
        />
      )
    }

    if (item.senderID !== user.userID) {
      return (
        <Image
          source={assets.textBoederImgReceive}
          style={styles.textBoederImgReceive}
        />
      )
    }
  }

  const renderBoederImg = () => {
    if (isAudio || isFile) {
      return renderTextBoederImg()
    }
    if (item.senderID === user.userID) {
      return (
        <Image source={assets.boederImgSend} style={styles.boederImgSend} />
      )
    }

    if (item.senderID !== user.userID) {
      return (
        <Image
          source={assets.boederImgReceive}
          style={styles.boederImgReceive}
        />
      )
    }
  }

  const renderInReplyToIfNeeded = (item, isMine) => {
    const inReplyToItem = item.inReplyToItem
    if (
      inReplyToItem &&
      inReplyToItem.content &&
      inReplyToItem.content.length > 0
    ) {
      return (
        <View
          style={
            isMine
              ? styles.inReplyToItemContainerView
              : styles.inReplyToTheirItemContainerView
          }>
          <View style={styles.inReplyToItemHeaderView}>
            <Image style={styles.inReplyToIcon} source={assets.reply} />
            <Text style={styles.inReplyToHeaderText}>
              {isMine
                ? localized('You replied to ') +
                  (inReplyToItem.senderFirstName ||
                    inReplyToItem.senderLastName)
                : (item.senderFirstName || item.senderLastName) +
                  localized(' replied to ') +
                  (inReplyToItem.senderFirstName ||
                    inReplyToItem.senderLastName)}
            </Text>
          </View>
          <View style={styles.inReplyToItemBubbleView}>
            <Text style={styles.inReplyToItemBubbleText}>
              {item.inReplyToItem.content.slice(0, 50)}
            </Text>
          </View>
        </View>
      )
    }
    return null
  }

  const handleOnPress = () => {}

  const handleOnLongPress = () => {
    
    if (!isAudio && !isVideo && !item.url) {      
      onisLongPress(1)
      setHasisLongPress(1)
      onMessageLongPress && onMessageLongPress(item)
    }
  }

  const handleOnPressOut = () => {
    // setIsLongPress(false);
  }

  return (
    <TouchableWithoutFeedback
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
      onPressOut={handleOnPressOut}
      
      >
      <View
      style={hasisLongPress ? {
        backgroundColor:"#00800059",
        borderRadius:10,
        overflow:'hidden'
      }:{}}>
        {/* user thread item */}
        {outBound && (
          <>
            <View style={styles.sendItemContainer}>
              {item.url != null && item.url != '' && (
                <TouchableOpacity
                  onPress={didPressMediaChat}
                  activeOpacity={0.9}
                  style={[
                    styles.itemContent,
                    styles.sendItemContent,
                    { padding: 0, marginRight: isAudio || isFile ? 8 : -1 },
                  ]}>
                  <ThreadMediaItem
                    outBound={outBound}
                    updateItemImagePath={updateItemImagePath}
                    videoRef={videoRef}
                    dynamicStyles={styles}
                    item={item}
                  />
                  {renderBoederImg()}
                </TouchableOpacity>
              )}
              {!item.url && (
                <View style={[styles.myMessageBubbleContainerView]}>
                  {renderInReplyToIfNeeded(item, true)}
                  <View style={[styles.itemContent, styles.sendItemContent]}>
                    <IMRichTextView defaultTextStyle={styles.sendTextMessage}>
                      {item.content}
                    </IMRichTextView>
                    {renderTextBoederImg()}
                  </View>
                </View>
              )}
              <TouchableOpacity
                onPress={() =>
                  onSenderProfilePicturePress &&
                  onSenderProfilePicturePress(item)
                }>
                <FastImage
                  style={styles.userIcon}
                  source={{ uri: senderProfilePictureURL }}
                />
              </TouchableOpacity>
            </View>
            {isRecentItem && (
              <View style={styles.sendItemContainer}>
                <FacePile numFaces={4} faces={readFacePile} />
              </View>
            )}
          </>
        )}
        {/* receiver thread item */}
        {inBound && (
          <View style={styles.receiveItemContainer}>
            <TouchableOpacity
              onPress={() =>
                onSenderProfilePicturePress && onSenderProfilePicturePress(item)
              }>
              <FastImage
                style={styles.userIcon}
                source={{ uri: senderProfilePictureURL }}
              />
            </TouchableOpacity>
            {item.url != null && item.url != '' && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.itemContent,
                  styles.receiveItemContent,
                  { padding: 0, marginLeft: isAudio || isFile ? 8 : -1 },
                ]}
                onPress={didPressMediaChat}>
                <ThreadMediaItem
                  updateItemImagePath={updateItemImagePath}
                  videoRef={videoRef}
                  dynamicStyles={styles}
                  item={item}
                />
                {renderBoederImg()}
              </TouchableOpacity>
            )}
            {!item.url && (
              <View style={styles.theirMessageBubbleContainerView}>
                {renderInReplyToIfNeeded(item, false)}
                <View style={[styles.itemContent, styles.receiveItemContent]}>
                  <IMRichTextView defaultTextStyle={styles.receiveTextMessage}>
                    {item.content}
                  </IMRichTextView>
                  {renderTextBoederImg()}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

ThreadItem.propTypes = {}

export default ThreadItem
