const FriendshipType = {
  none: 'none',
  inbound: 'inbound',
  outbound: 'outbound',
  reciprocal: 'reciprocal',
}

const localizedActionTitle = friendshipType => {
  switch (friendshipType) {
    case FriendshipType.none:
      return 'Add'
    case FriendshipType.inbound:
      return 'Accept'
    case FriendshipType.outbound:
      return 'Cancel'
    case FriendshipType.reciprocal:
      return 'Unfriend'
  }
  return null
}

const localizedFollowActionTitle = friendshipType => {
  switch (friendshipType) {
    case FriendshipType.none:
      return 'Follow'
    case FriendshipType.inbound:
      return 'Follow back'
    case FriendshipType.outbound:
      return 'Unfollow'
    case FriendshipType.reciprocal:
      return 'Unfollow'
  }
  return null
}

export const FriendshipConstants = {
  localizedActionTitle,
  localizedFollowActionTitle,
  FriendshipType,
}
