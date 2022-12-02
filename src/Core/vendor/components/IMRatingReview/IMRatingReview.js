import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import dynamicStyles from './styles'
import PropTypes from 'prop-types'
import { useTheme } from 'dopenative'
import FastImage from 'react-native-fast-image'

export default function Rating({ rating, number, onPressReview }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  if (rating === 0) {
    return <View style={styles.container} />
  }

  return (
    <TouchableOpacity onPress={onPressReview}>
      <View style={styles.container}>
        <Text style={styles.rating}>{rating.toFixed(2)}</Text>
        <FastImage
          tintColor={theme.colors[appearance].primaryForeground}
          style={styles.image}
          source={require('../../../../assets/images/gold_star.png')}
        />
        <Text style={styles.rating}>({number})</Text>
      </View>
    </TouchableOpacity>
  )
}

Rating.propTypes = {
  rating: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
}
