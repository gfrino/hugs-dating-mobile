import { StyleSheet } from 'react-native'

const imageSize = 40

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colorSet.primaryBackground,
    },
    userImageMainContainer: {
      flex: 1,
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 7,
    },
    userImageContainer: {
      width: imageSize,
      height: imageSize,
      borderWidth: 0,
      alignItems: 'flex-end',
    },
    userImage: {
      width: imageSize,
      height: imageSize,
    },
    notificationItemBackground: {
      flex: 1,
    },
    notificationItemContainer: {
      flexDirection: 'row',
      width: '95%',
      height: 82,
      alignSelf: 'center',
      borderBottomColor: colorSet.hairline,
      borderBottomWidth: 0.3,
    },
    notificationLabelContainer: {
      flex: 5.4,
      justifyContent: 'center',
    },
    description: {
      color: colorSet.primaryText,
      fontSize: 16,
      paddingVertical: 6,
    },
    name: {
      fontWeight: '700',
    },
    moment: {
      fontSize: 12,
    },
    seenNotificationBackground: {
      backgroundColor: colorSet.primaryBackground,
    },
    unseenNotificationBackground: {
      backgroundColor: appearance === 'dark' ? '#062246' : '#e8f1fd',
    },
    emptyStateView: {
      paddingTop: 120,
      flex: 1,
      backgroundColor: colorSet.primaryBackground,
    },
  })
}

export default dynamicStyles
