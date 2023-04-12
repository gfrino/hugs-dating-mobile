import React, { useLayoutEffect, useCallback } from 'react'
import { BackHandler, Linking } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { useFocusEffect } from '@react-navigation/core'
import IMFormComponent from '../IMFormComponent/IMFormComponent'
import {Text} from 'react-native'
function IMContactUsScreen(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  let screenTitle = props.route.params.screenTitle || localized('Contact Us')
  const form = props.route.params.form
  console.log("props.route.params",props.route.params.form.sections[0].fields[0].value);
  // const email = props.route.params.email
  const email = props.route.params.form.sections[0].fields[0].value;
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
    Linking.openURL(`mailto:${email}`)
  }

  return (
    <>
    <IMFormComponent
      form={form}
      initialValuesDict={initialValuesDict}
      navigation={props.navigation}
      onFormButtonPress={onFormButtonPress}
    />
    </>
  )
}

export default IMContactUsScreen
