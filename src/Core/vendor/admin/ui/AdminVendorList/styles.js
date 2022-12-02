import { StyleSheet } from 'react-native'

const styles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 5,
      backgroundColor: colorSet.primaryBackground,
    },
    subText: {
      fontSize: 14,
      marginTop: 3,
      color: colorSet.secondaryText,
    },
    mainText: {
      fontSize: 16,
      marginTop: 3,
      color: colorSet.primaryText,
    },
    divider: {
      width: '100%',
      height: 10,
      backgroundColor: colorSet.grey0,
      marginVertical: 5,
    },
    button: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      borderRadius: 4,
      backgroundColor: colorSet.primaryForeground,
      height: 50,
      textAlignVertical: 'center',
    },
  })
}
export default styles
