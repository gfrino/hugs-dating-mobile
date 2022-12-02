import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorSet.grey3,
      paddingTop: 10,
    },
    listItem: {
      margin: 10,
      padding: 10,
      backgroundColor: colorSet.primaryBackground,
      width: '90%',
      flex: 1,
      alignSelf: 'center',
      flexDirection: 'row',
      borderRadius: 20,
      shadowColor: colorSet.grey9,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    profilePicture: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignSelf: 'center',
    },
    centerItem: {
      padding: 10,
      alignItems: 'center',
      flexDirection: 'column',
      flex: 1,
    },
    text: {
      color: colorSet.primaryText,
      fontSize: 16,
      marginVertical: 5,
    },
    buttonOpacity: {
      backgroundColor: colorSet.grey3,
      marginVertical: 20,
      height: 35,
      width: 75,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
      shadowColor: colorSet.grey9,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    button: {
      fontWeight: 'bold',
      color: colorSet.primaryForeground,
    },
    emptyViewContainer: {
      marginTop: '40%',
    },
  })
}

export default dynamicStyles
