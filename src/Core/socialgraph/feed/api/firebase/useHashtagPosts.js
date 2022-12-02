import { useEffect, useRef, useState } from 'react'
import {
  subscribeToHashtagFeedPosts as subscribeToHashtagFeedPostsAPI,
  listHashtagFeedPosts as listHashtagFeedPostsAPI,
} from './firebaseFeedClient'
import { useReactions } from './useReactions'
import { hydratePostsWithMyReactions } from './utils'

export const useHashtagPosts = (hashtag, userID) => {
  const [posts, setPosts] = useState(null)
  const [isLoadingBottom, setIsLoadingBottom] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { handleFeedReaction } = useReactions(setPosts)

  const pagination = useRef({ page: 0, size: 25, exhausted: false })

  useEffect(() => {
    if (!hashtag || !userID) {
      return
    }
    const unsubscribe = subscribeToHashtagPosts(hashtag, userID)
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [hashtag, userID])

  const loadMorePosts = async (hashtag, userID) => {
    if (pagination.current.exhausted) {
      return
    }
    setIsLoadingBottom(true)
    const newPosts = await listHashtagFeedPostsAPI(
      hashtag,
      pagination.current.page,
      pagination.current.size,
    )
    if (newPosts?.length === 0) {
      pagination.current.exhausted = true
    }
    pagination.current.page += 1
    setIsLoadingBottom(false)
    setPosts(oldPosts =>
      hydratePostsWithMyReactions(
        deduplicatedPosts(oldPosts, newPosts, true),
        userID,
      ),
    )
  }

  const subscribeToHashtagPosts = (hashtag, userID) => {
    return subscribeToHashtagFeedPostsAPI(hashtag, newPosts => {
      setPosts(oldPosts =>
        hydratePostsWithMyReactions(
          deduplicatedPosts(oldPosts, newPosts, false),
          userID,
        ),
      )
    })
  }

  const pullToRefresh = async (hashtag, userID) => {
    setRefreshing(true)
    pagination.current.page = 0
    pagination.current.exhausted = false

    const newPosts = await listHashtagFeedPostsAPI(
      hashtag,
      pagination.current.page,
      pagination.current.size,
    )
    if (newPosts?.length === 0) {
      pagination.current.exhausted = true
    }
    pagination.current.page += 1
    setRefreshing(false)
    setPosts(oldPosts =>
      hydratePostsWithMyReactions(
        deduplicatedPosts(oldPosts, newPosts, true),
        userID,
      ),
    )
  }

  const addReaction = async (post, author, reaction) => {
    await handleFeedReaction(post, reaction, author)
  }

  const deduplicatedPosts = (oldPosts, newPosts, appendToBottom) => {
    const all = oldPosts
      ? appendToBottom
        ? [...oldPosts, ...newPosts]
        : [...newPosts, ...oldPosts]
      : newPosts
    const deduplicatedPosts = all?.reduce((acc, curr) => {
      if (!acc.some(post => post.id === curr.id)) {
        acc.push(curr)
      }
      return acc
    }, [])

    return deduplicatedPosts || []
  }

  return {
    posts,
    refreshing,
    isLoadingBottom,
    subscribeToHashtagPosts,
    loadMorePosts,
    pullToRefresh,
    addReaction,
  }
}
