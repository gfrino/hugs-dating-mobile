import React, { useRef, memo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'dopenative'
import FastImage from 'react-native-fast-image'
import dynamicStyles from './styles'

const defaultAvatar =
  'https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/cactus-undefined.png?alt=media&token=2745ab3f-c9ef-40de-8f7b-f59154a234b5'

function StoryItem(props) {
  const {
    item,
    index,
    onPress,
    containerStyle,
    imageStyle,
    imageContainerStyle,
    textStyle,
    activeOpacity,
    title,
    showOnlineIndicator,
    displayVerifiedBadge,
  } = props

  const refs = useRef()

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const lastName = item.lastName || ''
  return (

    <TouchableOpacity
      key={index}
      ref={refs}
      activeOpacity={activeOpacity}
      onPress={() => onPress(item, index, refs)}
      style={[styles.container, containerStyle]}>
      <View style={[styles.imageContainer, imageContainerStyle]}>
        <FastImage
          style={[styles.image, imageStyle]}
          source={{ uri: item.profilePictureURL || defaultAvatar }}
        />
        {showOnlineIndicator && <View style={styles.isOnlineIndicator} />}
      </View>
      {title && (
        <View style={styles.verifiedContainer}>
          <Text
            style={[
              styles.text,
              textStyle,
            ]}>{`${item.firstName} ${lastName}`}</Text>
          {console.log(item)}
          {displayVerifiedBadge &&
            item.isVerified &&
            (item.username !== 'My Story' || item.username !== 'Add Story') && (
              <FastImage
                style={styles.verifiedIcon}
                source={require('../../../../assets/icons/verified.png')}
              />
            )}
        </View>
      )}
    </TouchableOpacity>
  )
}

export default memo(StoryItem)
