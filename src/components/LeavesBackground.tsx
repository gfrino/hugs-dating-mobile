import { useTheme } from 'dopenative'
import React from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH, IS_ANDROID } from '~/helpers/statics'

interface Props {
  screen?: boolean
}

export const LeavesBackground = ({ screen = false }: Props) => {
  const { theme } = useTheme()
  const Leaves_BG = theme.icons.Leaves_BG

  const styles = dynamicStyles(screen)
  return (
    <ImageBackground
      source={Leaves_BG}
      resizeMode="cover"
      style={styles.img_bg}
      imageStyle={{ opacity: 0.15 }}
    />
  )
}

const dynamicStyles = (screen: boolean) =>
  StyleSheet.create({
    img_bg: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      top: 0,
      left: 0,
      width: screen ? SCREEN_WIDTH : '100%',
      height: screen ? SCREEN_HEIGHT : '100%',
    },
  })
