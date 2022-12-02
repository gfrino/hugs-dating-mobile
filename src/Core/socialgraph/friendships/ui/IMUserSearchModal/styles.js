import { Platform, StyleSheet } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    searchBarContainer: {
      height: 70,
      paddingVertical: 5,
      marginTop: 12,
      ...Platform.select({
        ios: {
          borderBottomWidth: 0.5,
          borderBottomColor: theme.colors[appearance].hairline,
        },
        android: {
          marginHorizontal: 12,
        },
        default: {},
      }),
    },
  })
}

export default dynamicStyles
