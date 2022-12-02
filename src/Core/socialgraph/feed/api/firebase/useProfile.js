import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  subscribeToProfileFeedPosts as subscribeToProfileFeedPostsAPI,
  listProfileFeed as listProfileFeedAPI,
  fetchProfile,
} from './firebaseFeedClient'
import { useReactions } from './useReactions'
import { hydratePostsWithMyReactions } from './utils'

export const useProfile = (profileID, viewerID) => {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState(null)
  const [isLoadingBottom, setIsLoadingBottom] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { handleFeedReaction } = useReactions(setPosts)

  const pagination = useRef({ page: 0, size: 25, exhausted: false })

  const locallyDeletedPosts = useSelector(
    state => state.feed.locallyDeletedPosts ?? [],
  )

  useEffect(() => {
    if (posts?.length && locallyDeletedPosts?.length) {
      const filterDeletedPosts = removeLocallyDeletedPosts(posts)
      setPosts(filterDeletedPosts)
    }
  }, [JSON.stringify(locallyDeletedPosts)])

  useEffect(() => {
    async function fetchData() {
      const profile = await fetchProfile(profileID, viewerID)
      setProfile(profile)
    }
    fetchData()
  }, [profileID, viewerID])

  const loadMorePosts = async userID => {
    if (pagination.current.exhausted) {
      return
    }
    setIsLoadingBottom(true)
    const newPosts = await listProfileFeedAPI(
      userID,
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

  const subscribeToProfileFeedPosts = userID => {
    return subscribeToProfileFeedPostsAPI(userID, newPosts => {
      setPosts(oldPosts =>
        hydratePostsWithMyReactions(
          deduplicatedPosts(
            oldPosts,
            removeLocallyDeletedPosts(newPosts),
            false,
          ),
          userID,
        ),
      )
    })
  }

  const pullToRefresh = async userID => {
    setRefreshing(true)

    const profile = await fetchProfile(profileID, viewerID)
    setProfile(profile)

    pagination.current.page = 0
    pagination.current.exhausted = false

    const newPosts = await listProfileFeedAPI(
      userID,
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

  const removeLocallyDeletedPosts = (postList = []) => {
    return postList.filter(post => !locallyDeletedPosts.includes(post.id))
  }

  return {
    profile,
    posts,
    refreshing,
    isLoadingBottom,
    subscribeToProfileFeedPosts,
    loadMorePosts,
    pullToRefresh,
    addReaction,
  }
}
