import firestore from '@react-native-firebase/firestore'
import { getUnixTimeStamp } from '../../../helpers/timeFormat'

export const subscribeReviews = (reviewsTableName, entityID, callback) => {
  if (!reviewsTableName || !entityID) {
    return () => {}
  }
  const reviewRef = firestore()
    .collection(reviewsTableName)
    .where('entityID', '==', entityID)

  return reviewRef.onSnapshot(
    querySnapshot => {
      var reviews = []
      querySnapshot?.forEach(doc => {
        const singleReview = doc.data()
        reviews.push({
          id: doc.id,
          singleReview,
        })
      })

      callback?.(reviews)
    },
    error => {
      console.warn(error)
    },
  )
}

export const addReview = async (
  reviewsTableName,
  entityTableName,
  entityID,
  rating,
  text,
  user,
) => {
  if (!reviewsTableName || !entityTableName || !entityID) {
    return
  }

  const reviewRef = firestore().collection(reviewsTableName)
  const entityRef = firestore().collection(entityTableName)

  const id = reviewRef.doc().id
  return reviewRef
    .doc(id)
    .set({
      author: user,
      authorID: user.id,
      authorName: `${user.firstName} ${user.lastName}`,
      authorProfilePic: user.profilePictureURL,
      createdAt: getUnixTimeStamp(),
      entityID: entityID,
      id,
      rating,
      text,
    })
    .then(() => {
      entityRef
        .doc(entityID)
        .get()
        .then(doc => {
          if (!doc?.exists) {
            return
          }
          const data = doc.data()
          let totalNReviews = data.totalNReviews ?? 0
          let sumOfRatings = data.sumOfRatings ?? 0

          totalNReviews += 1
          sumOfRatings += rating

          const avgRating = (sumOfRatings / totalNReviews).toFixed(1)
          entityRef.doc(entityID).update({
            totalNReviews,
            sumOfRatings,
            avgRating,
          })
        })
    })
    .catch(error => console.log(error))
}
