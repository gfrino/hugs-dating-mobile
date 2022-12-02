import React, { memo } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import IMConversationIconView from '../../../../chat/IMConversationView/IMConversationIconView/IMConversationIconView'
import dynamicStyles from './styles'
import { FriendshipConstants } from '../../constants'

const IMFriendItem = memo(props => {
  const {
    item,
    index,
    onFriendAction,
    onFriendItemPress,
    displayActions,
    followEnabled,
  } = props
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const user = item.user
  let actionTitle = followEnabled
    ? localized(FriendshipConstants.localizedFollowActionTitle(item.type))
    : localized(FriendshipConstants.localizedActionTitle(item.type))

  var name = 'No name'
  if (user.firstName && user.lastName) {
    name = user.firstName + ' ' + user.lastName
  } else if (user.fullname) {
    name = user.fullname
  } else if (user.firstName) {
    name = user.firstName
  }

  const renderActions = (displayActions, actionTitle) => {
    if (displayActions) {
      return (
        <View
          style={
            followEnabled
              ? styles.addFlexContainerFollow
              : styles.addFlexContainer
          }>
          <TouchableOpacity
            onPress={() => onFriendAction(item, index)}
            style={followEnabled ? [styles.followButton] : [styles.addButton]}>
            <Text
              style={
                followEnabled
                  ? [styles.followActionTitle]
                  : [styles.name, { padding: 0 }]
              }>
              {actionTitle}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onFriendItemPress && onFriendItemPress(item)}
      style={styles.friendItemContainer}>
      <View style={styles.chatIconContainer}>
        <IMConversationIconView
          style={styles.photo}
          imageStyle={styles.photo}
          participants={[user]}
        />
        {name && <Text style={styles.name}>{name}</Text>}
      </View>
      {renderActions(displayActions, actionTitle)}
      <View style={styles.divider} />
    </TouchableOpacity>
  )
})

export default IMFriendItem
