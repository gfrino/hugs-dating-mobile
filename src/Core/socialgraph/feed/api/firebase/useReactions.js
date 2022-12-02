import { useRef } from 'react'
import { addReaction as addReactionAPI } from './firebaseFeedClient'

export const useReactions = setPosts => {
  const inFlightReactionRequest = useRef(false)

  const handleFeedReaction = async (post, reactionType, author) => {
    if (inFlightReactionRequest.current === true) {
      // we already have a reaction request in flight so we don't trigger another one
      return
    }
    inFlightReactionRequest.current = true

    // We first update the UI optimistically, so the app feels fast - compute the new reaction
    if (
      post.myReaction &&
      (post.myReaction === reactionType || reactionType === null)
    ) {
      // we had the same reaction before, so this removes the reaction (e.g. unlike, unlove, etc)
      setPosts(oldPosts => {
        return oldPosts?.map(oldPost => {
          if (oldPost.id === post.id) {
            return {
              ...oldPost,
              myReaction: null,
              reactionsCount: oldPost.reactionsCount - 1,
            }
          }
          return oldPost
        })
      })
    } else {
      // we didn't have a reaction before, so this is adding a reaction
      // OR
      // we had a different reaction before, so this is changing the reaction
      const reactionsCount = post.myReaction
        ? post.reactionsCount
        : post.reactionsCount + 1
      setPosts(oldPosts => {
        return oldPosts?.map(oldPost => {
          if (oldPost.id === post.id) {
            return { ...oldPost, myReaction: reactionType, reactionsCount }
          }
          return oldPost
        })
      })
    }

    // Then we send the reaction to the server
    const res = await addReactionAPI(
      post.id,
      author.id,
      reactionType ? reactionType : post.myReaction,
    )
    // TOOO: handle error case

    inFlightReactionRequest.current = false
    return res
  }

  const handleSinglePostReaction = async (post, reactionType, author) => {
    if (inFlightReactionRequest.current === true) {
      // we already have a reaction request in flight so we don't trigger another one
      return
    }
    inFlightReactionRequest.current = true

    // We first update the UI optimistically, so the app feels fast - compute the new reaction
    if (
      post.myReaction &&
      (post.myReaction === reactionType || reactionType === null)
    ) {
      // we had the same reaction before, so this removes the reaction (e.g. unlike, unlove, etc)
      setPosts(oldPost => ({
        ...oldPost,
        myReaction: null,
        reactionsCount: oldPost.reactionsCount - 1,
      }))
    } else {
      // we didn't have a reaction before, so this is adding a reaction
      // OR
      // we had a different reaction before, so this is changing the reaction
      const reactionsCount = post.myReaction
        ? post.reactionsCount
        : post.reactionsCount + 1
      setPosts(oldPost => ({
        ...oldPost,
        myReaction: reactionType,
        reactionsCount,
      }))
    }

    // Then we send the reaction to the server
    const res = await addReactionAPI(
      post.id,
      author.id,
      reactionType ? reactionType : post.myReaction,
    )
    // TOOO: handle error case

    inFlightReactionRequest.current = false
    return res
  }

  return {
    handleFeedReaction,
    handleSinglePostReaction,
  }
}
