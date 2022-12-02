/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

import { mockReviewsData } from './localData'

export const subscribeReviews = (listingId, callback) => {
  const reviewsRef = null
  callback(mockReviewsData)
  return reviewsRef
}

/**
 * Post a review
 *
 * @param {object} user the user object of the crurrently signed in user
 * @param {object} listing the object of the listing being reviewed
 * @param {integer} starCount the rating number of the ratings by the user
 * @param {string} reviewDetail the detail of the review
 * @param {function} callback the callback executed after review has been submitted
 */
export const postReview = (
  user,
  listing,
  starCount,
  reviewDetail,
  callback,
) => {
  // update review on the db
  // invoke callback({ success: false }); or callback({ success: true });
  callback({ success: false })
}
