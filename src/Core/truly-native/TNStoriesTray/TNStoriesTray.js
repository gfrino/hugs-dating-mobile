import React, { memo, useCallback } from 'react'
import { FlatList, I18nManager, Alert } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import TNStoryItem from './TNStoryItem/TNStoryItem'
import dynamicStyles from './styles'

const placeHolderStory = {
  id: 'locked',
  profilePictureURL:
    'https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/public_resources%2FFrame%204.png?alt=media&token=ed946716-ea72-4b99-bba0-23cc93484abe',
  firstName: 'Hidden',
}

function TNStoriesTray(props) {
  const {
    data,
    onListEndReached,
    onStoryItemPress,
    onUserItemPress,
    user,
    displayUserItem,
    userItemShouldOpenCamera,
    storyItemContainerStyle,
    userStoryTitle,
    displayLastName,
    showOnlineIndicator,
    displayVerifiedBadge,
    isPremium,
    maxChannels,
  } = props

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { localized } = useTranslations()

  const renderItem = ({ item, index }) => {
    const isSeen =
      item.items && item.idx + 1 === item.items.length && styles.seenStyle

    const isLocked = item.id === 'locked'

    const LockedPress = () => {
      Alert.alert(
        localized('Unlock more chats with premium'),
        localized(
          'You can unlock more chats with premium, upgrade now to be more connected with your matches!',
        ),
      )
    }

    return (
      <TNStoryItem
        onPress={isLocked ? LockedPress : onStoryItemPress}
        item={{ ...item, lastName: displayLastName ? item.lastName : ' ' }}
        index={index}
        title={true}
        showOnlineIndicator={showOnlineIndicator && item.isOnline}
        imageContainerStyle={
          storyItemContainerStyle ? storyItemContainerStyle : isSeen
        }
        displayVerifiedBadge={displayVerifiedBadge}
      />
    )
  }

  const onPress = useCallback(
    (item, index, refIndex) => {
      onUserItemPress(userItemShouldOpenCamera, refIndex, index)
    },
    [onUserItemPress, userItemShouldOpenCamera],
  )

  const lockedChats =
    data.length > maxChannels
      ? Array(data.length - maxChannels).fill(placeHolderStory)
      : []

  return (
    <FlatList
      ListHeaderComponent={
        displayUserItem ? (
          <TNStoryItem
            onPress={onPress}
            title={true}
            displayVerifiedBadge={displayVerifiedBadge}
            index={0}
            item={{ ...user, firstName: userStoryTitle, lastName: '' }}
          />
        ) : null
      }
      style={styles.storiesContainer}
      data={isPremium ? data : data.slice(0, maxChannels).concat(lockedChats)}
      inverted={I18nManager.isRTL}
      renderItem={renderItem}
      keyExtractor={(item, index) => index + 'item'}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      onEndReached={onListEndReached}
      onEndReachedThreshold={0.3}
    />
  )
}
export default memo(TNStoriesTray)
