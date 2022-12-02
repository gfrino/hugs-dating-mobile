import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import PropTypes from 'prop-types'
import IMConversationIconView from './IMConversationIconView/IMConversationIconView'
import { timeFormat } from '../../helpers/timeFormat'
import dynamicStyles from './styles'
import { formatMessage } from '../helpers/utils'

function IMConversationView(props) {
  const { onChatItemPress, item, user } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const userID = user.userID || user.id

  let title = item.title

  const getIsRead = () => {
    return item.markedAsRead
  }

  return (
    <TouchableOpacity
      onPress={() => onChatItemPress(item)}
      style={styles.chatItemContainer}>
      <IMConversationIconView participants={item.participants} />
      <View style={styles.chatItemContent}>
        <Text
          style={[styles.chatFriendName, !getIsRead() && styles.unReadmessage]}>
          {title}
        </Text>
        <View style={styles.content}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'middle'}
            style={[styles.message, !getIsRead() && styles.unReadmessage]}>
            {formatMessage(item.content, localized)} {' · '}
            <Text
              numberOfLines={1}
              ellipsizeMode={'middle'}
              style={[styles.message, !getIsRead() && styles.unReadmessage]}>
              {timeFormat(item.createdAt)}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

IMConversationView.propTypes = {
  item: PropTypes.object,
  onChatItemPress: PropTypes.func,
}

export default IMConversationView
