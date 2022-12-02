import { StyleSheet } from 'react-native'

const styles = (theme, colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[colorScheme].grey0,
    },
    deleteButton: {
      marginVertical: 12,
      marginBottom: 50,
      color: theme.colors[colorScheme].red,
      fontWeight: 'bold',
    },
  })

export default styles
