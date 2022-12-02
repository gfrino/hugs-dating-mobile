import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    userImageContainer: {
      borderWidth: 0,
    },
    content: {
      flexDirection: 'row',
    },
    message: {
      flex: 2,
      color: theme.colors[appearance].secondaryText,
    },
  })
}

export default dynamicStyles
