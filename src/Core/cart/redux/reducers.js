import IMCartActionsConstants from './types'
import AsyncStorage from '@react-native-community/async-storage'

const initialState = {
  cartItems: [],
  vendor: null,
}

export const cart = (state = initialState, action) => {
  switch (action.type) {
    case IMCartActionsConstants.ADD_TO_CART: {
      const cartItems = [...state.cartItems, action.data]
      storeCartToDisk(cartItems, state.vendor)
      // Return new redux state
      return { ...state, cartItems }
    }

    case IMCartActionsConstants.SET_CART_VENDOR: {
      storeCartToDisk(state.cartItems, action.data)
      return { ...state, vendor: action.data }
    }

    case IMCartActionsConstants.REMOVE_FROM_CART: {
      const itemToBeRemoved = action.data
      const cartItems = state.cartItems.filter(
        cartItem => itemToBeRemoved.id != cartItem.id,
      )
      storeCartToDisk(cartItems, state.vendor)
      return { ...state, cartItems }
    }

    case IMCartActionsConstants.OVERRIDE_CART:
      const cartItems = [...action.data]
      storeCartToDisk(cartItems, state.vendor)
      return { ...state, cartItems }

    case IMCartActionsConstants.UPDATE_CART:
      const tempCartItems = state.cartItems
      tempCartItems[action.id] = action.cartItem
      storeCartToDisk(tempCartItems, state.vendor)
      return { ...state, tempCartItems }
    /* for (var i in state.cartItems) {
        if (state.cartItems[i].id == data.id) {
           state[i].desc = desc;
           break; //Stop this loop, we found it!
        }
      } */
    case 'LOG_OUT':
      return initialState
    default:
      return state
  }
}

export const storeCartToDisk = async (cartItems, vendor) => {
  // Stringify circular list to persist on disk
  var seen = []
  const cart = { cartItems, vendor }
  const serializedCart = JSON.stringify(cart, function (key, val) {
    if (val != null && typeof val === 'object') {
      if (seen.indexOf(val) >= 0) {
        return
      }
      seen.push(val)
    }
    return val // eslint-disable-line
  })
  // Store on disk
  AsyncStorage.setItem('@MySuperCart:key', serializedCart)
}

const removeFromCart = (item, state) => {
  const cartArray = [...state]

  const foundIndex = cartArray.findIndex(currCartItem => {
    return currCartItem.id === item.id
  })

  if (foundIndex >= 0) {
    cartArray.splice(foundIndex, 1)
  }
  AsyncStorage.setItem('@MySuperCart:key', JSON.stringify(cartArray))

  return cartArray
}
