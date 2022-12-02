import React from 'react'
import { Image, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'dopenative'
import { useCurrentUser } from '../Core/onboarding'
import { getDefaultProfilePicture } from '../helpers/statics'
import { StackHeaderProps } from '@react-navigation/stack'

interface Props extends StackHeaderProps {}

const HeaderComponent = ({ navigation }: Props) => {
  const topSafeArea = useSafeAreaInsets().top

  const currentUser = useCurrentUser()

  const currUserProfilePic =
    currentUser.profilePictureURL ||
    getDefaultProfilePicture(currentUser.userCategory)

  const { theme, appearance } = useTheme()
  const colorSet = theme.colors[appearance]
  const onProfileNavigate = () => {
    navigation.navigate('MyProfileStack')
  }
  return (
    <View
      style={{
        marginTop: topSafeArea,
        backgroundColor: colorSet.primaryBackground,
        height: 52,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Pressable onPress={onProfileNavigate}>
        <View>
          <Image
            source={{ uri: currUserProfilePic }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        </View>
      </Pressable>
      <Image
        source={theme.icons.LogoHugsDating}
        style={{ height: 32, width: 64, marginBottom: 4 }}
      />
      <View style={{ width: 36, height: 36 }} />
    </View>
  )
}

export default React.memo(HeaderComponent)
