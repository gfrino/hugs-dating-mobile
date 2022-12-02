import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      marginVertical: 2,
      paddingVertical: 5,
      alignItems: 'center',
    },
    visaIcon: {
      width: 25,
      height: 25,
      marginRight: 10,
      opacity: 0.7,
    },
    cardText: {
      color: colorSet.primaryForeground,
    },
    tick: {
      width: 20,
      height: 20,
      marginHorizontal: 10,
    },
    actionButtonContainer: {
      padding: 16,
      backgroundColor: colorSet.primaryForeground,
      marginVertical: 30,
    },
    actionButtonText: {
      fontWeight: 'bold',
      color: 'white',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 10,
      backgroundColor: colorSet.primaryBackground,
    },
    cardImage: {
      width: 200,
      height: 150,
      marginVertical: 25,
      alignSelf: 'center',
    },
    line: {
      backgroundColor: colorSet.primaryForeground,
      height: 0.5,
      width: '100%',
      opacity: 0.4,
      marginVertical: 3,
    },
  })
}

export default dynamicStyles
