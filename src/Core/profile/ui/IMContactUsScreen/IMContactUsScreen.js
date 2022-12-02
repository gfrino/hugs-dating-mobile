import React, { useLayoutEffect, useCallback } from 'react'
import { BackHandler, Linking } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { useFocusEffect } from '@react-navigation/core'
import IMFormComponent from '../IMFormComponent/IMFormComponent'

function IMContactUsScreen(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  let screenTitle = props.route.params.screenTitle || localized('Contact Us')
  const form = props.route.params.form
  const phone = props.route.params.phone
  const initialValuesDict = {}

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      )
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        )
      }
    }, []),
  )

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]
    props.navigation.setOptions({
      headerTitle: screenTitle,
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [])

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack()
    return true
  }

  const onFormButtonPress = _buttonField => {
    Linking.openURL(`tel:${phone}`)
  }

  return (
    <IMFormComponent
      form={form}
      initialValuesDict={initialValuesDict}
      navigation={props.navigation}
      onFormButtonPress={onFormButtonPress}
    />
  )
}

export default IMContactUsScreen
