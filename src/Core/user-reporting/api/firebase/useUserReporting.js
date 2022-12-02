import { useState, useEffect, useRef } from 'react'
import {
  fetchBlockedUsers as fetchBlockedUsersAPI,
  subscribeToReportedUsers as subscribeToReportedUsersAPI,
} from './firebaseUserReportingClient'

const useUserReporting = userID => {
  const [blockedUsers, setBlockedUsers] = useState(null)
  const [isLoadingMore, setIsLoadingMore] = useState(null)

  const pagination = useRef({ page: 0, size: 25, exhausted: false })

  useEffect(() => {
    if (!userID) {
      return
    }
    const unsubscribe = subscribeToReportedUsers()
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [userID])

  const subscribeToReportedUsers = () => {
    return subscribeToReportedUsersAPI(userID, users => {
      setBlockedUsers(deduplicatedReportedUsers(users))
    })
  }

  const loadMoreReportedUsers = async () => {
    if (pagination.current.exhausted) {
      return
    }
    const users = await fetchBlockedUsersAPI(
      userID,
      pagination.current.page,
      pagination.current.size,
    )
    if (users?.length === 0) {
      pagination.current.exhausted = true
    }
    pagination.current.page += 1
    setBlockedUsers(deduplicatedReportedUsers(users))
  }

  const deduplicatedReportedUsers = newBlockedUsers => {
    const all = blockedUsers
      ? [...blockedUsers, ...newBlockedUsers]
      : newBlockedUsers
    return all.reduce((acc, curr) => {
      if (!acc.some(friend => friend.id === curr.id)) {
        acc.push(curr)
      }
      return acc
    }, [])
  }

  return {
    blockedUsers,
    isLoadingMore,
    subscribeToReportedUsers,
    loadMoreReportedUsers,
  }
}

export default useUserReporting
