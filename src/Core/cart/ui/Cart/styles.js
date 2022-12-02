import { StyleSheet } from 'react-native'

const styles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorSet.primaryBackground,
    },
    emptyTitle: {
      flex: 1,
      alignSelf: 'center',
      alignItems: 'center',
      textAlignVertical: 'center',
      justifyContent: 'center',
      color: colorSet.primaryText,
    },
    flat: {
      flex: 1,
      margin: 10,
    },
    rowContainer: {
      flexDirection: 'row',
    },
    count: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 1,
      borderWidth: 1,
      paddingLeft: 5,
      paddingRight: 5,
      textAlign: 'center',
      color: colorSet.primaryForeground,
      borderColor: colorSet.grey6,
    },
    price: {
      padding: 10,
      color: colorSet.primaryText,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    title: {
      flex: 1,
      padding: 10,
      color: colorSet.primaryText,
      fontWeight: 'bold',
      fontWeight: 'bold',
      textAlign: 'left',
    },
    actionButtonContainer: {
      padding: 16,
      backgroundColor: colorSet.primaryForeground,
      marginBottom: 30,
    },
    actionButtonText: {
      fontWeight: 'bold',
      color: 'white',
    },
    emptyViewContainer: {
      marginTop: '25%',
      flex: 1,
    },
  })
}

export default styles
