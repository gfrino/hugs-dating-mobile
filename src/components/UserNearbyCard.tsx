import { useTranslations } from 'dopenative'
import React from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { getDefaultProfilePicture } from '../helpers/statics'

const SCREEN = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
}

interface Props {
  user: any
  onPress: (user: any) => void
}

export const UserNearbyCard: React.FC<Props> = ({ user, onPress }) => {
  const onCardPress = () => {
    onPress(user)
  }
  const styles = dynamicStyles()
  const { localized } = useTranslations()

  return (
    <Pressable onPress={onCardPress} style={styles.containerStyle}>
      <ImageBackground
        style={[styles.cardContainer]}
        source={{
          uri:
            user.profilePictureURL ||
            getDefaultProfilePicture(user.userCategory),
        }}>
        <LinearGradient
          style={[styles.textContainer]}
          colors={['#00000000', '#000000e0']}>
          <Text style={[styles.titleText]}>
            {user.firstName} {user.lastName}
            {/* {user.name} */}
          </Text>
          <Text style={[styles.descriptionText]}>
            {user.distance.toFixed(1)} km {localized('away')}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  )
}

const dynamicStyles = () =>
  StyleSheet.create({
    textContainer: {
      marginTop: 'auto',
      paddingHorizontal: 4,
      paddingVertical: 8,
    },
    titleText: {
      fontSize: 24,
      color: 'white',
      fontWeight: '300',
    },
    descriptionText: {
      fontSize: 14,
      color: 'white',
      fontWeight: '300',
    },
    containerStyle: {
      width: SCREEN.width * 0.5 - 8,
      borderRadius: 10,
      overflow: 'hidden',
      margin: 4,
    },
    imageContainer: {
      height: 172,
      marginBottom: 8,
    },
    cardContainer: {
      height: SCREEN.width * 0.7,
    },
  })
