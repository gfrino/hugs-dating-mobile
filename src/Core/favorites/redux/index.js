const SET_FAVORITE_ITEMS = 'SET_FAVORITE_ITEMS'

export const setFavoriteItems = data => ({
  type: SET_FAVORITE_ITEMS,
  data,
})

const initialState = {
  favoriteItems: null,
}

export const favorites = (state = initialState, action) => {
  if (action.type === SET_FAVORITE_ITEMS) {
    return { ...state, favoriteItems: action.data }
  } else {
    return state
  }
}
