import AsyncStorage from '@react-native-community/async-storage'

// const baseAPIURL = 'https://codebaze.herokuapp.com/api/';
const baseAPIURL = 'http://localhost:3000/api/'

export const subscribeToInboundFriendships = (userId, callback) => {
  AsyncStorage.getItem('jwt_token', (_error, token) => {
    const config = {
      headers: { Authorization: token },
    }
    fetch(baseAPIURL + 'socialgraph/list?type=inbound&userId=' + userId, config)
      .then(response => response.json())
      .then(data => {
        callback(data.users)
      })
      .catch(err => {
        console.log(err)
        alert(err)
      })
  })
  return null
}

export const subscribeToOutboundFriendships = (userId, callback) => {
  AsyncStorage.getItem('jwt_token', (_error, token) => {
    const config = {
      headers: { Authorization: token },
    }
    fetch(
      baseAPIURL + 'socialgraph/list?type=outbound&userId=' + userId,
      config,
    )
      .then(response => response.json())
      .then(data => {
        callback(data.users)
      })
      .catch(err => {
        console.log(err)
        alert(err)
      })
  })
  return null
}

export const addFriendRequest = async (
  fromUser,
  toUser,
  persistFriendshipsCounts,
  extendFollowers,
  enableFeedUpdates,
  callback,
) => {
  const fromUserID = fromUser.id
  const toUserID = toUser.id
  if (fromUserID == toUserID) {
    callback(null)
    return
  }
  try {
    AsyncStorage.getItem('jwt_token', async (_error, token) => {
      const res = await fetch(baseAPIURL + 'socialgraph/add', {
        method: 'post',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUser,
          toUser,
          persistFriendshipsCounts,
          extendFollowers,
          enableFeedUpdates,
        }),
      })
      callback(res)
    })
  } catch (error) {
    callback({ error: error })
  }
}

export const cancelFriendRequest = async (
  currentUserID,
  toUserID,
  persistFriendshipsCounts,
  enableFeedUpdates,
  callback,
) => {
  if (currentUserID == toUserID) {
    callback(null)
    return
  }

  try {
    AsyncStorage.getItem('jwt_token', async (_error, token) => {
      const res = await fetch(baseAPIURL + 'socialgraph/cancel', {
        method: 'delete',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserID: currentUserID,
          toUserID,
          persistFriendshipsCounts,
          enableFeedUpdates,
        }),
      })
      callback(res)
    })
  } catch (error) {
    callback({ error: error })
  }
}

export const unfriend = async (
  currentUserID,
  toUserID,
  persistFriendshipsCounts,
  enableFeedUpdates,
  callback,
) => {
  if (currentUserID == toUserID) {
    callback(null)
    return
  }
  if (enableFeedUpdates) {
    // This is in fact an unfollow, for a mutual follow relationship
    cancelFriendRequest(
      currentUserID,
      toUserID,
      persistFriendshipsCounts,
      enableFeedUpdates,
      response => {
        callback(response)
      },
    )
  } else {
    cancelFriendRequest(
      currentUserID,
      toUserID,
      persistFriendshipsCounts,
      enableFeedUpdates,
      _response => {
        cancelFriendRequest(
          toUserID,
          currentUserID,
          persistFriendshipsCounts,
          enableFeedUpdates,
          response => {
            callback(response)
          },
        )
      },
    )
  }
}

export const updateFeedsForNewFriends = (userID1, userID2) => {
  // This is entirely managed by server side, if using Instamobile NodeJS Custom Backend.
}
