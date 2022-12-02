import { SET_VENDORS, SET_POPULAR_PRODUCTS } from './actions'

const initialState = {
  vendors: [],
}

export const vendor = (state = initialState, action) => {
  switch (action.type) {
    case SET_VENDORS:
      return {
        ...state,
        vendors: action.data,
      }
    case SET_POPULAR_PRODUCTS:
      return {
        ...state,
        popularProducts: action.data,
      }
    default:
      return state
  }
}
