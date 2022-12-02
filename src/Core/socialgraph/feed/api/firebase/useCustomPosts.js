import { useState } from 'react'
import { useReactions } from './useReactions'

// handles a static list of posts
export const useCustomPosts = originalPosts => {
  const [posts, setPosts] = useState(originalPosts)

  const { handleFeedReaction } = useReactions(setPosts)

  const addReaction = async (post, author, reaction) => {
    await handleFeedReaction(post, reaction, author)
  }

  return {
    posts,
    addReaction,
  }
}
