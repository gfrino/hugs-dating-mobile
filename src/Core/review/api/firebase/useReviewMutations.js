import { addReview as addReviewAPI } from './ReviewAPIManagerClient'

export default function useReviewMutations(reviewsTableName, entityTableName) {
  const addReview = (entityID, rating, text, user) => {
    return addReviewAPI(
      reviewsTableName,
      entityTableName,
      entityID,
      rating,
      text,
      user,
    )
  }
  return { addReview }
}
