import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    containerView: {
      backgroundColor: colorSet.primaryBackground,
      flex: 1,
    },
  })
}

export default dynamicStyles
