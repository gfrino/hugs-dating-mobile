import { getUnixTimeStamp } from '../../../helpers/timeFormat'

export const subscribeChannels = (userID, callback) => {
  // callbacks a stream listening to all chat rooms the userID is participant in
}

export const subscribeToSingleChannel = (channelID, callback) => {
  // a listener to any changes in channelID metadata
}

export const listChannels = async (userID, page = 0, size = 1000) => {
  // returns the list of channels based on page and size (used for pagination)
}

export const createChannel = async (creator, otherParticipants, name) => {
  // creates a new channel
}

export const markChannelMessageAsRead = async (
  channelID,
  userID,
  messageID,
  readUserIDs,
  participants,
) => {
  // Given a channel, a message and an user, it marks the message in the channel as *read* for the current user (used for seen status indicator and reader user facepile)
}

export const updateTypingUsers = async (channelID, typingUsers) => {
  // updates the typing users for a given channel (used for the typing indicator)
}

export const sendMessage = async (
  sender,
  channel,
  message,
  downloadURL,
  inReplyToItem,
  participantProfilePictureURLs,
) => {
  // sender user object sends a message to a channel
}

export const deleteMessage = async (channel, messageID) => {
  // deletes a message in a channel
}

export const subscribeToMessages = (channelID, callback) => {
  // a listener to any changes in messages for a channel (used in the chat screen)
}

export const listMessages = async (channelID, page = 0, size = 1000) => {
  // returns the list of messages in the channel, based on page and size (used for pagination)
}

export const leaveGroup = async (channelID, userID) => {
  // user leaves the group
}

export const updateGroup = async (channelID, userID, newData) => {
  // updates the group metadata (used for renaming the group)
}

export const currentTimestamp = () => {
  // used for getting the current unix timestamp of the device
  return getUnixTimeStamp()
}
