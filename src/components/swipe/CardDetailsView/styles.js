import { StyleSheet } from 'react-native'
import { DEVICE_HEIGHT } from '../../../helpers/statics'
import { size } from '../../../helpers/devices'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    wrapper: {},
    photoView: {
      width: '100%',
      height: DEVICE_HEIGHT * 0.5,
      backgroundColor: 'skyblue',
    },
    profilePhoto: {
      width: '100%',
      height: '100%',
    },
    backView: {
      position: 'absolute',
      top: -28,
      right: 20,
      width: 55,
      height: 55,
      borderRadius: 27.5,
      backgroundColor: '#db6470',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backIcon: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
      tintColor: 'white',
    },
    titleView: {
      width: '100%',
      paddingHorizontal: 12,
      marginVertical: 20,
      // marginTop: 5,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    nameText: {
      fontSize: 30,
      fontWeight: 'bold',
      marginRight: 10,
      color: theme.colors[appearance].primaryText,
    },
    ageText: {
      bottom: 1,
      fontSize: 25,
      color: theme.colors[appearance].primaryText,
    },
    captionView: {
      width: '100%',
      paddingHorizontal: 12,
    },
    itemView: {
      width: '100%',
      paddingVertical: 2,
      marginVertical: 2,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    icon: {
      width: size(20),
      height: size(20),
      tintColor: 'grey',
    },
    text: {
      paddingLeft: size(10),
      fontSize: size(16),
      color: theme.colors[appearance].primaryText,
      backgroundColor: 'transparent',
    },
    lineView: {
      marginTop: 4,
      width: '100%',
      height: 1,
      backgroundColor: theme.colors[appearance].hairline,
    },
    bioView: {
      width: '100%',
      paddingHorizontal: 12,
      marginVertical: 15,
    },
    label: {
      fontSize: size(20),
      color: theme.colors[appearance].primaryText,
    },
    bioText: {
      fontSize: size(16),
      color: theme.colors[appearance].primaryText,
    },
    instagramView: {
      width: '100%',
      height: 270,
      paddingHorizontal: 12,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
    },
    myphotosItemView: {
      width: 100,
      height: 100,
      marginHorizontal: 8,
      marginVertical: 8,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'grey',
      overflow: 'hidden',
    },
    inlineActionsContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: appearance === 'dark' ? '#000011' : '#ffffee',
      alignSelf: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
    },
    closeButton: {
      alignSelf: 'flex-end',
      height: 24,
      width: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
      marginRight: 15,
    },
    closeButton__text: {
      backgroundColor: 'transparent',
      fontSize: 35,
      lineHeight: 30,
      color: '#FFF',
      textAlign: 'center',
    },
  })
}

export default dynamicStyles
