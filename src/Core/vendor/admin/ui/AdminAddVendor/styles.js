import { StyleSheet } from 'react-native'

const styles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 5,
      width: '100%',
      backgroundColor: colorSet.primaryBackground,
    },
    textInput: {
      width: 250,
      marginTop: 3,
      marginBottom: 3,
      fontSize: 16,
      color: colorSet.primaryText,
    },
    mainText: {
      fontSize: 16,
      marginTop: 3,
      color: colorSet.primaryText,
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
    mapIcon: {
      alignSelf: 'flex-start',
      margin: 10,
    },
    map: {
      width: 300,
      height: 300,
      alignSelf: 'center',
      marginVertical: 20,
    },
  })
}

export default styles
