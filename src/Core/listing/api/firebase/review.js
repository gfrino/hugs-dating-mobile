import { firebase } from '@react-native-firebase/firestore'
import { getUnixTimeStamp } from '../../../helpers/timeFormat'

export const subscribeReviews = (
  listingId,
  collectionName = 'reviews',
  callback,
) => {
  const reviewsRef = firebase.firestore().collection(collectionName)
  return reviewsRef
    .where('listingID', '==', listingId)
    .onSnapshot(querySnapshot => {
      const reviewsData = []
      querySnapshot?.forEach(doc => {
        const review = doc.data()
        reviewsData.push(review)
      })
      callback(reviewsData)
    })
}

export const postReview = (
  user,
  data,
  starCount,
  content,
  reviewsCollectionName = 'reviews',
  listingsCollectionName = 'listings',
  callback,
) => {
  const reviewsRef = firebase.firestore().collection(reviewsCollectionName)
  const listingsRef = firebase.firestore().collection(listingsCollectionName)
  reviewsRef
    .add({
      authorID: user.id,
      listingID: data.id,
      starCount,
      content: content,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureURL: user.profilePictureURL,
      createdAt: getUnixTimeStamp(),
    })
    .then(docRef => {
      reviewsRef
        .where('listingID', '==', data.id)
        .get()
        .then(reviewQuerySnapshot => {
          let totalStarCount = 0,
            count = 0
          reviewQuerySnapshot?.forEach(reviewDoc => {
            const review = reviewDoc.data()

            totalStarCount += review.starCount
            count++
          })

          if (count > 0) {
            data.starCount = totalStarCount / count
          } else {
            data.starCount = 0
          }

          listingsRef.doc(data.id).set(data)
          callback({ success: true })
        })
    })
    .catch(error => {
      console.log(error)
      callback({ success: false })
    })
}

export default {
  postReview,
  subscribeReviews,
}
