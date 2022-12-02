import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    vendorItemContainer: {
      flex: 1,
      marginHorizontal: 8,
      marginBottom: 8,
      elevation: 1,
      padding: 10,
      shadowColor: colorSet.grey,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 1,
      borderColor: '#000',
      borderRadius: 5,
      backgroundColor: colorSet.primaryBackground,
    },
    foodPhoto: {
      width: '100%',
      height: 200,
    },
    foodInfo: {
      marginTop: 10,
      flexDirection: 'row',
    },
    foodName: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'left',
      color: colorSet.primaryText,
      fontSize: 15,
      marginVertical: 4,
    },
    foodPrice: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'right',
      color: colorSet.primaryText,
    },
    description: {
      color: colorSet.secondaryText,
      fontSize: 13,
    },
    container: {
      flex: 1,
      backgroundColor: colorSet.grey0,
    },
    icon: {
      width: 25,
      height: 25,
      tintColor: colorSet.primaryForeground,
      marginHorizontal: 5,
    },
  })
}

export default dynamicStyles
