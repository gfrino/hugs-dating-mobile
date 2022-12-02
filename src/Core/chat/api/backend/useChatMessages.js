import { useRef, useState } from 'react'
import {
  sendMessage as sendMessageAPI,
  deleteMessage as deleteMessageAPI,
  subscribeToMessages as subscribeMessagesAPI,
  listMessages as listMessagesAPI,
} from './backendClient'

export const useChatMessages = () => {
  const [messages, setMessages] = useState(null)

  const pagination = useRef({ page: 0, size: 25, exhausted: false })

  const loadMoreMessages = async channelID => {
    if (pagination.current.exhausted) {
      return
    }
    const newMessages = await listMessagesAPI(
      channelID,
      pagination.current.page,
      pagination.current.size,
    )
    if (newMessages?.length === 0) {
      pagination.current.exhausted = true
    }
    pagination.current.page += 1
    setMessages(deduplicatedMessages(messages, newMessages, true))
  }

  const subscribeToMessages = channelID => {
    return subscribeMessagesAPI(channelID, newMessages => {
      setMessages(prevMessages =>
        deduplicatedMessages(prevMessages, newMessages, false),
      )
    })
  }

  const sendMessage = async (
    sender,
    channel,
    message,
    downloadURL,
    inReplyToItem,
    participantProfilePictureURLs,
  ) => {
    return sendMessageAPI(
      sender,
      channel,
      message,
      downloadURL,
      inReplyToItem,
      participantProfilePictureURLs,
    )
  }

  const deleteMessage = async (channel, threadItemID) => {
    return deleteMessageAPI(channel, threadItemID)
  }

  const deduplicatedMessages = (messages, newMessages, appendToBottom) => {
    // We merge, dedup and sort the two message lists
    const all = messages
      ? appendToBottom
        ? [...messages, ...newMessages]
        : [...newMessages, ...messages]
      : newMessages
    const deduplicatedMessages = all?.reduce((acc, curr) => {
      if (!acc.some(friend => friend.id === curr.id)) {
        acc.push(curr)
      }
      return acc
    }, [])
    return deduplicatedMessages.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
  }

  return {
    messages,
    subscribeToMessages,
    loadMoreMessages,
    sendMessage,
    deleteMessage,
  }
}
