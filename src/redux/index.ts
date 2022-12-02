import { combineReducers } from 'redux'
import { auth } from '../Core/onboarding/redux/auth'
import { chat } from '../Core/chat/redux'
import { userReports } from '../Core/user-reporting/redux'
import { dating } from './reducers'
// VIDEO_CALL_FLAG_ENABLED_BEGIN
import { avChat } from '../Core/avchat'
// VIDEO_CALL_FLAG_ENABLED_END
import { inAppPurchase } from '../Core/inAppPurchase/redux'
import { boostReducer as boosts } from '../Core/boost'

const AppReducer = combineReducers({
  auth,
  userReports,
  chat,
  dating,
  // VIDEO_CALL_FLAG_ENABLED_BEGIN
  avChat,
  // VIDEO_CALL_FLAG_ENABLED_END
  inAppPurchase,
  boosts,
})

export default AppReducer
