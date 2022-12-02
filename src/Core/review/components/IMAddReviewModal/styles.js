import { Platform, StyleSheet } from 'react-native'
import {
  heightPercentageToDP as h,
  widthPercentageToDP as w,
} from 'react-native-responsive-screen'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]
  return StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignSelf: 'center',
      height: h(80),
      padding: 5,
      width: w(100),
      backgroundColor: colorSet.primaryBackground,
    },
    starContainer: { flexDirection: 'row', alignSelf: 'flex-start' },
    starStyle: { marginVertical: 5 },
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
      color: colorSet.primaryBackground,
    },
    reviewText: {
      fontSize: 20,
      margin: 10,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: colorSet.primaryText,
    },
    input: {
      fontSize: 18,
      color: colorSet.primaryText,
    },
    headerTitle: {
      position: 'absolute',
      textAlign: 'center',
      width: '100%',
      fontWeight: 'bold',
      fontSize: 20,
      color: colorSet.primaryText,
    },
    rightButton: {
      top: 0,
      right: 0,
      backgroundColor: 'transparent',
      alignSelf: 'flex-end',
      color: colorSet.primaryForeground,
      fontSize: 18,
    },
    selectorRightButton: {
      marginRight: 10,
    },
    navBarContainer: {
      backgroundColor: colorSet.primaryBackground,
    },
    bar: {
      height: 50,
      marginTop: Platform.OS === 'ios' ? 30 : 0,
      justifyContent: 'center',
    },
  })
}

export default dynamicStyles
