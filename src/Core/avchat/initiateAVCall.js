import { AVAPIManager } from './api'
import AVChatCoordinator from './avChatCoordinator'

export const initiateAVCall = (
  channel,
  callType,
  currentUser,
  dispatch,
  localized,
) => {
  const apiManager = new AVAPIManager()
  const avChatCoordinator = new AVChatCoordinator(apiManager)
  avChatCoordinator.startCall(
    channel,
    callType,
    currentUser,
    dispatch,
    localized,
  )
}
