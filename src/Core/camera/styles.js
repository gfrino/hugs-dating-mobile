import { StyleSheet, Dimensions } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height

const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032)
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09)
const controlBottomPosition = 38

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  preview: {
    ...StyleSheet.absoluteFill,
  },
  closeButton: {
    position: 'absolute',
    ...ifIphoneX(
      {
        top: 45,
      },
      {
        top: 25,
      },
    ),
    left: 15,
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4c5c4',
    opacity: 0.7,
    zIndex: 2,
  },
  image: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  closeCross: {
    width: '68%',
    height: 1,
    backgroundColor: 'black',
  },
  headerTitleContainer: {
    position: 'absolute',
    ...ifIphoneX(
      {
        top: 45,
      },
      {
        top: 25,
      },
    ),
    flexDirection: 'row',
    alignSelf: 'center',
    // backgroundColor: 'pink',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    paddingLeft: 10,
  },
  optionsContainer: {
    position: 'absolute',
    ...ifIphoneX(
      {
        top: 45,
      },
      {
        top: 25,
      },
    ),
    right: 15,
    // height: 300,
    width: 50,
    alignItems: 'center',
    // backgroundColor: 'pink',
  },
  optionItemContainer: {
    width: '100%',
    marginVertical: 8,
    // backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 5,
  },
  optionIcon: {
    height: 24,
    width: 24,
    tintColor: '#fff',
  },
  iconTitle: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'normal',
    paddingTop: 5,
  },
  speedContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: controlBottomPosition * 4.3,
    height: 50,
    width: '80%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  speedItemContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSpeedItemContainer: {
    backgroundColor: '#e8e6e7',
    borderRadius: 4,
  },
  speedTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  selectedSpeedTitle: {
    color: '#5c5c5e',
  },
  control: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: controlBottomPosition,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContainer: {
    position: 'absolute',
    bottom: 45,
    right: 15,
    height: 32,
    width: 72,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f6f5',
    opacity: 0.7,
    zIndex: 2,
  },
  capture: {
    backgroundColor: '#f5f6f5',
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  imageIcon: {
    height: 28,
    width: 28,
    tintColor: '#6546d7',
  },
  timerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    ...ifIphoneX(
      {
        top: 45,
      },
      {
        top: 25,
      },
    ),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
  timer: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: '#ff0000',
    marginHorizontal: 5,
  },
})

export default styles
