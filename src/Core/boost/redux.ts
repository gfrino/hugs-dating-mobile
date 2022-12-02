import { IBoost, IBoostStore } from './types'

const BOOST_SET_MONTHLY_HISTORY = 'BOOST_SET_MONTHLY_HISTORY'
const BOOST_ADD_MONTHLY_HISTORY = 'BOOST_ADD_MONTHLY_HISTORY'

const initialState: IBoostStore = {
  boostHistory: [],
}

type BoostActionType =
  | {
      type: typeof BOOST_SET_MONTHLY_HISTORY
      payload: IBoost[]
    }
  | {
      type: typeof BOOST_ADD_MONTHLY_HISTORY
      payload: IBoost
    }

const boostReducer = (state = initialState, action: BoostActionType) => {
  switch (action.type) {
    case BOOST_SET_MONTHLY_HISTORY:
      return {
        ...state,
        boostHistory: action.payload,
      }
    case BOOST_ADD_MONTHLY_HISTORY: {
      const newBoostHistory = [...state.boostHistory, action.payload]
      return {
        ...state,
        boostHistory: newBoostHistory,
      }
    }
    default:
      return state
  }
}

export const BoostStoreCreators = {
  setMonthlyHistory: (monthlyHistory: IBoost[]) => ({
    type: BOOST_SET_MONTHLY_HISTORY,
    payload: monthlyHistory,
  }),
  addMonthlyHistory: (boost: IBoost) => ({
    type: BOOST_ADD_MONTHLY_HISTORY,
    payload: boost,
  }),
}

export default boostReducer
