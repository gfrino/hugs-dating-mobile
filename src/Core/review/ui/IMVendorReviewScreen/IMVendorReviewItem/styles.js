import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    starContainer: { flexDirection: 'row', alignSelf: 'center' },
    date: {
      color: colorSet.grey,
      fontSize: 12,
    },
    starStyle: { marginHorizontal: 0.5 },
    reviewContainer: { marginVertical: 8 },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    horizontalPane: {
      flexDirection: 'row',
    },
    pad: {
      padding: 10,
      justifyContent: 'space-between',
    },
    reviewText: {
      fontSize: 15,
      paddingHorizontal: 10,
      color: colorSet.primaryText,
    },
    authorName: {
      color: colorSet.primaryText,
      fontSize: 15,
      fontWeight: 'bold',
    },
    date: {
      color: colorSet.secondaryText,
      fontSize: 13,
    },
    starBox: {
      backgroundColor: colorSet.primaryBackground,
    },
    actionButtonContainer: {
      padding: 16,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 5,
      backgroundColor: colorSet.primaryForeground,
      marginBottom: 30,
    },
    actionButtonText: {
      fontWeight: 'bold',
      color: colorSet.primaryBackground,
    },
  })
}

export default dynamicStyles
