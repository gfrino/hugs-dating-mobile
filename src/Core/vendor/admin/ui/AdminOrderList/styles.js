import { StyleSheet } from 'react-native'

const styles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    flat: {
      flex: 1,
      color: colorSet.primaryBackground,
    },
    container: {
      marginBottom: 30,
      flex: 1,
      padding: 10,
    },
    photo: {
      width: '100%',
      height: 100,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    rowContainer: {
      flexDirection: 'row',
    },
    quantityLabel: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 1,
      borderWidth: 1,
      fontWeight: 'bold',
      paddingLeft: 7,
      paddingRight: 7,
      paddingTop: 2,
      paddingBottom: 2,
      textAlign: 'center',
      color: colorSet.primaryForeground,
      backgroundColor: colorSet.primaryBackground,
      borderColor: colorSet.primaryForeground,
      borderWidth: 1,
      borderRadius: 3,
    },
    price: {
      padding: 10,
      color: colorSet.primaryText,
      fontWeight: 'bold',
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
    actionContainer: {
      flexDirection: 'row',
      marginTop: 30,
    },
    total: {
      flex: 4,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontWeight: 'bold',
      padding: 5,
      textAlign: 'center',
      color: colorSet.primaryText,
      borderColor: colorSet.grey3,
    },
    actionButtonContainer: {
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 50,
      backgroundColor: colorSet.primaryForeground,
    },
    actionButtonText: {
      color: colorSet.primaryBackground,
      fontSize: 12,
      fontWeight: 'bold',
    },
  })
}

export default styles
