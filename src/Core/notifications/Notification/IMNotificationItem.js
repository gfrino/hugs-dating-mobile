import React, { memo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from 'dopenative'
import { TNStoryItem } from '../../truly-native'
import PropTypes from 'prop-types'
import { timeFormat } from '../../helpers/timeFormat'
import dynamicStyles from './styles'

const IMNotificationItem = memo(props => {
  const { item, onNotificationPress } = props
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onNotificationPress(item)}
      style={[
        styles.notificationItemBackground,
        item.seen
          ? styles.seenNotificationBackground
          : styles.unseenNotificationBackground,
      ]}>
      <View style={styles.notificationItemContainer}>
        {item.metadata && item.metadata.outBound && (
          <TNStoryItem
            containerStyle={styles.userImageMainContainer}
            imageContainerStyle={styles.userImageContainer}
            imageStyle={styles.userImage}
            item={item.metadata.outBound}
            activeOpacity={1}
          />
        )}
        <View style={styles.notificationLabelContainer}>
          <Text style={styles.description}>
            {/* <Text style={[styles.description, styles.name]}>
              {`${item.metadata.outBound.firstName} `}
            </Text> */}
            {item.body}
          </Text>
          <Text style={[styles.description, styles.moment]}>
            {timeFormat(item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
})

IMNotificationItem.propTypes = {
  item: PropTypes.object,
}

export default IMNotificationItem
