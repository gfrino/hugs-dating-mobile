import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    containerView: {
      backgroundColor: colorSet.primaryBackground,
      flex: 1,
    },
    relativeView: {
      flex: 1,
    },
    screenTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      margin: 8,
      marginTop: 32,
      marginBottom: 32,
    },
    pickerContainer: {
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: 60,
    },
    pickerTitle: {
      fontSize: 18,
      fontWeight: '500',
      flex: 1,
      color: colorSet.primaryText,
    },
    picker: {
      flex: 5,
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 10,
      right: 10,
      height: 80,
      flex: 1,
    },
    button: {
      height: 60,
      borderRadius: 30,
      backgroundColor: colorSet.primaryForeground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '500',
      color: colorSet.grey0,
    },
  })
}

export default dynamicStyles
