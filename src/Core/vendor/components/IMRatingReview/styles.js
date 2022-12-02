import { StyleSheet } from 'react-native'
const styles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    rating: {
      fontSize: 13,
      color: colorSet.primaryText,
    },
    image: {
      height: 20,
      width: 20,
    },
    container: {
      paddingVertical: 6,
      flexDirection: 'row',
      color: colorSet.grey6,
    },
  })
}

export default styles
