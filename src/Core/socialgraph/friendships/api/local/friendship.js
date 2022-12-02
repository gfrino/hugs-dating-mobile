/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

// initialize usersRef
const usersRef = null

// initialize socialGraphRef
const socialGraphRef = null

const onCollectionUpdate = (querySnapshot, callback) => {}

/**
 * Subscribe to inbound friendships
 *
 * @param {id of current user} userId
 * @param {a function gets called anything there} callback
 */
export const subscribeToInboundFriendships = (userId, callback) => {
  // initialise ref
  const ref = null
  // listen for changes on the inbound server and call callback(data, usersRef )
  // an array of inboundUser object is the result fetched from server and used
  // inboundusers object format:
  // {
  //   appIdentifier: 'rn-social-network-android',
  //   badgeCount: 0,
  //   createdAt: 'September 28, 2020 at 5:06:17 AM UTC+1',
  //   email: 'b@b.com',
  //   firstName: 'John',
  //   id: '1313e2vv2v',
  //   isOnline: true,
  //   lastName: 'Doe',
  //   lastOnlineTimestamp: 'September 28, 2020 at 5:06:31 AM UTC+1',
  // };
  // return ref object that will be used o unsubscribe from this listener

  const data = []
  callback(data, usersRef)

  return ref
}
/**
 * Subscribe to inbound friendships
 *
 * @param {id of current user} userId
 * @param {a function gets called anything there} callback
 */
export const subscribeToOutboundFriendships = (userId, callback) => {
  // initialise ref
  const ref = null
  // listen for changes on the inbound server and call callback(data, usersRef )
  // an array of outboundUser object is the result fetched from server and used
  // outboundusers object format:
  // {
  //   appIdentifier: 'rn-social-network-android',
  //   badgeCount: 0,
  //   createdAt: 'September 28, 2020 at 5:06:17 AM UTC+1',
  //   email: 'b@b.com',
  //   firstName: 'John',
  //   id: '1313e2vv2v',
  //   isOnline: true,
  //   lastName: 'Doe',
  //   lastOnlineTimestamp: 'September 28, 2020 at 5:06:31 AM UTC+1',
  // };
  // return ref object that will be used o unsubscribe from this listener

  const data = []
  callback(data, usersRef)

  return ref
}

/** Adds a friend request to toUser from fromUser
 * 
 * @param {an object: object of the user that user} fromUser 
 * 
    {
      email,
      id,
      ....
    }
 * 
 * @param {an object: object of the user that user being added} toUser
 *  {
      email,
      id,
      ....
    }
 * @param {a boolean whether to persist friendship count on server} persistFriendshipsCounts 
 * @param {a boolean whether to use friends or followers} extendFollowers 
 * @param {a boolean whether to update feed after unfriend} enableFeedUpdates 
 * @param {a function a callback that get called after the unfriend is done} callback 
 */
export const addFriendRequest = async (
  fromUser,
  toUser,
  persistFriendshipsCounts,
  extendFollowers,
  enableFeedUpdates,
  callback,
) => {
  // if fromUser is the same as toUser then call callback(null) and return
  //intialize toUserRef and fromUserRef
  // update outbounduser and inbounduser
  // call callback({ success: true }) or callback({ error: error }); if there's an error
}

/**
 * Cancels a friend request between toUser and fromUser
 *
 * @param {a string: id of the current user} currentUserID
 * @param {a string: the id of the user whose friend request is being cancelled } toUserID
 * @param {a boolean: whether to persist friendship count on server} persistFriendshipsCounts
 * @param {a boolean: whether to update feed after unfriend} enableFeedUpdates
 * @param {a function: a callback that get called after the unfriend is done} callback
 */
export const cancelFriendRequest = async (
  currentUserID,
  toUserID,
  persistFriendshipsCounts,
  enableFeedUpdates,
  callback,
) => {
  // if fromUser is the same as toUser then call callback(null) and return

  // initialize ref

  //you have to delete inbound friendships

  //you have to delete outbound friendships

  // if persistFriendshipsCounts is true then update friendship count for both from user and toUser

  // if enableFeedUpdates is true then update old and new friends feed

  // call callback({ success: true }); or callback({ success: false }); if there is an error
  callback({ success: true })
}

/**
 * Unfriends user with id toUserID
 *
 * @param {a string: id of the current user} currentUserID
 * @param {a string: the id of the user being unfriended } toUserID
 * @param {a boolean: whether to persist friendship count on server} persistFriendshipsCounts
 * @param {a boolean: whether to update feed after unfriend} enableFeedUpdates
 * @param {a function: a callback that get called after the unfriend is done} callback
 */
export const unfriend = async (
  currentUserID,
  toUserID,
  persistFriendshipsCounts,
  enableFeedUpdates,
  callback,
) => {
  // if fromUser is the same as toUser then call callback(null) and return
  //unfriend user and callback(response) response format: { success: true }
}

/**
 *
 * Update friendship count for userID1 and user ID2
 *
 * @param {a String: user id of the first user } userID1
 * @param {a String: user id of the second user } userID2
 */
export const updateFeedsForNewFriends = (userID1, userID2) => {
  // hydrate stories and posts for users with userID1 and userID2
}

/**
 *
 * @param {a String: user Id of the current user} userID
 */
const updateFriendshipsCounts = async userID => {
  //update inbound users
  //update outbound users
}
