import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    containerView: {
      backgroundColor: colorSet.primaryBackground,
      borderTopWidth: 1,
      borderTopColor: colorSet.hairline,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      height: 80,
    },
    priceText: {
      fontSize: 20,
      color: colorSet.primaryText,
      fontWeight: '500',
      alignItems: 'center',
      textAlign: 'center',
      flex: 1,
    },
    bookButton: {
      flex: 1,
      borderRadius: 25,
      height: 50,
      backgroundColor: colorSet.primaryForeground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bookButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: colorSet.grey0,
    },
  })
}

export default dynamicStyles
