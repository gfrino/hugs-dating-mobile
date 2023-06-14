import React from 'react'
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme, useTranslations } from 'dopenative'
import { size } from '../../helpers/devices'
import * as Statics from '../../helpers/statics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TinderCard = props => {
  const { url, name, age, school, distance, isRoomSwiper } = props
  const { theme } = useTheme()
  const { localized } = useTranslations()

  const { top, bottom } = useSafeAreaInsets()

  const styles = dynamicStyles(top, bottom)
  const formattedDistanceArr = distance?.split(' ') || [' - ']

  const isLessThanAMileAway = formattedDistanceArr[0] === '<'

  return (
    <View style={[styles.container, styles.cardStyle]}>
      <FastImage source={{ uri: url }} style={styles.news_image_style}>
        <ImageBackground
          style={styles.name_info_container}
          source={theme.icons.BackgroundLayer}>
          <View style={styles.userDetailContainer}>
            <Text style={styles.name_style}>
              {name ? name : ' '}
              {age ? `, ${age}` : ' '}
            </Text>
            {school ? (
              <View style={styles.txtBox}>
                <Image style={styles.icon} source={theme.icons.schoolIcon} />
                <Text style={styles.label}>{school}</Text>
              </View>
            ) : null}
            {distance && (
              <View style={styles.txtBox}>
                <Image style={styles.icon} source={theme.icons.markerIcon} />
                <Text style={styles.label}>
                  {(isLessThanAMileAway ? '1 <' : formattedDistanceArr[0]) +
                    ' ' +
                    (isLessThanAMileAway
                      ? localized('mile away')
                      : localized('miles away'))}
                </Text>
              </View>
            )}
          </View>
        </ImageBackground>
      </FastImage>
    </View>
  )
}

const dynamicStyles = (top = 0, bottom) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      width: Statics.DEVICE_WIDTH,
      height:
        Statics.DEVICE_HEIGHT -
        top -
        bottom -
        32 -
        (88 - (Statics.IS_ANDROID ? top : 0)),
    },
    news_image_style: {
      width: Statics.DEVICE_WIDTH - size(25),
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      marginHorizontal: size(10),
      borderRadius: 15,
      overflow: 'hidden',
      backgroundColor: 'white',
    },
    name_info_container: {
      padding: size(20),
      flexDirection: 'row',
    },
    userDetailContainer: {
      flex: 4,
      marginBottom: 72,
    },
    name_style: {
      fontSize: size(24),
      fontWeight: '700',
      color: 'white',
      marginBottom: size(5),
      backgroundColor: 'transparent',
    },
    txtBox: {
      marginTop: size(3),
      flexDirection: 'row',
    },
    icon: {
      width: size(20),
      height: size(20),
      tintColor: 'white',
    },
    label: {
      paddingLeft: size(10),
      fontSize: size(16),
      fontWeight: '400',
      color: 'white',
      backgroundColor: 'transparent',
    },
    detailBtn: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // zIndex: 3000
    },
  })
}

export default TinderCard
