import { useState } from 'react'
import { subscribeToSingleChannel as subscribeToSingleChannelAPI } from './firebaseChatClient'

export const useChatSingleChannel = () => {
  const [remoteChannel, setRemoteChannel] = useState(null)

  const subscribeToSingleChannel = channelID => {
    if (channelID) {
      return subscribeToSingleChannelAPI(channelID, channel => {
        setRemoteChannel(channel)
      })
    }
    return null
  }

  return {
    remoteChannel,
    subscribeToSingleChannel,
  }
}
