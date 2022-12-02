import React, { useRef, useLayoutEffect } from 'react'
import { View } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import DatepickerRange from 'react-native-range-datepicker'

const IMBookingScreen = props => {
  const { route, navigation } = props
  const bookingConfig = route.params.bookingConfig

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const mainColor = useRef(theme.colors[appearance].primaryForeground)

  const onClose = () => {
    navigation.goBack()
  }

  const onConfirm = (startDate, untilDate) => {
    if (!startDate || !untilDate) {
      alert(localized('Please select the dates for your reservation.'))
      return
    }
    navigation.navigate('IMCompleteBooking', {
      bookingData: { startDate, untilDate },
      bookingConfig,
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <View style={styles.containerView}>
      <DatepickerRange
        startDate=""
        untilDate=""
        placeHolderStart="From"
        placeHolderUntil="To"
        onConfirm={onConfirm}
        buttonColor={mainColor.current}
        todayColor={mainColor.current}
        selectedBackgroundColor={mainColor.current}
        infoContainerStyle={{ backgroundColor: mainColor.current }}
        onClose={onClose}
      />
    </View>
  )
}

export default IMBookingScreen
