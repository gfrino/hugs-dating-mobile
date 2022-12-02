import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorSet.primaryBackground,
    },
    userImageContainer: {
      borderWidth: 0,
    },
    chatsChannelContainer: {
      flex: 1,
      padding: 10,
      backgroundColor: colorSet.primaryBackground,
    },
    content: {
      flexDirection: 'row',
    },
    message: {
      flex: 2,
      color: colorSet.secondaryText,
    },
  })
}

export default dynamicStyles
