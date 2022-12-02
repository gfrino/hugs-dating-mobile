import IMCartActionsConstants from './types'

export const addToCart = data => ({
  type: IMCartActionsConstants.ADD_TO_CART,
  data,
})

export const removeFromCart = data => ({
  type: IMCartActionsConstants.REMOVE_FROM_CART,
  data,
})

export const overrideCart = data => ({
  type: IMCartActionsConstants.OVERRIDE_CART,
  data,
})

export const updateCart = (cartItem, id) => ({
  type: IMCartActionsConstants.UPDATE_CART,
  cartItem,
  id,
})

export const setCartVendor = data => ({
  type: IMCartActionsConstants.SET_CART_VENDOR,
  data,
})
