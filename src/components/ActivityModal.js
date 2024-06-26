import React from 'react'
import { StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'

const ActivityModal = ({
  loading = false,
  activityColor,
  activityWrapperStyle,
  size,
  opacity = 0.4,
  title = '',
  titleColor,
}) => {
  return (
    <Modal transparent={true} animationType={'none'} visible={loading}>
      <View
        style={[
          styles.modalBackground,
          { backgroundColor: `rgba(0,0,0,${opacity})` },
        ]}>
        <View style={[styles.activityIndicatorWrapper, activityWrapperStyle]}>
          <ActivityIndicator
            animating={loading}
            activityColor={activityColor}
            size={size}
            color={activityColor}
          />
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
    </Modal>
  )
}

ActivityModal.propTypes = {
  activityColor: PropTypes.string,
  size: PropTypes.string,
  opacity: (props, propName) => {
    if (props[propName] < 0 || props[propName] > 1) {
      return new Error('Opacity prop value out of range')
    }
  },
  title: PropTypes.string,
  titleColor: PropTypes.string,
  activityWrapperStyle: PropTypes.any,
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingTop: 8,
  },
})

export default ActivityModal
