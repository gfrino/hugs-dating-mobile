import { StyleSheet } from 'react-native'
import { Platform } from 'react-native'

const dynamicStyles = (theme, colorScheme) => {
  const colorSet = theme.colors[colorScheme]
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorSet.primaryBackground,
    },
    logo: {
      width: "100%",
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 150,
    },
    logoImage: {
      width: 175,
      height: 175,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      color: colorSet.primaryForeground,
      marginTop: 35,
      marginBottom: 15,
      textAlign: 'center',
    },
    caption: {
      fontSize: 16,
      paddingHorizontal: 35,
      marginBottom: 20,
      textAlign: 'center',
      color: colorSet.secondaryText,
    },
    loginContainer: {
      width: '70%',
      backgroundColor: colorSet.primaryForeground,
      borderRadius: 25,
      padding: 10,
      marginTop: 10,
      alignSelf: 'center',
      justifyContent: 'center',
      height: 50,
    },
    loginText: {
      color: colorSet.primaryBackground,
    },
    signupContainer: {
      justifyContent: 'center',
      width: '70%',
      backgroundColor: colorSet.primaryBackground,
      borderRadius: 25,
      borderWidth: Platform.OS === 'ios' ? 0.5 : 1.0,
      borderColor: colorSet.primaryForeground,
      padding: 10,
      marginTop: 20,
      alignSelf: 'center',
      height: 50,
    },
    signupText: {
      color: colorSet.primaryForeground,
    },
    dismissButton: {
      position: 'absolute',
      top: 36,
      right: 24,
    },
  })
}

export default dynamicStyles
