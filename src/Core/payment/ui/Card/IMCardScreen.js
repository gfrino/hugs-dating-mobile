import React, { useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { useTheme, useTranslations } from 'dopenative'
import { setSelectedPaymentMethod } from '../../redux/checkout'
import dynamicStyles from './styles'
import Button from 'react-native-button'

function CardScreen(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const dispatch = useDispatch()
  const paymentMethods = useSelector(state => state.checkout.paymentMethods)

  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0)

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
    })
  }, [props.navigation])

  const onPaymentMethodPress = (index, item) => {
    setSelectedMethodIndex(index)
    dispatch(setSelectedPaymentMethod(item))
  }

  const renderCard = (item, index) => {
    return (
      <View key={item?.cardId || index}>
        <TouchableOpacity onPress={() => onPaymentMethodPress(index, item)}>
          <View style={styles.itemContainer}>
            <FastImage style={styles.tick} source={item.iconSource} />
            <Text style={styles.cardText}>{item.title}</Text>
            {index === selectedMethodIndex && (
              <FastImage
                source={require('../../../../assets/icons/tick.png')}
                tintColor={theme.colors[appearance].primaryForeground}
                style={styles.tick}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <FastImage
        source={require('../../../../assets/icons/cardimage.png')}
        style={styles.cardImage}
        resizeMode="contain"
        tintColor={theme.colors[appearance].primaryForeground}
      />
      <View style={styles.line} />
      {/*/renderNativePayButton()*/}
      {paymentMethods.map((item, index) => renderCard(item, index))}
      <View style={styles.line} />
      <Button
        containerStyle={styles.actionButtonContainer}
        onPress={() => props.navigation.navigate('Checkout')}
        style={styles.actionButtonText}>
        {localized('NEXT')}
      </Button>
    </View>
  )
}

export default CardScreen
