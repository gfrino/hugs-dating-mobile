import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Linking,
  AppState,
} from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { GlobeSVG } from '../components/SVG/Globe'
import { requestForegroundPermissionsAsync } from 'expo-location'

export const AllowLocationScreen = ({ setIsLocationEnabled }) => {
  const { theme, appearance } = useTheme()
  const { localized } = useTranslations()
  const colorSet = theme.colors[appearance]
  const styles = dynamicStyles(colorSet)

  const handleLocation = async () => {
    if (Platform.OS === 'android') {
      await getPermissions()
    } else {
      Linking.openSettings()
    }
  }

  const getPermissions = async () => {
    const { status } = await requestForegroundPermissionsAsync()
    if (status === 'granted') {
      setIsLocationEnabled(true)
    }
  }

  useEffect(() => {
    const unsubscribe = AppState.addEventListener('change', state => {
      if (state === 'active') {
        console.log('active')
        getPermissions()
      }
    })

    return unsubscribe.remove
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <GlobeSVG />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>
          {localized('Allow us to know your location')}
        </Text>
        <Text style={styles.description}>
          {localized(
            'We need your location in order to show people around you',
          )}
        </Text>
        <Pressable style={styles.buttonContainer} onPress={handleLocation}>
          <Text style={styles.buttonText}>{localized('Continue')}</Text>
        </Pressable>
      </View>
    </View>
  )
}

const dynamicStyles = colorSet =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colorSet.primaryBackground,
    },
    iconContainer: {
      marginTop: 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 36,
      flex: 2,
    },
    body: {
      flex: 1,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: colorSet.primaryText,
      fontSize: 22,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 8,
    },
    description: {
      color: colorSet.secondaryText,
      fontSize: 18,
      textAlign: 'center',
    },
    buttonContainer: {
      height: 46,
      width: '100%',
      backgroundColor: colorSet.primaryForeground,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 32,
      marginTop: 'auto',
      marginBottom: 32,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 20,
      textAlign: 'center',
      fontWeight: '400',
    },
  })
