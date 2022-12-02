import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native'

const { height } = Dimensions.get('window')

const dynamicStyles = (theme, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[colorScheme].primaryBackground,
    },
    emptyViewContainer: {
      marginTop: height / 5,
    },
  })
}

export default dynamicStyles
