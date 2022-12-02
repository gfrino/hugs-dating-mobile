import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, colorScheme, isLoading) => {
  const colorSet = theme.colors[colorScheme]
  return StyleSheet.create({
    buttonContainer: {
      width: '70%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorSet.primaryForeground,
      borderRadius: 25,
      marginVertical: 32,
      height: 48,
    },
    loginText: {
      color: '#ffffff',
      fontSize: 18,
    },
    flatlist: {
      flexGrow: 0,
    },
    titleText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 20,
      color: colorSet.primaryForeground,
    },
    container: {
      alignItems: 'center',
      backgroundColor: colorSet.primaryBackground,
      flex: 1,
    },
  })
}

export default dynamicStyles
