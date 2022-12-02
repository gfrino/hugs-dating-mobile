import React, { useCallback, useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import {
  NavigationContainer,
  useNavigation,
  DefaultTheme as NavigationDefaultTheme,
  NavigationProp,
} from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
  IMBlockedUsersScreen,
} from '../Core/profile'
import { IMChatScreen } from '../Core/chat'
import {
  LoadScreen,
  LoginScreen,
  ResetPasswordScreen,
  SignupScreen,
  SmsAuthenticationScreen,
  WalkthroughScreen,
  WelcomeScreen,
} from '../Core/onboarding'
import { logout } from '../Core/onboarding/redux/auth'
import { TNTouchableIcon } from '../Core/truly-native'
import { Image, View } from 'react-native'
import { useAuth } from '../Core/onboarding/hooks/useAuth'
import { AllowLocationScreen } from '../screens/AllowLocationScreen'
import { requestForegroundPermissionsAsync } from 'expo-location'
import { IS_ANDROID } from '../helpers/statics'

import useNotificationOpenedApp from '../Core/helpers/notificationOpenedApp'
import HeaderComponent from '../components/HeaderComponent'
import ConversationsScreen from '../screens/ConversationsScreen/ConversationsScreen'
import SwipeScreen from '../screens/SwipeScreen/SwipeScreen'
import MyProfileScreen from '../screens/MyProfileScreen/MyProfileScreen'
import PickCategoryScreen from '../screens/PickCategoryScreen/PickCategoryScreen'
import SocialScreen from '../screens/SocialScreen'
import RoomsScreen from '../Core/rooms/screens/RoomsScreen/RoomsScreen'
import RoomSwiper from '../Core/rooms/screens/RoomSwiper/RoomSwiper'
import SearchSVG from '../components/SVG/Search'

const Stack = createStackNavigator()

const Tabs = createMaterialBottomTabNavigator()

const LoginStack = () => {
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    handleLocation()
  }, [])

  const handleLocation = async () => {
    const { status } = await requestForegroundPermissionsAsync()
    if (status === 'granted') {
      setIsLocationEnabled(true)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return null
  }

  if (isLocationEnabled) {
    return (
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Sms" component={SmsAuthenticationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    )
  } else {
    return <AllowLocationScreen setIsLocationEnabled={setIsLocationEnabled} />
  }
}

const MyProfileStack = () => {
  const { theme, appearance } = useTheme()
  const colorSet = theme.colors[appearance]
  const { localized } = useTranslations()
  return (
    <Stack.Navigator
      initialRouteName="MyProfile"
      screenOptions={{
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="MyProfile"
        options={{
          headerTitle: localized('My Profile'),
          headerBackTitle: localized('Back'),
          headerStyle: {
            backgroundColor: colorSet.primaryBackground,
          },
          headerTintColor: colorSet.primaryText,
        }}
        component={MyProfileScreen}
      />
      <Stack.Screen
        options={{ headerBackTitle: localized('Back') }}
        name="AccountDetails"
        component={IMEditProfileScreen}
      />
      <Stack.Screen
        options={{ headerBackTitle: localized('Back') }}
        name="Settings"
        component={IMUserSettingsScreen}
      />
      <Stack.Screen
        options={{ headerBackTitle: localized('Back') }}
        name="ContactUs"
        component={IMContactUsScreen}
      />
      <Stack.Screen
        options={{ headerBackTitle: localized('Back') }}
        name="BlockedUsers"
        component={IMBlockedUsersScreen}
      />
    </Stack.Navigator>
  )
}

const ConversationsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'transparent',
        },
        presentation: 'modal',
      }}
      initialRouteName="Conversations">
      <Stack.Screen name="Conversations" component={ConversationsScreen} />
    </Stack.Navigator>
  )
}
const BottomTabsStack = () => {
  const { theme, appearance } = useTheme()

  const primaryBackground = theme.colors[appearance].primaryBackground

  const focusedColor = useCallback(
    focused =>
      focused
        ? (theme.colors[appearance].primaryForeground as string)
        : '#d1d7df',
    [],
  )

  return (
    <Tabs.Navigator
      shifting={!IS_ANDROID}
      sceneAnimationEnabled={!IS_ANDROID}
      barStyle={{
        backgroundColor: primaryBackground,
        borderTopWidth: 0,
        alignItems: 'center',
      }}
      labeled={false}
      initialRouteName="Swipe"
      backBehavior="history">
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                width: 36,
                height: 36,
                bottom: 6,
                ...(focused ? {} : { tintColor: '#d1d7df' }),
              }}
              source={theme.icons.logo}
            />
          ),
        }}
        name="Swipe"
        component={SwipeScreen}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ marginTop: 2 }}>
              <SearchSVG color={focusedColor(focused)} theme={appearance} />
            </View>
          ),
        }}
        name="Rooms"
        component={RoomsScreen}
      />

      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                tintColor: focusedColor(focused),
                width: 26,
                height: 26,
              }}
              source={theme.icons.Like}
            />
          ),
        }}
        name="Social"
        component={SocialScreen}
      />
      <Tabs.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={{
                tintColor: focusedColor(focused),
                width: 26,
                height: 26,
              }}
              source={theme.icons.conversations}
            />
          ),
        }}
        name="Matches"
        component={ConversationsStack}
      />
    </Tabs.Navigator>
  )
}

const MainStackNavigator = () => {
  const { localized } = useTranslations()
  useNotificationOpenedApp()
  return (
    <Stack.Navigator
      screenOptions={{ headerMode: 'float' }}
      initialRouteName="NavStack">
      <Stack.Screen
        options={{
          header: props => <HeaderComponent {...props} />,
        }}
        name="NavStack"
        component={BottomTabsStack}
      />
      <Stack.Screen
        options={{ headerBackTitle: localized('Back') }}
        name="PersonalChat"
        component={IMChatScreen}
      />
    </Stack.Navigator>
  )
}

// Manifest of possible screens
const RootNavigator = () => {
  //@ts-ignore @burzacoding - This should be typed
  const currentUser = useSelector(state => state.auth.user)
  const navigation =
    useNavigation<NavigationProp<{ [key: string]: undefined }>>()
  const authManager = useAuth()
  const dispatch = useDispatch()
  const onLogout = () => {
    // @ts-ignore @burzacoding - This should be typed
    authManager?.logout(currentUser)
    dispatch(logout())
    navigation.navigate('LoadScreen')
  }
  const { theme, appearance } = useTheme()

  const { localized } = useTranslations()
  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
        cardStyle: {
          backgroundColor: theme.colors[appearance].primaryBackground,
        },
      }}
      initialRouteName="LoadScreen">
      <Stack.Screen name="LoadScreen" component={LoadScreen} />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Walkthrough"
        component={WalkthroughScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="LoginStack"
        component={LoginStack}
      />
      {currentUser.id ? (
        currentUser.userCategory ? (
          <Stack.Screen
            options={{ headerShown: false }}
            name="MainStack"
            component={MainStackNavigator}
          />
        ) : (
          <Stack.Screen
            name="PickCategory"
            component={PickCategoryScreen}
            options={{
              title: localized('Pick Category'),
              headerStyle: {
                backgroundColor: theme.colors[appearance].primaryBackground,
                borderBottomWidth: 0,
              },
              headerTintColor: theme.colors[appearance].primaryText,
              headerLeft: () => (
                <TNTouchableIcon
                  imageStyle={{ tintColor: '#d1d7df' }}
                  iconSource={theme.icons.backArrow}
                  onPress={onLogout}
                />
              ),
            }}
          />
        )
      ) : null}
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          animationTypeForReplace: 'pop',
          presentation: IS_ANDROID ? 'modal' : 'card',
        }}
        name="MyProfileStack"
        component={MyProfileStack}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          animationEnabled: true,
          animationTypeForReplace: 'pop',
          presentation: IS_ANDROID ? 'modal' : 'card',
        }}
        name="RoomSwiper"
        component={RoomSwiper}
      />
    </Stack.Navigator>
  )
}
const navTheme = (primaryBackground: string) => ({
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: primaryBackground,
  },
})

const AppNavigator = () => {
  const { theme, appearance } = useTheme()

  const primaryBackground = theme.colors[appearance].primaryBackground

  return (
    <NavigationContainer theme={navTheme(primaryBackground)}>
      <RootNavigator />
    </NavigationContainer>
  )
}

export { RootNavigator, AppNavigator }
