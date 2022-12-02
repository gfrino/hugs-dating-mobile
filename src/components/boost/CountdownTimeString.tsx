import React, { useEffect, useState } from 'react'
import { useTheme } from 'dopenative'
import { Text, StyleSheet } from 'react-native'
import { runOnUI, SharedValue, withTiming } from 'react-native-reanimated'
import { boostConfig } from '../../Core/boost'
import { useDispatch } from 'react-redux'
import { updateUserBoostData } from '../../Core/onboarding/redux/auth'

interface Props {
  lastBoostExpirationUnixTime: number
  progress: SharedValue<number>
}

const CountdownTimeString: React.FC<Props> = ({
  lastBoostExpirationUnixTime,
  progress,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(
    Math.floor(lastBoostExpirationUnixTime / 1000 - Date.now() / 1000),
  )

  const dispatch = useDispatch()

  const maxSeconds = boostConfig.maxBoostTimeInSeconds

  const { theme, appearance } = useTheme()

  const styles = dynamicStyles(theme.colors[appearance])

  const onTick = (progressInPercentage: number) => {
    'worklet'
    progress.value = withTiming(progressInPercentage, { duration: 800 })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prevTime => {
        const updatedTime = prevTime - 1
        runOnUI(onTick)(updatedTime / maxSeconds)
        return updatedTime
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) {
      dispatch(updateUserBoostData({ activeBoost: false }))
    }
  }, [secondsLeft])

  const minutes = paddedNumber(Math.floor((secondsLeft % 3600) / 60))
  const seconds = paddedNumber(Math.floor(secondsLeft % 60))
  return (
    <Text style={styles.countdownTimeString}>
      {minutes}:{seconds}
    </Text>
  )
}

const paddedNumber = (number: number) => {
  return number < 10 ? `0${number}` : number
}

const dynamicStyles = colorSet =>
  StyleSheet.create({
    countdownTimeString: {
      fontSize: 20,
      fontWeight: '600',
      color: colorSet.primaryText,
      marginTop: 24,
      marginBottom: 12,
    },
  })

export default CountdownTimeString
