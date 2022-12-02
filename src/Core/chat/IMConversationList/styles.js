import { StyleSheet, Dimensions } from 'react-native'

const { height } = Dimensions.get('window')

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
      padding: 0,
      backgroundColor: colorSet.primaryBackground,
    },
    chatItemContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    chatItemContent: {
      flex: 1,
      alignSelf: 'center',
      marginLeft: 10,
    },
    chatFriendName: {
      color: colorSet.primaryText,
      fontSize: 17,
    },
    content: {
      flexDirection: 'row',
    },
    message: {
      flex: 2,
      color: colorSet.secondaryText,
    },
    emptyViewContainer: {
      marginTop: height / 6,
    },
  })
}

export default dynamicStyles
