import React, { useMemo, useState } from 'react'
import Modal from 'react-native-modal'
import Gradient from 'react-native-linear-gradient'
import { useTheme, useTranslations } from 'dopenative'
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { BoostIconFilled } from '../SVG/Boost'
import { Shadow } from 'react-native-shadow-2'
import { initUserBooster, boostConfig } from '../../Core/boost'
import { useDispatch, useSelector } from 'react-redux'
import { BoostStoreCreators } from '../../Core/boost/redux'
import { BoostUserDoc, IBoost } from '../../Core/boost/types'
import { updateUserBoostData } from '../../Core/onboarding/redux/auth'

interface Props {
  isVisible: boolean
  onClose: () => void
}

const SVG_SIZE = 96
const SVG_SHADOW_RADIUS = SVG_SIZE / 2
const SVG_SHADOW_DISTANCE = SVG_SIZE / 3

const StartBoostModal: React.FC<Props> = ({ isVisible, onClose }) => {
  const { theme, appearance } = useTheme()
  const { localized } = useTranslations()

  const dispatch = useDispatch()

  // @ts-ignore
  const isPremium = useSelector(state => state.inAppPurchase.isPlanActive)
 
  const colorSet = theme.colors[appearance]

  const [isLoading, setIsLoading] = useState(false)

  const styles = dynamicStyles(colorSet)

  const onBoostActivate = async () => {
    setIsLoading(true)
    try {
      await initUserBooster()
      const expDateUnix = Date.now() + boostConfig.maxBoostTimeInSeconds * 1000
      const newBoost: BoostUserDoc = {
        activeBoost: true,
        lastBoostExpirationUnixTime: expDateUnix,
      }
      const newHistoryBoost: IBoost = {
        createdAt: Date.now(),
        expiresAt: expDateUnix,
        freeUse: true,
        userID: '',
        id: '',
      }
      dispatch(updateUserBoostData(newBoost))
      dispatch(BoostStoreCreators.addMonthlyHistory(newHistoryBoost))
    } catch (e) {
      // TODO: handle error @burzacoding
      setIsLoading(false)
    }
  }

  //! @burzacoding: the redux store must be statically typed
  // @ts-ignore
  const userBoostHistory = useSelector(state => state.boosts.boostHistory)
  const freeUsesLeft =
    (isPremium
      ? boostConfig.freeBoostsPerMonth.premium
      : boostConfig.freeBoostsPerMonth.basic) - userBoostHistory.length

  console.log({ freeUsesLeft, userBoostHistory, isPremium })

  const hasFreeUses = freeUsesLeft > 0

  const gradientColors = useMemo(
    () =>
      isLoading
        ? ['#626262', '#a9a9a9']
        : hasFreeUses
        ? [colorSet.primaryForeground, '#f68b9a']
        : ['#a0a0a0', '#5b5b5b'],
    [hasFreeUses, isLoading],
  )

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      swipeDirection={['down']}
      onSwipeComplete={onClose}>
      <View style={styles.container}>
        <Gradient style={styles.topContainer} colors={['#6430a3', '#a271df']}>
          {hasFreeUses ? (
            <Text style={styles.title}>
              {localized('Become the first in line ;)')}
            </Text>
          ) : null}
          <Shadow
            radius={SVG_SHADOW_RADIUS}
            distance={SVG_SHADOW_DISTANCE}
            startColor="rgba(0, 0, 0, 0.125)"
            offset={[0, 12]}>
            <BoostIconFilled size={SVG_SIZE} />
          </Shadow>
          <Text style={styles.freeUsesText}>
            {hasFreeUses
              ? `${localized('You have')} ${freeUsesLeft} ${localized(
                  'free uses left',
                )}`
              : localized('You have no free uses left for this month')}
          </Text>
          {hasFreeUses ? (
            <Text style={styles.descTop}>
              {localized(
                'Be the top profile in your area for 30 minutes and make your profile stand out!',
              )}
            </Text>
          ) : null}
        </Gradient>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={hasFreeUses ? onBoostActivate : onClose}
            disabled={isLoading}>
            <Gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
              colors={gradientColors}>
              {isLoading ? (
                <ActivityIndicator
                  color="#ffffff"
                  style={styles.loadingIndicator}
                />
              ) : null}
              <Text style={styles.buttonText}>
                {hasFreeUses
                  ? localized('START A FREE BOOSTER')
                  : localized('EXIT')}
              </Text>
            </Gradient>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default React.memo(StartBoostModal)

const dynamicStyles = ({ primaryBackground, primaryText }) =>
  StyleSheet.create({
    container: {
      backgroundColor: primaryBackground,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    title: {
      fontSize: 24,
      color: '#fff',
      fontWeight: '600',
      marginBottom: 24,
      textAlign: 'center',
    },
    freeUsesText: {
      marginTop: 36,
      marginBottom: 12,
      fontSize: 18,
      textAlign: 'center',
      color: '#fff',
      fontWeight: '700',
    },
    descTop: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 24,
      textAlign: 'center',
    },
    desc: {
      fontSize: 16,
      color: primaryText,
    },
    topContainer: {
      padding: 16,
      borderTopRightRadius: 8,
      borderTopLeftRadius: 8,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: { width: '100%', padding: 16, marginVertical: 8 },
    button: {
      height: 48,
      borderRadius: 24,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    buttonText: {
      fontSize: 17,
      color: '#fff',
      fontWeight: '600',
      textAlign: 'center',
    },
    loadingIndicator: {
      marginRight: 8,
    },
  })
