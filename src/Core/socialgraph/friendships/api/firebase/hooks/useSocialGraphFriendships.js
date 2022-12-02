import { useRef, useState } from 'react'
import {
  fetchFriendships as fetchFriendshipsAPI,
  subscribeToFriendships as subscribeToFriendshipsAPI,
} from '../firebaseSocialGraphClient'

export const useSocialGraphFriendships = () => {
  const [friendships, setFriendships] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const realtimeFriendships = useRef(null) // the friendships from the live collection only (no need to fetch them again when pull-to-refreshing)

  const pagination = useRef({ page: 0, size: 25, exhausted: false })

  const loadMoreFriendships = async userID => {
    if (pagination.current.exhausted) {
      return
    }
    const newFriendships = await fetchFriendshipsAPI(
      userID,
      pagination.current.page,
      pagination.current.size,
    )
    if (newFriendships?.length === 0) {
      pagination.current.exhausted = true
    }
    pagination.current.page += 1
    setFriendships(deduplicatedFriendships(friendships, newFriendships, true))
  }

  const subscribeToFriendships = userID => {
    return subscribeToFriendshipsAPI(userID, newFriendships => {
      realtimeFriendships.current = newFriendships
      setFriendships(frienships =>
        deduplicatedFriendships(frienships, newFriendships, false),
      )
    })
  }

  const pullToRefresh = async userID => {
    setRefreshing(true)
    pagination.current.page = 0
    pagination.current.exhausted = false

    const newFriendships = await fetchFriendshipsAPI(
      userID,
      pagination.current.page,
      pagination.current.size,
    )
    if (newFriendships?.length === 0) {
      pagination.current.exhausted = true
    }
    pagination.current.page += 1
    setRefreshing(false)
    setFriendships(
      deduplicatedFriendships(
        realtimeFriendships.current,
        newFriendships,
        true,
      ),
    )
  }

  const deduplicatedFriendships = (
    oldFriendships,
    newFriendships,
    appendToBottom,
  ) => {
    const all = oldFriendships
      ? appendToBottom
        ? [...oldFriendships, ...newFriendships]
        : [...newFriendships, ...oldFriendships]
      : newFriendships
    const deduplicatedFriendships = all.reduce((acc, curr) => {
      if (!acc.some(friend => friend.id === curr.id)) {
        acc.push(curr)
      }
      return acc
    }, [])

    return deduplicatedFriendships
  }

  return {
    friendships,
    setFriendships,
    refreshing,
    subscribeToFriendships,
    loadMoreFriendships,
    pullToRefresh,
  }
}
