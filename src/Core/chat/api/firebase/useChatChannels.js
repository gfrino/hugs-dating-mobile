import { useRef, useState } from 'react'
import {
  subscribeChannels as subscribeChannelsAPI,
  listChannels as listChannelsAPI,
  createChannel as createChannelAPI,
  markChannelMessageAsRead as markChannelMessageAsReadAPI,
  updateGroup as updateGroupAPI,
  leaveGroup as leaveGroupAPI,
  updateTypingUsers as updateTypingUsersAPI,
} from './firebaseChatClient'

// config: { maxChannels, isPremium }

export const useChatChannels = config => {
  const [channels, setChannels] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const pagination = useRef({ page: 0, size: 25, exhausted: false })
  const realtimeChannelsRef = useRef(null)

  const loadMoreChannels = async userID => {
    if (pagination.current.exhausted) {
      return
    }
    const newChannels = await listChannelsAPI(
      userID,
      pagination.current.page,
      pagination.current.size,
    )
    if (newChannels?.length === 0) {
      pagination.current.exhausted = true
    }
    pagination.current.page += 1
    setChannels(oldChannels =>
      deduplicatedChannels(oldChannels, newChannels, true),
    )
  }

  const subscribeToChannels = userID => {
    return subscribeChannelsAPI(userID, newChannels => {
      realtimeChannelsRef.current = newChannels
      setChannels(oldChannels => {
        if (config.isPremium) {
          return deduplicatedChannels(oldChannels, newChannels, false)
        } else {
          return deduplicatedChannels(oldChannels, newChannels, false).slice(
            0,
            config.maxChannels,
          )
        }
      })
    })
  }

  const pullToRefresh = async userID => {
    setRefreshing(true)
    pagination.current.page = 0
    pagination.current.exhausted = false

    const newChannels = await listChannelsAPI(
      userID,
      pagination.current.page,
      pagination.current.size,
    )
    if (newChannels?.length === 0) {
      pagination.current.exhausted = true
    }
    pagination.current.page += 1
    setRefreshing(false)
    setChannels(() => {
      if (config.isPremium) {
        return deduplicatedChannels(
          realtimeChannelsRef.current,
          newChannels,
          true,
        )
      } else {
        return deduplicatedChannels(
          realtimeChannelsRef.current,
          newChannels,
          true,
        ).slice(0, config.maxChannels)
      }
    })
  }

  const createChannel = async (creator, otherParticipants, name) => {
    return await createChannelAPI(creator, otherParticipants, name)
  }

  const updateTypingUsers = async (channelID, typingUsers) => {
    return await updateTypingUsersAPI(channelID, typingUsers)
  }

  const markChannelMessageAsRead = async (
    channelID,
    userID,
    threadMessageID,
    readUserIDs,
    participants,
  ) => {
    return await markChannelMessageAsReadAPI(
      channelID,
      userID,
      threadMessageID,
      readUserIDs,
      participants,
    )
  }

  const updateGroup = async (channelID, userID, data) => {
    return await updateGroupAPI(channelID, userID, data)
  }

  const leaveGroup = async (channelID, userID) => {
    return await leaveGroupAPI(channelID, userID)
  }

  const deduplicatedChannels = (oldChannels, newChannels, appendToBottom) => {
    const all = oldChannels
      ? appendToBottom
        ? [...oldChannels, ...newChannels]
        : [...newChannels, ...oldChannels]
      : newChannels
    const deduplicatedChannels = all.reduce((acc, curr) => {
      if (!acc.some(friend => friend.id === curr.id)) {
        acc.push(curr)
      }
      return acc
    }, [])
    return deduplicatedChannels
  }

  return {
    channels,
    refreshing,
    subscribeToChannels,
    loadMoreChannels,
    pullToRefresh,
    markChannelMessageAsRead,
    updateTypingUsers,
    createChannel,
    updateGroup,
    leaveGroup,
  }
}
