import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from 'react-native'
import { IRoom } from '../types'
import Gradient from 'react-native-linear-gradient'
import { Shadow } from 'react-native-shadow-2'
import { DEVICE_WIDTH, IS_ANDROID } from '../../../helpers/statics'

import { useTranslations } from 'dopenative'
import { useNavigation } from '@react-navigation/native'

const CARD_HEIGHT = DEVICE_WIDTH / 2

interface Props extends IRoom {
  first?: boolean
}

const RoomCard: React.FC<Props> = ({
  id,
  image,
  name,
  description,
  first = false,
}) => {
  const { localized } = useTranslations()
  const navigation = useNavigation()

  const onPress = () => {
    navigation.navigate('RoomSwiper', { id, name, description })
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.shadowContainer, styles.pressable]}>
      <ImageBackground
        style={[
          styles.container,
          { height: first ? CARD_HEIGHT : CARD_HEIGHT * 1.3 },
        ]}
        source={image}
        imageStyle={{ borderRadius: 8, opacity: 0.9 }}
        resizeMode="cover">
        <Gradient
          style={styles.textWrapper}
          colors={['transparent', 'rgba(0, 0, 0, 0.85)']}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.category}>{localized('INTEREST')}</Text>
        </Gradient>
      </ImageBackground>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  pressable: {
    flex: 1,
    margin: 6,
  },
  shadowViewStyle: { flex: 1, width: '100%' },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'left',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  description: {
    marginTop: 2,
    color: '#e3e3e3',
    fontSize: 16,
    fontWeight: IS_ANDROID ? '300' : '400',
    letterSpacing: 0.5,
  },
  category: {
    marginVertical: 8,
    color: '#ffffffaf',
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  textWrapper: {
    width: '100%',
    padding: 8,
    marginTop: 'auto',
  },
})

export default React.memo(RoomCard)
