import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    usersMentionContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colorSet.grey0,
    },
    usersMentionScrollContainer: {
      flex: 1,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
}

export default dynamicStyles
