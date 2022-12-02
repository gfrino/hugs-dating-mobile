import React, { useState } from 'react'
import { FlatList, Text, View, Pressable } from 'react-native'
import { UserCategoryCard } from '../../components/UserCategoryCard'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../Core/users/api/firebase/userClient'
import { setUserData } from '../../Core/onboarding/redux/auth'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const availableCategories = [
  {
    id: 'motor_disabilities',
    name: 'Motor disabilities',
    description: 'People on wheelchair or similar',
    color: '#1F8000',
  },
  {
    id: 'psychic_disability',
    name: 'Psychic disability',
    description: 'People with mental illness',
    color: '#F40002',
  },
  {
    id: 'sensory_disability',
    name: 'Sensory disability',
    description: 'People with hearing or vision problems',
    color: '#5DC1B9',
  },
  {
    id: 'no_disabilities',
    name: 'No disabilities',
    description: 'People with no problems',
    color: '#b8b809',
  },
]

const PickCategoryScreen = ({ navigation, route }) => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance, isLoading)

  const marginTop = useSafeAreaInsets().top

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const currentUser = route.params.user || useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  const handleCategoryChange = category => {
    setSelectedCategory(category)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await updateUser(currentUser.id, { userCategory: selectedCategory })
      dispatch(
        setUserData({
          user: { ...currentUser, userCategory: selectedCategory },
        }),
      )
    } catch (error) {
      setIsLoading(false)
      console.log('upload error', error)
    }
  }

  return (
    <View style={[styles.container, { marginTop }]}>
      <Text style={styles.titleText}>{localized('Select your colour!')}</Text>
      <FlatList
        data={availableCategories}
        renderItem={({ item }) => (
          <UserCategoryCard
            category={item}
            onPress={handleCategoryChange}
            selectedCategory={selectedCategory}
          />
        )}
        keyExtractor={item => item.id}
        style={styles.flatlist}
        numColumns={2}
      />
      <Pressable
        style={[
          styles.buttonContainer,
          {
            opacity: !selectedCategory || isLoading ? 0.5 : 1,
          },
        ]}
        onPress={handleSubmit}
        disabled={!selectedCategory || isLoading}>
        <Text style={styles.loginText}>{localized('Go swipe!')}</Text>
      </Pressable>
    </View>
  )
}
export default PickCategoryScreen
