export const SET_VENDORS = 'SET_VENDORS'
export const SET_POPULAR_PRODUCTS = 'SET_POPULAR_PRODUCTS'

export const setVendors = data => ({
  type: SET_VENDORS,
  data,
})

export const setPopularProducts = data => ({
  type: SET_POPULAR_PRODUCTS,
  data,
})
