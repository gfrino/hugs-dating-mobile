import { StyleSheet, Dimensions } from 'react-native'

const height = Dimensions.get('window').height

const mentionItemContainerHeight = Math.floor(height * 0.066)
const mentionPhotoSize = Math.floor(mentionItemContainerHeight * 0.66)

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]
  return StyleSheet.create({
    mentionItemContainer: {
      width: ' 100%',
      height: mentionItemContainerHeight,
      alignSelf: 'center',
      padding: 10,
      alignItems: 'center',
      flexDirection: 'row',
    },
    mentionPhotoContainer: {
      flex: 0.8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    mentionPhoto: {
      height: mentionPhotoSize,
      borderRadius: mentionPhotoSize / 2,
      width: mentionPhotoSize,
    },
    mentionNameContainer: {
      flex: 6,
      height: '100%',
      justifyContent: 'center',
      borderBottomColor: colorSet.hairline,
      borderBottomWidth: 0.5,
    },
    mentionName: {
      color: colorSet.primaryText,
      fontWeight: '400',
    },
  })
}

export default dynamicStyles
