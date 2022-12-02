import { StyleSheet, Dimensions } from 'react-native'

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
const controlIconSize = HEIGHT * 0.063
const avatarMultiSize = WIDTH * 0.28
const avatarSingleSize = WIDTH * 0.3

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullscreenStreamContainer: {
    overflow: 'hidden',
    backgroundColor: 'black',
    zIndex: 0,
    ...StyleSheet.absoluteFill,
  },
  secondaryStreamsContainer: {
    position: 'absolute',
    top: HEIGHT * 0.06,
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    width: '98%',
    height: '25%',
    zIndex: 3,
  },
  secondaryStream: {
    backgroundColor: 'black',
    width: '22%',
    height: '70%',
    zIndex: 3,
    borderRadius: 10,
    marginLeft: 8,
    marginTop: 5,
    overflow: 'hidden',
  },
  rtcStream: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
  },
  controlsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: '7%',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 4,
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
