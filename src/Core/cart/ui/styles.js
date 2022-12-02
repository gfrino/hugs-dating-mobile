import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    checkoutTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      margin: 20,
      color: colorSet.primaryText,
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 5,
      paddingVertical: 12,
      borderBottomColor: colorSet.grey0,
      borderTopColor: colorSet.grey0,
      backgroundColor: colorSet.primaryBackground,
      borderTopWidth: 1,
      borderBottomWidth: 1,
    },
    optionTile: {
      color: colorSet.primaryForeground,
      fontSize: 14,
      fontWeight: '900',
    },
    options: {
      color: colorSet.primaryText,
      fontSize: 14,
      fontWeight: '900',
    },
    container: {
      flex: 1,
      backgroundColor: colorSet.grey0,
    },
    actionButtonContainer: {
      padding: 16,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 5,
      position: 'absolute',
      bottom: 0,
      backgroundColor: colorSet.primaryForeground,
      marginBottom: 30,
    },
    actionButtonText: {
      fontWeight: 'bold',
      color: 'white',
    },
  })
}

export default dynamicStyles
