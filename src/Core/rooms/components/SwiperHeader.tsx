import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'dopenative'

interface Props {
  title: string
  description: string
}

export const SwiperHeader: React.FC<Props> = ({ title, description }) => {
  const navigation = useNavigation()
  const { theme, appearance } = useTheme()

  const isDarkMode = appearance === 'dark'

  const colorSet = theme.colors[appearance]

  const styles = dynamicStyles(colorSet)

  const goBack = () => {
    //@ts-ignore
    return navigation.navigate('Rooms')
  }

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={goBack}>
          <AntDesign
            name="close"
            size={24}
            color={isDarkMode ? '#fff' : '#121212'}
          />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 24, height: 24 }} />
      </View>
      <Text style={styles.description}>{description}</Text>
    </>
  )
}

const dynamicStyles = (colorSet: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colorSet.primaryText,
    },
    description: {
      color: colorSet.primaryText,
      fontSize: 16,
      textAlign: 'center',
      marginVertical: 4,
      paddingHorizontal: 36,
    },
  })
