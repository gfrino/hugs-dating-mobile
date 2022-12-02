import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Easing,
  Pressable,
} from 'react-native'
import { useTheme } from 'dopenative'
import { size } from '../../helpers/devices'

const BottomTabBar = props => {
  const { theme } = useTheme()
  const scaleValue2 = useRef(new Animated.Value(0))
  const scaleValue3 = useRef(new Animated.Value(0))
  const scaleValue4 = useRef(new Animated.Value(0))

  const onDislikePress = () => {
    scaleValue2.current.setValue(0)
    Animated.timing(scaleValue2.current, {
      toValue: 1,
      duration: 300,
      easing: Easing.easeOutBack,
    }).start(() => {})
    props.onDislikePressed()
  }

  const onSuperLikePress = () => {
    scaleValue3.current.setValue(0)
    Animated.timing(scaleValue3.current, {
      toValue: 1,
      duration: 300,
      easing: Easing.easeOutBack,
    }).start(() => {})
    props.onSuperLikePressed()
  }

  const onLikePress = () => {
    scaleValue4.current.setValue(0)
    Animated.timing(scaleValue4.current, {
      toValue: 1,
      duration: 300,
      easing: Easing.easeOutBack,
    }).start(() => {})
    props.onLikePressed()
  }

  const getCardStyle2 = () => {
    const scale = scaleValue2.current.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.7, 1],
    })

    return {
      transform: [{ scale }],
    }
  }

  const getCardStyle3 = () => {
    const scale = scaleValue3.current.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.7, 1],
    })

    return {
      transform: [{ scale }],
    }
  }

  const getCardStyle4 = () => {
    const scale = scaleValue4.current.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.7, 1],
    })

    return {
      transform: [{ scale }],
    }
  }

  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={[styles.side]}>
        {props.undoSwipe ? (
          <Pressable
            onPress={props.undoSwipe}
            style={styles.roundUndoIconContainer}>
            <Image style={styles.icon} source={theme.icons.undo} />
          </Pressable>
        ) : null}
      </View>
      <TouchableWithoutFeedback onPress={onDislikePress}>
        <Animated.View
          style={[
            styles.button_container,
            getCardStyle2(),
            props.buttonContainerStyle,
          ]}>
          <Image
            source={theme.icons.crossFilled}
            style={[styles.large_icon, { tintColor: '#e8315b' }]}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onSuperLikePress}>
        <Animated.View style={[styles.button_container, getCardStyle3()]}>
          <Image source={theme.icons.starFilled} style={styles.small_icon} />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onLikePress}>
        <Animated.View style={[styles.button_container, getCardStyle4()]}>
          <Image
            source={theme.icons.Like}
            style={[styles.large_icon, { tintColor: '#44d48c' }]}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <View style={styles.side} />
    </View>
  )
}

const undoIconSize = size(20)
const undoIconContainerSize = undoIconSize + 8

BottomTabBar.propTypes = {
  containerStyle: PropTypes.any,
  onBoostPressed: PropTypes.func,
  onLikePressed: PropTypes.func,
  onSuperLikePressed: PropTypes.func,
  onDislikePressed: PropTypes.func,
  onRewindPressed: PropTypes.func,
  buttonContainerStyle: PropTypes.any,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: size(10),
    marginBottom: size(35),
  },
  side: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_container: {
    padding: size(15),
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  small_icon: {
    width: size(20),
    height: size(20),
    resizeMode: 'contain',
    tintColor: '#3c94dc',
  },
  large_icon: {
    width: size(30),
    height: size(30),
    resizeMode: 'contain',
  },
  roundUndoIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: undoIconContainerSize + 7,
    width: undoIconContainerSize + 7,
    borderRadius: Math.floor(undoIconContainerSize + 7 / 2),
    backgroundColor: '#e95c6f',
    zIndex: 2,
  },
  icon: {
    width: size(20),
    height: size(20),
    tintColor: 'white',
  },
})

export default BottomTabBar
