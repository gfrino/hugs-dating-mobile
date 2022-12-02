import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    container: {
      backgroundColor: colorSet.primaryBackground,
      flex: 1,
    },
    headerRightContainer: {
      width: 25,
      height: 25,
      marginHorizontal: 10,
    },
    emptystateConfig: {
      backgroundColor: colorSet.primaryBackground,
      margin: 30,
      marginTop: 90,
    },
  })
}

export default dynamicStyles
