import { StyleSheet, Platform, Dimensions } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const width = Dimensions.get('window').width

  return StyleSheet.create({
    MainContainer: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    safeAreaContainer: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    body: {
      width: '100%',
    },
    photoView: {
      top: Platform.OS === 'ios' ? '4%' : '1%',
      width: 146,
      height: 146,
      borderRadius: 73,
      backgroundColor: 'grey',
      overflow: 'hidden',
      alignSelf: 'center',
    },
    profilePictureContainer: {
      marginTop: 30,
    },
    nameView: {
      width: '100%',
      marginTop: -10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    name: {
      fontSize: 21,
      fontWeight: 'bold',
      // marginRight: 10,
      color: theme.colors[appearance].primaryText,
      padding: 10,
    },
    myphotosView: {
      width: '100%',
      paddingHorizontal: 12,
      marginTop: 20,
      marginBottom: 15,
    },
    itemView: {
      width: '100%',
      paddingVertical: 2,
      marginVertical: 2,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      marginBottom: 11,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slideActivity: {
      height: '100%',
      width: '90%',
    },
    myphotosItemView: {
      width: Math.floor(width * 0.24),
      height: Math.floor(width * 0.24),
      marginHorizontal: 8,
      marginVertical: 8,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'grey',
      overflow: 'hidden',
    },
    optionView: {
      width: '100%',
      marginVertical: 9,
      paddingHorizontal: 12,
      flexDirection: 'row',
    },
    icon: {
      height: 40,
      width: 40,
    },
    iconView: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textView: {
      flex: 0.8,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    textLabel: {
      fontSize: 16,
      color: theme.colors[appearance].primaryText,
    },
    photoTitleLabel: {
      fontWeight: '500',
      fontSize: 17,
      paddingLeft: 22,
      color: theme.colors[appearance].primaryText,
    },
    logoutView: {
      width: '92%',
      marginTop: 20,
      marginBottom: 50,
      marginHorizontal: 12,
      padding: 10,
      borderRadius: 10,
      borderWidth: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inactiveDot: {
      backgroundColor: theme.colors[appearance].grey6,
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
    },
  })
}

export default dynamicStyles
