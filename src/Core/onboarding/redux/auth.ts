import { BoostUserDoc } from '../../boost/types'
import { IUser } from '../hooks/useCurrentUser'

const UPDATE_USER = 'UPDATE_USER'
const LOG_OUT = 'LOG_OUT'
const UPDATE_USER_BOOST = 'UPDATE_USER_BOOST'

export const DUMMY_USER_DATA = {} as IUser

export const setUserData = (data: { user: IUser }) => ({
  type: UPDATE_USER,
  data,
})

export const updateUserBoostData = (data: Partial<BoostUserDoc>) => ({
  type: UPDATE_USER_BOOST,
  data,
})

export const logout = () => ({
  type: LOG_OUT,
})

const initialState = {
  user: DUMMY_USER_DATA,
}

type AuthActionTypes =
  | {
      type: typeof UPDATE_USER
      data: { user: IUser }
    }
  | {
      type: typeof LOG_OUT
    }
  | {
      type: typeof UPDATE_USER_BOOST
      data: Partial<BoostUserDoc>
    }

export const auth = (state = initialState, action: AuthActionTypes) => {
  switch (action.type) {
    case UPDATE_USER: {
      console.log("update user............. from redux state" , state );
      console.log("update user............. from redux" , action.data.user );
      
      return {
        ...state,
        user: action.data.user,
      }
    }
    case UPDATE_USER_BOOST: {
      const newBoostData = action.data
      return {
        ...state,
        user: {
          ...state.user,
          boost: {
            ...state.user.boost,
            ...newBoostData,
          },
        },
      }
    }
    case LOG_OUT: {
      return initialState
    }
    default:
      return state
  }
}
