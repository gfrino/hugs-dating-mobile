import uuidv4 from 'uuidv4'
import AsyncStorage from '@react-native-community/async-storage'

const baseAPIURL = 'https://codebaze.herokuapp.com/api/';
// const baseAPIURL = 'http://localhost:3000/api/'

export const subscribeChannels = (userID, callback) => {
  AsyncStorage.getItem('jwt_token', (_error, token) => {
    const config = {
      headers: { Authorization: token },
    }
    fetch(
      baseAPIURL +
        'chat/channels?userID=' +
        userID +
        '&orderBy=createdAt&desc=true',
      config,
    )
      .then(response => response.json())
      .then(data => {
        callback(data.channels)
      })
      .catch(err => {
        console.log('ERROR [subscribeChannels]', err)
        alert(err)
      })
  })
  return null
}

export const subscribeToSingleChannel = async (channelID, callback) => {
  const token = await AsyncStorage.getItem('jwt_token')
  const config = {
    headers: { Authorization: token },
  }
  try {
    const response = await fetch(
      baseAPIURL + 'chat/channel/' + channelID,
      config,
    )
    const data = await response.json()
    callback(data?.channel)
  } catch (err) {
    console.log('ERROR [subscribeChannels]', err)
    alert(err)
  }
  return null
}

export const listChannels = async (userID, page = 0, size = 1000) => {
  try {
    const token = await AsyncStorage.getItem('jwt_token')
    const res = await fetch(
      baseAPIURL +
        'chat/channels?userID=' +
        userID +
        '&orderBy=createdAt&desc=true',
      {
        method: 'get',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, page, size }),
      },
    )
    const data = await res.json()
    return data.channels
  } catch (error) {
    console.log('ERROR [listChannels]', error)
    return { success: false, error: error }
  }
}

export const subscribeToMessages = (channelID, callback) => {
  AsyncStorage.getItem('jwt_token', (_error, token) => {
    const config = {
      headers: { Authorization: token },
    }
    fetch(
      baseAPIURL +
        'chat/channel/' +
        channelID +
        '/thread/?orderBy=createdAt&desc=true',
      config,
    )
      .then(response => response.json())
      .then(data => {
        callback(data.messages)
      })
      .catch(err => {
        console.log('ERROR [subscribeToMessages]', err)
        alert(err)
      })
  })
  return null
}

export const sendMessage = async (
  sender,
  channel,
  message,
  downloadURL,
  inReplyToItem,
  participantProfilePictureURLs,
) => {
  const { profilePictureURL } = sender
  const userID = sender.id || sender.userID
  const data = {
    content: message,
    createdAt: Math.round(new Date().getTime() / 1000),
    recipientFirstName: '',
    recipientID: '',
    recipientLastName: '',
    recipientProfilePictureURL: '',
    senderFirstName: sender.firstName || sender.fullname,
    senderID: userID,
    senderLastName: '',
    senderProfilePictureURL: profilePictureURL,
    url: downloadURL,
    inReplyToItem: inReplyToItem,
    readUserIDs: [userID],
    participantProfilePictureURLs,
  }
  const channelID = channel.id

  try {
    const token = await AsyncStorage.getItem('jwt_token')
    const res = await fetch(baseAPIURL + 'chat/message/add', {
      method: 'post',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: data, channelID: channelID }),
    })
    return { success: true }
  } catch (error) {
    console.log('ERROR [sendMessage]', error)
    return { success: false, error: error }
  }
}

export const deleteMessage = async (channel, messageID) => {
  if (!channel?.id || !messageID) {
    return
  }

  try {
    const token = AsyncStorage.getItem('jwt_token')
    const res = await fetch(baseAPIURL + 'chat/message/delete', {
      method: 'delete',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageID: messageID,
        channelID: channel?.id,
      }),
    })
  } catch (error) {
    console.log('ERROR [deleteMessage]', error)
    alert(error)
  }
}

export const updateTypingUsers = async (channelID, typingUsers) => {
  try {
    const token = await AsyncStorage.getItem('jwt_token')
    const res = await fetch(baseAPIURL + 'chat/channel/typing', {
      method: 'post',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelID: channelID,
        typingUsers: typingUsers,
      }),
    })
  } catch (error) {
    console.log('ERROR [updateTypingUsers]', error)
    alert(error)
  }
}

export const markChannelMessageAsRead = async (
  channelID,
  userID,
  messageID,
  readUserIDs,
  participants,
) => {
  try {
    const token = await AsyncStorage.getItem('jwt_token')
    const res = await fetch(baseAPIURL + 'chat/channel/markasread', {
      method: 'post',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelID: channelID,
        userID: userID,
        messageID: messageID,
        readUserIDs: readUserIDs,
      }),
    })
  } catch (error) {
    console.log('ERROR [markChannelMessageAsRead]', error)
    alert(error)
  }
}

export const createChannel = async (creator, otherParticipants, name) => {
  var channelID = uuidv4()
  const id1 = creator.id || creator.userID
  if (otherParticipants.length == 1) {
    const id2 = otherParticipants[0].id || otherParticipants[0].userID
    if (id1 == id2) {
      // We should never create a self chat
      resolve({ success: false })
      return
    }
    channelID = id1 < id2 ? id1 + id2 : id2 + id1
  }
  const channelData = {
    creatorID: id1,
    id: channelID,
    channelID,
    name: name || '',
    participants: [...otherParticipants, creator],
  }

  try {
    const token = await AsyncStorage.getItem('jwt_token')
    const res = await fetch(baseAPIURL + 'chat/channel/add', {
      method: 'post',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelData: channelData, userData: creator }),
    })
    return { success: true, channel: channelData }
  } catch (error) {
    console.log('ERROR [createChannel]', error)
    return { success: false, error: error }
  }
}

export const leaveGroup = async (channelID, userID) => {
  try {
    const token = await AsyncStorage.getItem('jwt_token')
    const res = await fetch(baseAPIURL + 'chat/group/leave', {
      method: 'post',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelID: channelID, userID: userID }),
    })
    return { success: true }
  } catch (error) {
    console.log('ERROR [leaveGroup]', error)
    return {
      success: false,
      error: error,
    }
  }
}

export const updateGroup = async (channelID, userID, newData) => {
  try {
    const token = await AsyncStorage.getItem('jwt_token')
    const res = await fetch(baseAPIURL + 'chat/group/update', {
      method: 'post',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelID: channelID,
        updatedData: newData,
        userID: userID,
      }),
    })
    return { success: true, newChannel: newData }
  } catch (error) {
    console.log('ERROR [updateGroup]', error)
    return {
      success: false,
      error: 'An error occurred while renaming the group. Please try again.',
    }
  }
}
