import React, { useState, memo } from 'react'
import { View } from 'react-native'
import { useTheme } from 'dopenative'
import FastImage from 'react-native-fast-image'
import dynamicStyles from './styles'

const defaultAvatar =
  'https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/cactus-undefined.png?alt=media&token=2745ab3f-c9ef-40de-8f7b-f59154a234b5'

const IMConversationIconView = props => {
  const { participants, imageStyle, style } = props

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [imgErr, setImgErr] = useState(false)
  const [secondImgErr, setSecondImgErr] = useState(false)

  let firstUri =
    participants.length > 0 &&
    participants[0].profilePictureURL &&
    participants[0].profilePictureURL.length > 0
      ? participants[0].profilePictureURL
      : defaultAvatar
  let secondUri =
    participants.length > 1 &&
    participants[1].profilePictureURL &&
    participants[1].profilePictureURL.length > 0
      ? participants[1].profilePictureURL
      : defaultAvatar

  const onImageError = () => {
    setImgErr(true)
  }

  const onSecondImageError = () => {
    setSecondImgErr(true)
  }

  return (
    <View style={styles.container}>
      {participants.length == 0 && (
        <View style={styles.singleParticipation}>
          <FastImage
            style={styles.singleChatItemIcon}
            source={{ uri: defaultAvatar }}
          />
        </View>
      )}
      {participants.length === 1 && (
        <View style={style ? style : styles.singleParticipation}>
          <FastImage
            style={[styles.singleChatItemIcon, imageStyle]}
            onError={onImageError}
            source={imgErr ? { uri: defaultAvatar } : { uri: firstUri }}
          />
          {participants[0].isOnline && <View style={styles.onlineMark} />}
        </View>
      )}
      {participants.length > 1 && (
        <View style={styles.multiParticipation}>
          <FastImage
            style={[styles.multiPaticipationIcon, styles.bottomIcon]}
            onError={onImageError}
            source={imgErr ? { uri: defaultAvatar } : { uri: firstUri }}
          />
          <View style={styles.middleIcon} />
          <FastImage
            style={[styles.multiPaticipationIcon, styles.topIcon]}
            onError={onSecondImageError}
            source={secondImgErr ? { uri: defaultAvatar } : { uri: secondUri }}
          />
        </View>
      )}
    </View>
  )
}

export default memo(IMConversationIconView)
