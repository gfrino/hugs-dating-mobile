import IMCartActionsConstants from './types'
import AsyncStorage from '@react-native-community/async-storage'

const initialState = {
  orderList: [],
}

export const orders = (state = initialState, action) => {
  switch (action.type) {
    case IMCartActionsConstants.UPDATE_ORDERS:
      const orderList = [...action.data]
      storeOrders(orderList)
      // Return new redux state
      return { ...state, orderList }
    default:
      return state
  }
}

const storeOrders = orderItems => {
  // Stringify circular list to persist on disk
  var seen = []
  const stringifiedOrderItems = JSON.stringify(orderItems, function (key, val) {
    if (val != null && typeof val === 'object') {
      if (seen.indexOf(val) >= 0) {
        return
      }
      seen.push(val)
    }
    return val
  })
  // Store on disk
  AsyncStorage.setItem('@MyOrder:key', stringifiedOrderItems)
}
