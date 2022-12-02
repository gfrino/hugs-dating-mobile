import { useRef } from 'react'
import usePaymentRequest from './usePaymentRequest'

const usePaymentSheetManager = appConfig => {
  const { setupStripe, getPaymentSheetKeys } = usePaymentRequest(appConfig)
  const stripeCustomerID = useRef()
  const stripeClientSecret = useRef()
  const totalPrice = useRef()

  const retrieveSheetKeys = async (email, amount) => {
    totalPrice.current = Number(amount)
    const res = await setupStripe(email)

    if (!res?.success || !res.data?.customerId) {
      // failed to set up stripe customer
      return null
    }

    stripeCustomerID.current = res.data.customerId
    stripeClientSecret.current = res.data.clientSecret

    return fetchPaymentSheetKeys()
  }

  const fetchPaymentSheetKeys = async () => {
    const amount = Math.floor(totalPrice.current * 100)

    const res = await getPaymentSheetKeys(
      stripeCustomerID.current,
      appConfig.currencyCode,
      amount,
    )

    if (!res?.success || !res.data?.paymentIntent) {
      // failed to config payment sheet
      return null
    }

    const { ephemeralKey, paymentIntent, customer } = res.data

    return {
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      clientSecret: stripeClientSecret.current,
    }
  }

  const constructApplePayOptions = appleCartItems => {
    return {
      cartItems: appleCartItems,
      country: 'US',
      currency: 'USD',
      // shippingMethods: [
      //   {
      //     amount: '20.00',
      //     identifier: 'DPS',
      //     label: 'Courier',
      //     detail: 'Delivery',
      //     type: 'final',
      //   },
      // ],
      requiredShippingAddressFields: ['emailAddress', 'phoneNumber'],
      requiredBillingContactFields: ['phoneNumber', 'name'],
    }
  }

  return { constructApplePayOptions, retrieveSheetKeys }
}

export default usePaymentSheetManager
