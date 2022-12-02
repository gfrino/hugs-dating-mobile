import { StyleSheet, Dimensions } from 'react-native'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
const controlIconSize = HEIGHT * 0.063
const avatarMultiSize = WIDTH * 0.28
const avatarSingleSize = WIDTH * 0.3

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba( 0, 0, 0, 0.3 )',
  },
  profilePictureContainer: {
    height: avatarSingleSize,
    width: avatarSingleSize,
    borderRadius: Math.floor(avatarSingleSize / 2),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 2,
    marginTop: 100,
  },
  profilePictureContainerLeft: {
    marginRight: -20,
    zIndex: 0,
    height: avatarMultiSize,
    width: avatarMultiSize,
    borderRadius: Math.floor(avatarMultiSize / 2),
  },
  profilePictureContainerCenter: {
    marginTop: 40,
    height: avatarMultiSize,
    width: avatarMultiSize,
    borderRadius: Math.floor(avatarMultiSize / 2),
  },
  profilePictureContainerRight: {
    marginLeft: -20,
    height: avatarMultiSize,
    width: avatarMultiSize,
    borderRadius: Math.floor(avatarMultiSize / 2),
    zIndex: 0,
  },
  profilePicture: {
    height: '100%',
    width: '100%',
  },
  imageBackground: {
    flex: 1,
    width: null,
    height: null,
  },
  avatarContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    width: '100%',
    height: '40%',
    alignItems: 'center',
    paddingTop: 40,
  },

  title: {
    marginTop: 25,
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  callStatusLabelTitle: {
    marginTop: 10,
    color: '#fff',
    fontSize: 13,
  },
  controlsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: '7%',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 2,
  },
  controlIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: controlIconSize,
    width: controlIconSize,
    borderRadius: controlIconSize / 2,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
  },
  imageIcon: {
    height: controlIconSize / 2,
    width: controlIconSize / 2,
  },
})

export default styles
