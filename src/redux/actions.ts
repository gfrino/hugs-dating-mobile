import { IUserSwipe, SwipeType } from '~/api/firebase/types'
import IMSwipeActionsConstants from './types'

export const setSwipes = (data: { [key: string]: SwipeType }) => ({
  type: IMSwipeActionsConstants.SET_SWIPES,
  data,
})
export const addSwipe = (
  data: Pick<IUserSwipe, 'swipedProfileID' | 'type'>,
) => ({
  type: IMSwipeActionsConstants.ADD_SWIPE,
  data,
})

// export const setMatches = data => ({
//   type: IMSwipeActionsConstants.SET_MATCHES,
//   data,
// })

// export const setIncomingSwipes = data => ({
//   type: IMSwipeActionsConstants.SET_INCOMING_SWIPES,
//   data,
// })

// export const setSwipesListenerDidSubscribe = () => ({
//   type: IMSwipeActionsConstants.DID_SUBSCRIBE_TO_SWIPES,
// })
