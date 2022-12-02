import {
  add,
  unfollow as unfollowAPI,
  unfriend as unfriendAPI,
} from '../firebaseSocialGraphClient'

export const useSocialGraphMutations = (
  setFriendships = null,
  withRemoval = true,
  optimisticUpdatesEnabled = false,
) => {
  const addEdge = async (fromUser, toUser) => {
    if (fromUser.id == toUser.id) {
      return null
    }

    // We update the UI optimistically, so the app feels fast
    if (optimisticUpdatesEnabled && setFriendships) {
      setFriendships(oldFriendships =>
        oldFriendships?.map(friendship => {
          if (friendship.user.id === toUser.id) {
            const { type } = friendship
            return {
              ...friendship,
              type: type === 'inbound' ? 'reciprocal' : 'outbound',
            }
          }
          return friendship
        }),
      )
    }

    const res = await add(fromUser.id, toUser.id)
    return res
  }

  const unfriend = async (fromUser, toUser) => {
    if (fromUser.id === toUser.id) {
      return null
    }

    // We update the UI optimistically, so the app feels fast
    if (withRemoval) {
      removeUserFromUIState(toUser.id)
    } else if (optimisticUpdatesEnabled && setFriendships) {
      setFriendships(oldFriendships =>
        oldFriendships?.map(friendship => {
          if (friendship.user.id === toUser.id) {
            const { type } = friendship
            return {
              ...friendship,
              type: type === 'reciprocal' ? 'inbound' : 'none',
            }
          }
          return friendship
        }),
      )
    }

    const res = await unfriendAPI(fromUser.id, toUser.id)
    return res
  }

  const unfollow = async (fromUser, toUser) => {
    if (fromUser.id === toUser.id) {
      return null
    }
    // We update the UI optimistically, so the app feels fast
    if (withRemoval) {
      removeUserFromUIState(toUser.id)
    } else if (optimisticUpdatesEnabled && setFriendships) {
      setFriendships(oldFriendships =>
        oldFriendships?.map(friendship => {
          if (friendship.user.id === toUser.id) {
            const { type } = friendship
            return {
              ...friendship,
              type: type === 'reciprocal' ? 'inbound' : 'none',
            }
          }
          return friendship
        }),
      )
    }
    const res = await unfollowAPI(fromUser.id, toUser.id)
    return res
  }

  const removeUserFromUIState = userID => {
    // Optimistic updates - we update the UI immediately, before getting the API response, to make the UI feel fast
    setFriendships &&
      setFriendships(friendships =>
        friendships.filter(f => f?.user?.id !== userID),
      )
  }

  return {
    addEdge,
    unfriend,
    unfollow,
  }
}
