import { useState, useEffect } from 'react'
import { subscribeReviews as subscribeReviewsAPI } from './ReviewAPIManagerClient'

const useReviews = (reviewsTableName, entityID) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const unsubscribeReviews = subscribeReviewsAPI(
      reviewsTableName,
      entityID,
      onReviewsUpdate,
    )
    return unsubscribeReviews
  }, [])

  const onReviewsUpdate = list => {
    setReviews(list)
    setLoading(false)
  }

  return { reviews, loading }
}

export default useReviews
