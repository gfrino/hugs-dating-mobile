import { useRef, useState } from 'react'
import {
  subscribeChannels as subscribeChannelsAPI,
  listChannels as listChannelsAPI,
  createChannel as createChannelAPI,
  markChannelMessageAsRead as markChannelMessageAsReadAPI,
  updateGroup as updateGroupAPI,
  leaveGroup as leaveGroupAPI,
  updateTypingUsers as updateTypingUsersAPI,
} from './apiClient'

export const useChatChannels = () => {
  const [channels, setChannels] = useState(null)
  const pagination = useRef({ page: 0, size: 25, exhausted: false })

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
    setChannels(deduplicatedChannels(newChannels, true))
  }

  const subscribeToChannels = userID => {
    return subscribeChannelsAPI(userID, newChannels => {
      setChannels(deduplicatedChannels(newChannels, false))
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

  const deduplicatedChannels = (newChannels, appendToBottom) => {
    const all = channels
      ? appendToBottom
        ? [...channels, ...newChannels]
        : [...newChannels, ...channels]
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
    subscribeToChannels,
    loadMoreChannels,
    markChannelMessageAsRead,
    updateTypingUsers,
    createChannel,
    updateGroup,
    leaveGroup,
  }
}
