export const hydratePostsWithMyReactions = (posts, userID) => {
  return posts.map(post => {
    const myReaction = getMyReaction(post.reactions, userID)
    return myReaction ? { ...post, myReaction } : post
  })
}

export const hydrateSinglePostWithMyReaction = (post, userID) => {
  const myReaction = getMyReaction(post.reactions, userID)
  return myReaction ? { ...post, myReaction } : post
}

const getMyReaction = (reactionsDict, userID) => {
  const reactionKeys = [
    'like',
    'love',
    'laugh',
    'angry',
    'suprised',
    'cry',
    'sad',
  ]
  var result = null
  reactionKeys.forEach(reactionKey => {
    if (
      reactionsDict[reactionKey] &&
      reactionsDict[reactionKey].includes(userID)
    ) {
      result = reactionKey
    }
  })

  return result
}
