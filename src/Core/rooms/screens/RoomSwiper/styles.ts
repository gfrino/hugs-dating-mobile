import { StyleSheet } from 'react-native'

// @burzacoding - Theme needs to be typed
export const dynamicStyles = (colorSet: any, marginTop: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: marginTop,
      backgroundColor: colorSet.primaryBackground,
    },
  })
