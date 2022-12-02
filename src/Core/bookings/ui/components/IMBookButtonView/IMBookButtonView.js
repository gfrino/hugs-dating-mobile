import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme } from 'dopenative'

import dynamicStyles from './styles'

const IMBookButtonView = ({ bookingConfig, navigation, item }) => {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const onPress = () => {
    // navigation.navigate('ListingsList', { item: item });

    navigation.navigate('IMBookingFlow', { item, bookingConfig })
  }
  return (
    <View style={styles.containerView}>
      <Text style={styles.priceText}>
        {bookingConfig &&
          bookingConfig.itemToBook &&
          bookingConfig.itemToBook.price}
      </Text>
      <TouchableOpacity style={styles.bookButton} onPress={onPress}>
        <Text style={styles.bookButtonText}>{bookingConfig.buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default IMBookButtonView
