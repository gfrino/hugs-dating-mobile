import React, { useState, useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import Swiper from 'react-native-swiper'
import {
  initConnection,
  requestSubscription,
  getSubscriptions,
} from 'react-native-iap'
import { setPlans } from '../redux'
import dynamicStyles from './styles'
import { useIAPConfig } from '../hooks/useIAPConfig'

export default function IMSubscriptionScreen(props) {
  const {
    visible,
    onClose,
    processing,
    setProcessing,
    onSetSubscriptionPeriod,
  } = props

  const dispatch = useDispatch()

  const subscriptions = useSelector(state => state.inAppPurchase.plans)


  const [selectedSubscriptionIndex, setSelectedSubscriptionIndex] = useState(0)
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState({})
  const { config } = useIAPConfig()

  const [focusedSlide, setFocusedSlide] = useState(
    config.subscriptionSlideContents[0],
  )

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  useEffect(() => {
    if (subscriptions.length === 0) {
      ; (async () => {
        await initConnection()
        getIAPProducts()
      })()
    }
  }, [subscriptions])

  const onSubscriptioinPlanPress = (item, index) => {
    setSelectedSubscriptionIndex(index)
    setSelectedSubscriptionPlan(item)
  }

  const handleSubscription = async () => {
    const period =
      selectedSubscriptionPlan.subscriptionPeriodUnitIOS ||
      selectedSubscriptionPlan.subscriptionPeriodAndroid


    setProcessing(true)
    onSetSubscriptionPeriod(period.toLowerCase())
    try {
      console.log(selectedSubscriptionPlan)
      await requestSubscription(selectedSubscriptionPlan.productId)
    } catch (err) {
      console.error("handleSubscription ", err);
      setProcessing(false)
    }
  }

  const getIAPProducts = async () => {
    try {
      const plans = await getSubscriptions(config.IAP_SKUS)

      if (plans.length > 0) {
        setSelectedSubscriptionPlan(plans[0])
        dispatch(setPlans({ plans }))
      }
    } catch (err) {
      console.log('ERROR [getIAPProducts]', err)
    }
  }

  const onSwipeIndexChange = index => {
    setFocusedSlide(config.subscriptionSlideContents[index])
  }

  const renderInactiveDot = () => <View style={styles.inactiveDot} />

  const renderActiveDot = () => <View style={styles.activeDot} />

  const renderSubScriptionPlan = (item, index) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        key={index}
        onPress={() => onSubscriptioinPlanPress(item, index)}
        style={styles.subscriptionContainer}>
        <View style={styles.selectContainer}>
          <View
            style={[
              styles.tickIconContainer,
              selectedSubscriptionIndex === index &&
              styles.selectedSubscription,
            ]}>
            {selectedSubscriptionIndex === index && (
              <Image
                style={styles.tick}
                source={require('../assets/tick.png')}
              />
            )}
          </View>
        </View>
        <View style={styles.rateContainer}>
          <Text style={styles.rateText}>
            {item?.localizedPrice + '/'}
            <Text style={styles.monthText}>
              {Platform.OS === 'ios'
                ? item?.subscriptionPeriodUnitIOS?.toLowerCase()
                : item.productId === 'annual_vip_subscription'
                  ? localized('year')
                  : localized('month')}
            </Text>
          </Text>
        </View>

      </TouchableOpacity>
    )
  }

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      onRequestClose={onClose}
      animationType={'fade'}
      presentationStyle={'pageSheet'}>
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <Swiper
            onIndexChanged={onSwipeIndexChange}
            removeClippedSubviews={false}
            containerStyle={{ flex: 1 }}
            dot={renderInactiveDot()}
            activeDot={renderActiveDot()}
            paginationStyle={{
              bottom: 20,
            }}
            loadMinimal={true}
            loop={false}>
            {config.subscriptionSlideContents.map((image, index) => (
              <View key={index + ''} style={styles.carouselImageContainer}>
                <Image style={styles.carouselImage} resizeMode="contain" source={image.src} />
              </View>
            ))}
          </Swiper>
        </View>
        <View style={styles.subscriptionsContainer}>
          <Text style={styles.headerTitle}>{focusedSlide.title}</Text>
          <Text style={styles.titleDescription}>
            {focusedSlide.description}
          </Text>
          <View style={styles.subscriptionPlansContainer}>
            {subscriptions.map(renderSubScriptionPlan)}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomHeaderTitle}>
            {localized('Recurring billing, cancel anytime')}
          </Text>
          <Text style={styles.titleDescription}>
            {localized(
              'We are going to charge you every payment period the amount you displayed above',
            )}
            .
          </Text>
          <TouchableOpacity
            disabled={processing || subscriptions.length < 1}
            onPress={handleSubscription}
            style={styles.bottomButtonContainer}>
            <Text style={styles.buttonTitle}>{localized('Purchase')}</Text>
          </TouchableOpacity>
          {Platform.OS !== 'ios' && (
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelTitle}>{localized('Cancel')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  )
}
