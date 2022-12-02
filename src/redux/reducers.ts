import { DatingStore } from '~/types'
import IMSwipeActionsConstants from './types'

const initialState: DatingStore = {
  swipes: {},
  // matches: null,
  // incomingSwipes: null,
  // didSubscribeToSwipes: false,
}

type ReducerAction = {
  type: keyof typeof IMSwipeActionsConstants | 'LOG_OUT'
  data: any
}

export const dating = (state = initialState, action: ReducerAction) => {
  switch (action.type) {
    case IMSwipeActionsConstants.SET_SWIPES:
      return { ...state, swipes: action.data }
    case IMSwipeActionsConstants.ADD_SWIPE:
      return {
        ...state,
        swipes: {
          ...state.swipes,
          [action.data.swipedProfileID]: action.data.type,
        },
      }
    case IMSwipeActionsConstants.SET_INCOMING_SWIPES:
      return { ...state, incomingSwipes: [...action.data] }
    case IMSwipeActionsConstants.SET_MATCHES:
      return { ...state, matches: [...action.data] }
    case IMSwipeActionsConstants.DID_SUBSCRIBE_TO_SWIPES:
      return { ...state, didSubscribeToSwipes: true }
    case 'LOG_OUT':
      return initialState
    default:
      return state
  }
}
