import React from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

const IMProfileItemView = props => {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const rightArrowIcon = require('../../../../../assets/icons/right-arrow.png')

  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.itemContainer}>
        <Image style={[styles.icon, props.iconStyle]} source={props.icon} />
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <Image style={styles.itemNavigationIcon} source={rightArrowIcon} />
    </TouchableOpacity>
  )
}

export default IMProfileItemView
