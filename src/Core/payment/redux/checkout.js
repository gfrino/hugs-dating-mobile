import { Platform } from 'react-native'

const UPDATE_SUBTOTAL_PRICE = 'UPDATE_SUBTOTAL_PRICE'
const UPDATE_TOTAL_PRICE = 'UPDATE_TOTAL_PRICE'
const UPDATE_CARD_NUMBERS_ENDING = 'UPDATE_CARD_NUMBERS_ENDING'
const UPDATE_SELECTED_SHIPPING_METHOD = 'UPDATE_SELECTED_SHIPPING_METHOD'
const UPDATE_PAYMENT_METHODS = 'UPDATE_PAYMENT_METHODS'
const REMOVE_PAYMENT_METHOD = 'REMOVE_PAYMENT_METHOD'
const UPDATE_SELECTED_PAYMENT_METHOD = 'UPDATE_SELECTED_PAYMENT_METHOD'
const UPDATE_CURRENT_ORDER_ID = 'UPDATE_CURRENT_ORDER_ID'
const UPDATE_SHIPPING_ADDRESS = 'UPDATE_SHIPPING_ADDRESS'
const UPDATE_SHIPPING_METHODS = 'UPDATE_SHIPPING_METHODS'
const LOGOUT = 'logout'

const icons = {
  creditCardIcon: require('../assets/credit-card-icon.png'),
  jcb: require('../assets/jcb.png'),
  unionpay: require('../assets/unionpay.png'),
  visaPay: require('../assets/visa.png'),
  americanExpress: require('../assets/american-express.png'),
  dinersClub: require('../assets/diners-club.png'),
  discover: require('../assets/discover.png'),
  mastercard: require('../assets/mastercard.png'),
}

const nativePaymentMethod = {
  title: Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay',
  key: Platform.OS === 'ios' ? 'apple' : 'google',
  last4: Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay',
  iconSource: icons.mastercard,
  isNativePaymentMethod: true,
}

const paypalPayment = {
  title: 'Paypal',
  key: 'paypal',
  last4: 'Paypal',
  iconSource: icons.paypal,
  isNativePaymentMethod: false,
}

const cardPayment = {
  title: 'Card',
  key: 'card',
  last4: 'card',
  iconSource: icons.creditCardIcon,
  isNativePaymentMethod: false,
}

const cashOnDelivery = {
  title: 'Cash on delivery',
  key: 'cashOnDelivery',
  last4: 'Cash on delivery',
  iconSource: icons.cashOnDelivery,
}

let upsGround = {
  id: 'upsGround',
  label: 'UPS Ground',
  detail: 'Free',
  amount: '0',
  arrivalTime: 'Arrives in 3-5 days',
}

let fedEx = {
  id: 'fedEx',
  label: 'FedEx',
  detail: 'Test @ 5.99',
  amount: '5.99',
  arrivalTime: 'Arrives tomorrow',
}

const shippingMethods = [upsGround, fedEx]

const cardIconSource = {
  Visa: icons.visaPay,
  MasterCard: icons.mastercard,
  'American Express': icons.americanExpress,
  '	Diners Club': icons.dinersClub,
  Discover: icons.discover,
  JCB: icons.jcb,
  UnionPay: icons.unionpay,
}

export const updatePaymentMethods = data => ({
  type: UPDATE_PAYMENT_METHODS,
  data,
})

export const removePaymentMethod = data => ({
  type: REMOVE_PAYMENT_METHOD,
  data,
})

export const updateCardNumbersEnding = data => ({
  type: UPDATE_CARD_NUMBERS_ENDING,
  data,
})

export const setCurrentOrderId = data => ({
  type: UPDATE_CURRENT_ORDER_ID,
  data,
})

export const setShippingAddress = data => ({
  type: UPDATE_SHIPPING_ADDRESS,
  data,
})

export const setSelectedShippingMethod = data => ({
  type: UPDATE_SELECTED_SHIPPING_METHOD,
  data,
})

export const setSelectedPaymentMethod = data => ({
  type: UPDATE_SELECTED_PAYMENT_METHOD,
  data,
})

export const setSubtotalPrice = data => ({
  type: UPDATE_SUBTOTAL_PRICE,
  data,
})

export const setTotalPrice = data => ({
  type: UPDATE_TOTAL_PRICE,
  data,
})

export const setShippingMethods = data => ({
  type: UPDATE_SHIPPING_METHODS,
  data,
})

const checkoutInitialState = {
  totalPrice: 0,
  subTotalPrice: 0,
  shippingMethods: [...shippingMethods],
  selectedShippingMethod: shippingMethods[0],
  selectedShipppingMethodIndex: 0,
  shippingAddress: [],
  cardNumbersEnding: [4242],
  paymentMethod: 'apple',
  currentOrderId: '',
  paymentMethods: [
    nativePaymentMethod,
    paypalPayment,
    cardPayment,
    cashOnDelivery,
  ],
  selectedPaymentMethod: nativePaymentMethod,
}

export const checkout = (state = checkoutInitialState, action) => {
  switch (action.type) {
    case UPDATE_SUBTOTAL_PRICE:
      return {
        ...state,
        subTotalPrice: action.data,
      }
    case UPDATE_CARD_NUMBERS_ENDING:
      return addCardNumberEnding(state, action.data)

    case UPDATE_SHIPPING_METHODS:
      return {
        ...state,
        shippingMethods: action.data,
      }

    case UPDATE_SELECTED_SHIPPING_METHOD:
      return updateSelectedShippingMethod(state, action.data)

    case UPDATE_PAYMENT_METHODS:
      return updateUserPaymentMethods(state, action.data)

    case REMOVE_PAYMENT_METHOD:
      return removeUserPaymentMethods(state, action.data)

    case UPDATE_SELECTED_PAYMENT_METHOD:
      return {
        ...state,
        selectedPaymentMethod: action.data,
      }
    case UPDATE_CURRENT_ORDER_ID:
      return {
        ...state,
        currentOrderId: action.data,
      }
    case UPDATE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.data,
      }
    case UPDATE_TOTAL_PRICE:
      return {
        ...state,
        totalPrice: (
          Number(state.subTotalPrice) +
          Number(state.selectedShippingMethod.amount)
        ).toFixed(2),
      }

    case LOGOUT:
      return checkoutInitialState

    default:
      return state
  }
}

const updateUserPaymentMethods = (state, methods) => {
  const updatedMethods = []

  if (methods) {
    methods.map(method => {
      updatedMethods.push({
        ...method.card,
        title: `${method.card.brand} Ending in ${method.card.last4}`,
        key: method.card.cardId,
        iconSource: cardIconSource[method.card.brand],
      })
    })

    return {
      ...state,
      paymentMethods: [
        nativePaymentMethod,
        paypalPayment,
        cardPayment,
        cashOnDelivery,
        ...updatedMethods,
      ],
    }
  } else {
    return state
  }
}

const removeUserPaymentMethods = (state, method) => {
  const newPaymentMethods = state.paymentMethods.filter(existingMethod => {
    return existingMethod?.cardId !== method.cardId
  })

  if (newPaymentMethods) {
    return {
      ...state,
      paymentMethods: [...newPaymentMethods],
    }
  } else {
    return state
  }
}

const addCardNumberEnding = (state, newCardNumberEnding) => {
  const doesExist = state.cardNumbersEnding.find(number => {
    return newCardNumberEnding == number
  })

  if (!doesExist) {
    return {
      ...state,
      cardNumbersEnding: [...state.cardNumbersEnding, newCardNumberEnding],
    }
  } else {
    return state
  }
}

const updateSelectedShippingMethod = (state, newMethod) => {
  const selectedShipppingMethodIndex = state.shippingMethods.findIndex(
    method => {
      return method.id === newMethod.id
    },
  )

  return {
    ...state,
    selectedShippingMethod: newMethod,
    selectedShipppingMethodIndex,
  }
}
