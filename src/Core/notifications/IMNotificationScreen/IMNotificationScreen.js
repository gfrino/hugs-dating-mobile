import React, { useEffect, useLayoutEffect } from 'react'
import { BackHandler } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import IMNotification from '../Notification/IMNotification'
import { firebaseNotification } from '../../notifications'
import { setNotifications } from '../redux'
import { useCurrentUser } from '../../onboarding'

const IMNotificationScreen = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  const user = useCurrentUser()
  const notifications = useSelector(state => state.notifications.notifications)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]
    props.navigation.setOptions({
      headerTitle: localized('Notifications'),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [dispatch])

  useEffect(() => {
    let didFocusSubscription = props.navigation.addListener('focus', payload =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        props.onBackButtonPressAndroid,
      ),
    )

    let willBlurSubscription = props.navigation.addListener(
      'beforeRemove',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        ),
    )
    const notificationUnsubscribe = firebaseNotification.subscribeNotifications(
      user.id,
      onNotificationCollection,
    )

    return () => {
      notificationUnsubscribe()
      didFocusSubscription && didFocusSubscription()
      willBlurSubscription && willBlurSubscription()
    }
  }, [])

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack()
    return true
  }

  const onNotificationCollection = notifications => {
    dispatch(setNotifications(notifications))
  }

  const onNotificationPress = async notification => {
    firebaseNotification.updateNotification({
      ...notification,
      seen: true,
    })

  }

  const emptyStateConfig = {
    title: localized('No Notifications'),
    description: localized(
      'You currently do not have any notifications. Your notifications will show up here.',
    ),
  }

  return (
    <IMNotification
      onNotificationPress={onNotificationPress}
      notifications={notifications}
      emptyStateConfig={emptyStateConfig}
    />
  )
}

export default IMNotificationScreen
