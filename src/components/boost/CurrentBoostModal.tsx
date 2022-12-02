import React from 'react'
import Modal from 'react-native-modal'
import Gradient from 'react-native-linear-gradient'
import CountdownTimeString from './CountdownTimeString'
import { useTheme, useTranslations } from 'dopenative'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { BoostIconFilled } from '../SVG/Boost'
import { Shadow } from 'react-native-shadow-2'
import Animated, {
  useAnimatedProps,
  SharedValue,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

const CIRCLE_LENGTH = 256 + 84
const R = CIRCLE_LENGTH / (2 * Math.PI)

const STROKE_COLOR = '#9665d3'

interface Props {
  isVisible: boolean
  onClose: () => void
  lastBoostExpirationUnixTime: number

  progress: SharedValue<number>
}

const SVG_SIZE = 96
const SVG_SIZE_OUTER_OFFSET = 32
const width = SVG_SIZE + SVG_SIZE_OUTER_OFFSET
const height = SVG_SIZE + SVG_SIZE_OUTER_OFFSET
const SVG_SHADOW_RADIUS = SVG_SIZE / 2
const SVG_SHADOW_DISTANCE = SVG_SIZE / 2

const CurrentBoostModal: React.FC<Props> = ({
  isVisible,
  onClose,
  lastBoostExpirationUnixTime,
  progress,
}) => {
  const { theme, appearance } = useTheme()

  const isDarkMode = appearance === 'dark'

  const { localized } = useTranslations()

  const colorSet = theme.colors[appearance]

  const styles = dynamicStyles(colorSet)

  const AnimatedCircle = Animated.createAnimatedComponent(Circle)

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }))

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      swipeDirection={['down']}
      onSwipeComplete={onClose}>
      <View style={styles.container}>
        <Gradient
          style={styles.topContainer}
          colors={[
            colorSet.primaryBackground,
            colorSet.primaryBackgroundHighlight,
          ]}>
          <Shadow
            radius={SVG_SHADOW_RADIUS}
            distance={SVG_SHADOW_DISTANCE}
            startColor={
              isDarkMode
                ? 'rgba(101, 35, 181, 0.175)'
                : 'rgba(101, 35, 181, 0.1)'
            }
            offset={[0, 4]}>
            <Svg
              style={{
                position: 'absolute',
                left: -(SVG_SIZE_OUTER_OFFSET / 2),
                zIndex: 1,
                top: -(SVG_SIZE_OUTER_OFFSET / 2),
                width: width + SVG_SIZE_OUTER_OFFSET / 2,
                height: width + SVG_SIZE_OUTER_OFFSET / 2,
              }}>
              <Circle
                cx={width / 2}
                cy={height / 2}
                r={R}
                stroke={
                  isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'
                }
                strokeWidth={8}
              />
              <AnimatedCircle
                cx={width / 2}
                cy={height / 2}
                r={R}
                stroke={STROKE_COLOR}
                strokeWidth={6}
                strokeDasharray={CIRCLE_LENGTH}
                animatedProps={animatedProps}
                strokeLinecap={'round'}
                transform="rotate(-90, 100, 100)"
                translate={[
                  -width / 2 + SVG_SIZE_OUTER_OFFSET * 2,
                  -height / 2 - SVG_SIZE_OUTER_OFFSET / 4,
                ]}
              />
            </Svg>
            <BoostIconFilled
              size={SVG_SIZE}
              bgColor={isDarkMode ? '#1d1d1d' : '#fff'}
            />
          </Shadow>
          <CountdownTimeString
            lastBoostExpirationUnixTime={lastBoostExpirationUnixTime}
            progress={progress}
          />
          <Text style={styles.descTop}>
            {localized(
              'You are being seen by a lot of people! Keep swiping for the best results',
            )}
          </Text>
        </Gradient>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.buttonText}>{localized('EXIT')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default React.memo(CurrentBoostModal)

const dynamicStyles = (colorSet: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colorSet.primaryBackground,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    descTop: {
      fontSize: 16,
      color: colorSet.grey9,
      marginBottom: 24,
      textAlign: 'center',
    },
    topContainer: {
      padding: 16,
      paddingTop: 16 + 12,
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      width: '100%',
      padding: 16,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      alignItems: 'center',
      backgroundColor: colorSet.primaryBackground,
    },
    button: {
      height: 48,
      borderRadius: 24,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 17,
      color: colorSet.placeholderColor,
      fontWeight: '600',
    },
  })
