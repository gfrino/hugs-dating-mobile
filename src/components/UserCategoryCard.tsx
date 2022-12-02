import React from 'react'
import { Pressable, Text, View, StyleSheet, Image } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface Props {
  category: {
    id: string
    name: string
    color: string
    description: string
  }
  onPress: (category: string) => void
  selectedCategory: string
}

export const UserCategoryCard: React.FC<Props> = ({
  category,
  onPress,
  selectedCategory,
}) => {
  const { localized } = useTranslations()
  const isActive = category.id === selectedCategory
  const onCardPress = () => {
    onPress(category.id)
  }

  const styles = dynamicStyles(category.color)
  const { theme } = useTheme()

  return (
    <Pressable onPress={onCardPress} style={styles.containerStyle}>
      <View style={[styles.cardContainer, styles.cardContainerActive]}>
        <View style={styles.checked}>
          {isActive ? (
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={32}
              color="white"
            />
          ) : null}
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={theme.icons.logo}
            style={{
              width: 128,
              height: 128,
            }}
          />
        </View>
        <Text style={[styles.titleText, styles.titleTextActive]}>
          {localized(category.name)}
        </Text>
      </View>
    </Pressable>
  )
}

const dynamicStyles = (color: string) =>
  StyleSheet.create({
    titleText: {
      fontSize: 20,
      paddingVertical: 6,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    titleTextActive: {
      color: 'white',
    },
    containerStyle: {
      width: '50%',
      padding: 6,
    },
    imageContainer: {
      height: 172 - 48,
      marginBottom: 8,
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContainer: {
      borderColor: color,
      borderWidth: 2,
      borderRadius: 6,
    },
    cardContainerActive: {
      backgroundColor: color,
    },
    checked: {
      width: '100%',
      paddingHorizontal: 8,
      height: 48,
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row',
    },
  })
