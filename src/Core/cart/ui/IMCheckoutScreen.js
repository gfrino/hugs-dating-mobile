import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Alert, Text, TouchableWithoutFeedback, View } from 'react-native'
import Button from 'react-native-button'
import { useSelector, useDispatch } from 'react-redux'
import { useStripe } from '@stripe/stripe-react-native'
import { useTheme, useTranslations } from 'dopenative'
import { usePaymentSheetManager } from '../../payment/api'
import { useCartManager } from '../api'
import { overrideCart } from '../redux/actions'
import dynamicStyles from './styles'
import { IMPlacingOrderModal } from '../../delivery/IMPlacingOrderModal/IMPlacingOrderModal'
import { TNActivityIndicator } from '../../truly-native'
import { useCartConfig } from '../hooks/useCartConfig'
import { useCurrentUser } from '../../onboarding'
import { useConfig } from '../../../config/consumerAppConfig'

function IMCheckoutScreen(props) {
  const config = useConfig()

  const currentUser = useCurrentUser()
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const {
    initPaymentSheet,
    presentPaymentSheet,
    presentApplePay,
    confirmApplePayPayment,
    isApplePaySupported,
  } = useStripe()

  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.cartItems)
  const cartVendor = useSelector(state => state.cart.vendor)
  const selectedPaymentMethod = useSelector(
    state => state.checkout.selectedPaymentMethod,
  )
  const shippingAddress = useSelector(state => state.checkout.shippingAddress)

  const [placeOrderVisible, setPlaceOrderVisible] = useState(false)
  const [isVisible, setVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [loadingText, setLoadingText] = useState('')

  const { retrieveSheetKeys, constructApplePayOptions } =
    usePaymentSheetManager(config)
  const {
    chargePaypalCustomer,
    checkoutWithPaypal,
    fetchPaypalToken,
    placeOrder,
  } = useCartManager(config)

  const stripeClientSecret = useRef(null)

  useEffect(() => {
    const shouldLoadPaymentSheet =
      selectedPaymentMethod.key !== 'paypal' &&
      selectedPaymentMethod.key !== 'cashOnDelivery'

    if (shouldLoadPaymentSheet) {
      setPaymentKeys()
    }
  }, [totalPrice])

  useEffect(() => {
    if (cartItems?.length > 0) {
      const newTotalPrice = cartItems.reduce(
        (prev, next) => prev + next.price * next.quantity,
        0,
      )
      setTotalPrice(newTotalPrice)
    }
  }, [cartItems])

  const setPaymentKeys = async () => {
    setIsLoading(true)
    const res = await retrieveSheetKeys(currentUser.email, totalPrice)

    if (!res) {
      alertPaymentSetupFailed()
      setIsLoading(false)
      return
    }

    const {
      customerId,
      customerEphemeralKeySecret,
      paymentIntentClientSecret,
      clientSecret,
    } = res

    const { error } = await initPaymentSheet({
      customerId,
      customerEphemeralKeySecret,
      paymentIntentClientSecret,
    })

    if (error) {
      alertPaymentSetupFailed()
      setIsLoading(false)
      return
    }

    stripeClientSecret.current = clientSecret
    setIsLoading(false)
  }

  const persistOrder = () => {
    placeOrder(
      cartItems,
      currentUser,
      shippingAddress,
      cartVendor,
      'paid',
      () => {
        setPlaceOrderVisible(false)
        dispatch(overrideCart([]))
        props.navigation.navigate('Home')
      },
    )
  }

  const getAppleCartItems = () => {
    return cartItems.map(cartItem => {
      const amount = parseFloat(cartItem.price) * cartItem.quantity
      return {
        label: cartItem.name,
        amount: `${amount}`,
      }
    })
  }

  const onNativePay = async () => {
    if (!isApplePaySupported) return
    setIsLoading(true)
    const applePayOptions = await constructApplePayOptions(getAppleCartItems())
    const { error } = await presentApplePay(applePayOptions)
    if (error) {
      // handle error
      alertTransactionFailed()
      return
    }

    const { error: confirmError } = await confirmApplePayPayment(
      stripeClientSecret.current,
    )

    if (confirmError) {
      // handle error
      alertTransactionFailed()
      return
    }

    persistOrder()
  }

  const handlePaypalPayment = () => {
    setIsLoading(true)
    setLoadingText(localized('Fetching Tokens'))
    fetchPaypalToken().then(async token => {
      setIsLoading(false)
      if (token.success) {
        let res = await chargePaypalCustomer({
          token: token.clientToken,
          amount: totalPrice,
          currency: 'USD',
        })
        if (res.success) {
          setIsLoading(true)
          setLoadingText(localized('Processing Payment'))

          checkoutWithPaypal({ nonce: res.nonce, amount: totalPrice }).then(
            checkoutRes => {
              setIsLoading(false)
              setLoadingText('')
              if (checkoutRes.success) {
                setPlaceOrderVisible(true)
                persistOrder()
              }
            },
          )
        } else {
          Alert.alert(localized('Error'), localized('User cancelled payment'))
        }
      } else {
        console.log(token.success)
      }
    })
  }

  const onPlaceOrder = async () => {
    if (selectedPaymentMethod.isNativePaymentMethod) {
      onNativePay()
      return
    }

    if (selectedPaymentMethod.key === 'paypal') {
      handlePaypalPayment()
      return
    }

    if (selectedPaymentMethod.key === 'cashOnDelivery') {
      persistOrder()
      return
    }

    if (!stripeClientSecret.current) {
      alertPaymentSetupFailed()
      return
    }
    const { error, paymentOption } = await presentPaymentSheet({
      clientSecret: stripeClientSecret.current,
      confirmPayment: true,
    })

    if (error) {
      alertTransactionFailed()
      return null
    }
    persistOrder()
  }

  const alertTransactionFailed = () => {
    Alert.alert(
      localized('Transaction Failed'),
      localized('Please select another card or try another means of payment'),
      [
        {
          text: localized('OK'),
          onPress: () => setIsLoading(false),
        },
      ],
    )
  }

  const alertPaymentSetupFailed = () => {
    Alert.alert(
      localized('Failed to set up payment'),
      localized(
        'An error occurred while setting up payment. Please try again later',
      ),
      [
        {
          text: localized('OK'),
          onPress: () => setIsLoading(false),
        },
      ],
    )
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <View />,
    })
  })

  return (
    <View style={styles.container}>
      {isLoading && <TNActivityIndicator text={loadingText} />}
      <Text style={styles.checkoutTitle}>{localized('Checkout')}</Text>
      {placeOrderVisible && (
        <IMPlacingOrderModal
          onCancel={() => setPlaceOrderVisible(false)}
          cartItems={cartItems}
          shippingAddress={shippingAddress}
          isVisible={true}
          user={currentUser}
        />
      )}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionTile}>{localized('Payment')}</Text>
        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate('Cards')}>
          <Text style={styles.options}>{selectedPaymentMethod.last4}</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.optionsContainer}>
        <Text style={styles.optionTile}>{localized('Deliver to')}</Text>
        <TouchableWithoutFeedback>
          <Text onPress={() => setVisible(true)} style={styles.options}>
            {shippingAddress.length === 0
              ? localized('Select Address')
              : `${shippingAddress.line1} ${shippingAddress.line2}`}
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.optionsContainer}>
        <Text style={styles.optionTile}>{localized('Total')}</Text>
        <TouchableWithoutFeedback>
          <Text style={styles.options}>${totalPrice?.toFixed(2)}</Text>
        </TouchableWithoutFeedback>
      </View>

      <Button
        containerStyle={styles.actionButtonContainer}
        onPress={onPlaceOrder}
        style={styles.actionButtonText}>
        {localized('PLACE ORDER')}
      </Button>
    </View>
  )
}

export default IMCheckoutScreen
