import { useRef, useState } from 'react'

import {
  subscribeToComments as subscribeToCommentsAPI,
  listComments as listCommentsAPI,
} from './firebaseFeedClient'

export const useComments = () => {
  const [comments, setComments] = useState(null)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const pagination = useRef({ page: 0, size: 25, exhausted: false })

  const loadMoreComments = async postID => {
    if (pagination.current.exhausted) {
      return
    }
    const newComments = await listCommentsAPI(
      postID,
      pagination.current.page,
      pagination.current.size,
    )
    if (newComments?.length === 0) {
      pagination.current.exhausted = true
    }
    pagination.current.page += 1
    setComments(oldComments =>
      deduplicatedComments(oldComments, newComments, true),
    )
  }

  const subscribeToComments = postID => {
    setCommentsLoading(true)
    return subscribeToCommentsAPI(postID, newComments => {
      setCommentsLoading(false)
      setComments(oldComments =>
        deduplicatedComments(oldComments, newComments, false),
      )
    })
  }

  const deduplicatedComments = (oldComments, newComments, appendToBottom) => {
    const all = oldComments
      ? appendToBottom
        ? [...oldComments, ...newComments]
        : [...newComments, ...oldComments]
      : newComments
    const deduplicatedComments = all.reduce((acc, curr) => {
      if (!acc.some(comment => comment.id === curr.id)) {
        acc.push(curr)
      }
      return acc
    }, [])
    return deduplicatedComments
  }

  return {
    comments,
    commentsLoading,
    subscribeToComments,
    loadMoreComments,
  }
}
