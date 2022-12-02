import { StyleSheet } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const styles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
    },
    container: {
      flex: 1,
      width: wp(100),
      height: hp(70),
      marginTop: hp(5),
      justifyContent: 'flex-start',
      backgroundColor: 'white',
      alignSelf: 'center',
      borderTopRightRadius: 5,
      borderTopLeftRadius: 5,
    },
    title: {
      fontSize: 28,
      marginLeft: 12,
      marginTop: 30,
      fontWeight: 'bold',
      color: colorSet.primaryText,
    },
    text: {
      fontSize: 18,
      color: colorSet.primaryText,
      fontWeight: 'bold',
    },
    description: {
      fontSize: 14,
      color: colorSet.secondaryText,
      marginTop: 5,
    },
    addressPane: {
      marginLeft: 30,
      flexDirection: 'row',
      marginVertical: 30,
      alignItems: 'center',
    },
    tick: {
      width: 20,
      height: 20,
      marginRight: 15,
    },
    line: {
      width: wp(80),
      alignSelf: 'center',
      height: 0.5,
      backgroundColor: colorSet.hairline,
    },
    orderPane: {
      flexDirection: 'row',
      marginVertical: 10,
      marginLeft: 65,
      alignItems: 'center',
    },
    productItem: {
      marginTop: -2,
      fontSize: 16,
      color: colorSet.primaryText,
      fontWeight: 'bold',
    },
    number: {
      padding: 4,
      backgroundColor: '#EDEEED',
      marginRight: 15,
      borderRadius: 3,
      width: 20,
      textAlign: 'center',
    },
    progress: {
      position: 'absolute',
      top: 35,
      right: 20,
      zIndex: 777,
    },
    undo: {
      padding: 10,
      paddingHorizontal: 15,
      backgroundColor: '#EDEEED',
      marginRight: 15,
      borderRadius: 22,
      fontSize: 16,
      textAlign: 'center',
      position: 'absolute',
      bottom: 30,
      alignSelf: 'center',
      color: '#333333',
      fontWeight: 'bold',
    },
  })
}

export default styles
