import uuid from 'uuidv4'
import { usePaymentRequest } from '../../../payment/api'
import { persistOrder as persistOrderAPI } from './CartAPIClient'
import { getUnixTimeStamp } from '../../../helpers/timeFormat'

const useCartManager = appConfig => {
  const {
    chargeStripeCustomer: chargeStripeCustomerRequest,
    fetchPaypalTokenFromServer,
    chargePaypalCustomer: onChargePaypalCustomer,
    checkoutPaypal,
  } = usePaymentRequest(appConfig)

  const chargeStripeCustomer = async ({
    customer,
    currency,
    amount,
    source,
  }) => {
    const stripeResponse = await chargeStripeCustomerRequest({
      customer,
      currency,
      amount,
      source,
      uuid: uuid(),
    })
    return stripeResponse
  }

  const fetchPaypalToken = () => {
    return new Promise(resolve => {
      fetchPaypalTokenFromServer().then(tokenResponse => resolve(tokenResponse))
    })
  }

  const chargePaypalCustomer = async ({ currency, amount, token }) => {
    return new Promise(resolve => {
      onChargePaypalCustomer({
        currency,
        amount,
        token,
      })
        .then(chargeResponse => resolve({ success: true, ...chargeResponse }))
        .catch(err => resolve({ success: false }))
    })
  }

  const checkoutWithPaypal = options => {
    return new Promise(resolve => {
      checkoutPaypal(options)
        .then(chargeResponse => resolve({ success: true, ...chargeResponse }))
        .catch(err => resolve({ success: false }))
    })
  }

  const placeOrder = (
    cartItems,
    user,
    shippingAddress,
    vendor,
    paymentStatus,
    callback,
  ) => {
    var products = []
    cartItems.forEach(item => {
      const { name, photo, price, quantity } = item
      products.push({
        id: item.id,
        cartColors: [],
        cartSizes: ['XS', 'S', 'M'],
        selectedColor: '',
        selectedSize: '',
        name,
        quantity,
        photo,
        price,
      })
    })

    var order = {
      authorID: user.id,
      author: user,
      products,
      createdAt: getUnixTimeStamp(),
      status: 'Order Placed',
      paymentStatus,
      address: shippingAddress,
    }

    if (vendor?.id) {
      order = {
        ...order,
        vendorID: vendor.id,
        vendor: vendor,
      }
    }

    persistOrderAPI(order, callback)
  }

  return {
    chargeStripeCustomer,
    fetchPaypalToken,
    chargePaypalCustomer,
    checkoutWithPaypal,
    placeOrder,
  }
}

export default useCartManager
