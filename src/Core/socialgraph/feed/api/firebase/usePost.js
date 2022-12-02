import { useState } from 'react'
import { subscribeToSinglePost } from './firebaseFeedClient'
import { hydrateSinglePostWithMyReaction } from './utils'
import { useReactions } from './useReactions'

export const usePost = () => {
  const [remotePost, setRemotePost] = useState(null)

  const { handleSinglePostReaction } = useReactions(setRemotePost)

  const subscribeToPost = (postID, userID) => {
    return subscribeToSinglePost(postID, post => {
      setRemotePost(hydrateSinglePostWithMyReaction(post, userID))
    })
  }

  const addReaction = async (post, author, reaction) => {
    await handleSinglePostReaction(post, reaction, author)
  }

  return {
    remotePost,
    subscribeToPost,
    addReaction,
  }
}
