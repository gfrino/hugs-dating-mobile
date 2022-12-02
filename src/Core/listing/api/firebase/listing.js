import { firebase } from '@react-native-firebase/firestore'
import { setFavoriteItems } from '../../../favorites/redux'
import { getUnixTimeStamp } from '../../../helpers/timeFormat'

export const subscribeListingCategories = (
  categoriesCollectionName,
  callback,
) => {
  const categoriesRef = firebase
    .firestore()
    .collection(categoriesCollectionName)
    .orderBy('order')
  return categoriesRef.onSnapshot(querySnapshot => {
    const categoriesData = []
    querySnapshot?.forEach(doc => {
      const category = doc.data()
      categoriesData.push({ ...category, id: doc.id })
    })
    callback(categoriesData)
  })
}

export const fetchListing = async (
  listingID,
  listingsCollectionName,
  callback,
) => {
  const listingsRef = firebase.firestore().collection(listingsCollectionName)
  const doc = await listingsRef.doc(listingID).get()
  if (doc) {
    callback(doc.data())
  } else {
    callback(null)
  }
}

export const subscribeListings = (
  { userId, categoryId, isApproved = true },
  favorites,
  listingsCollectionName,
  callback,
) => {
  const listingsRef = firebase.firestore().collection(listingsCollectionName)

  if (userId) {
    return listingsRef
      .where('authorID', '==', userId)
      .where('isApproved', '==', isApproved)
      .onSnapshot(querySnapshot => {
        const data = []
        querySnapshot?.forEach(doc => {
          const listing = doc.data()
          if (favorites && favorites[doc.id] === true) {
            listing.saved = true
          }
          data.push({ ...listing, id: doc.id })
        })
        callback(data)
      })
  }

  if (categoryId) {
    return listingsRef
      .where('categoryID', '==', categoryId)
      .where('isApproved', '==', isApproved)
      .onSnapshot(querySnapshot => {
        const data = []
        querySnapshot?.forEach(doc => {
          const listing = doc.data()
          if (favorites && favorites[doc.id] === true) {
            listing.saved = true
          }
          data.push({ ...listing, id: doc.id })
        })
        callback(data)
      })
  }

  // If no user or category is specified, we return either
  // 1. listings favorited by current user, if favorites param is set
  // 2. all listings, if favorites param is not set
  return listingsRef.onSnapshot(querySnapshot => {
    const data = []
    querySnapshot?.forEach(doc => {
      const listing = doc.data()
      if (favorites && favorites[doc.id] === true) {
        listing.saved = true
        data.push({ ...listing, id: doc.id })
      } else if (!favorites) {
        data.push({ ...listing, id: doc.id })
      }
    })
    callback(data)
  })
}

export const subscribeSavedListings = (
  userId,
  callback,
  listingId,
  favoritesCollectionName,
) => {
  const savedListingsRef = firebase
    .firestore()
    .collection(favoritesCollectionName)

  if (listingId) {
    return savedListingsRef
      .where('userID', '==', userId)
      .where('listingID', '==', listingId)
      .onSnapshot(querySnapshot => {
        const savedListingdata = {}
        querySnapshot?.forEach(doc => {
          const savedListing = doc.data()

          savedListingdata[savedListing.listingID] = true
          // savedListingdata.push(temp);
        })

        callback(savedListingdata)
      })
  }
  if (userId) {
    return savedListingsRef
      .where('userID', '==', userId)
      .onSnapshot(querySnapshot => {
        const savedListingdata = {}
        querySnapshot?.forEach(doc => {
          const savedListing = doc.data()

          savedListingdata[savedListing.listingID] = true
          // savedListingdata.push(temp);
        })

        callback(savedListingdata)
      })
  }

  return savedListingsRef.onSnapshot(querySnapshot => {
    const savedListingdata = {}
    querySnapshot?.forEach(doc => {
      const savedListing = doc.data()
      savedListingdata[savedListing.listingID] = true
    })
    callback(savedListingdata)
  })
}

export const saveUnsaveListing = async (
  item,
  userId,
  favorites,
  favoritesCollectionName,
  dispatch,
) => {
  const savedListingsRef = firebase
    .firestore()
    .collection(favoritesCollectionName)

  if (favorites && favorites[item.id] === true) {
    var newFav = { ...favorites }
    newFav[item?.id] = null
    delete newFav[item?.id]
    dispatch(setFavoriteItems(newFav))
    savedListingsRef
      .where('listingID', '==', item.id)
      .where('userID', '==', userId)
      .get()
      .then(querySnapshot => {
        querySnapshot?.forEach(doc => {
          doc.ref.delete()
        })
      })
  } else {
    var newFav = { ...favorites }
    newFav[item?.id] = true
    dispatch(setFavoriteItems(newFav))
    savedListingsRef
      .add({
        userID: userId,
        listingID: item.id,
      })
      .then(docRef => {})
      .catch(error => {
        alert(error)
      })
  }
}

export const removeListing = async (
  listingId,
  listingsCollectionName,
  favoritesCollectionName,
  callback,
) => {
  const listingsRef = firebase.firestore().collection(listingsCollectionName)
  const savedListingsRef = firebase
    .firestore()
    .collection(favoritesCollectionName)

  listingsRef
    .doc(listingId)
    .delete()
    .then(() => {
      savedListingsRef
        .where('listingID', '==', listingId)
        .get()
        .then(querySnapshot => {
          querySnapshot?.forEach(function (doc) {
            doc.ref.delete()
          })
        })
      callback({ success: true })
    })
    .catch(error => {
      callback({ success: false })
      console.log('Error deleting listing: ', error)
    })
}

export const approveListing = (listingId, listingsCollectionName, callback) => {
  const listingsRef = firebase.firestore().collection(listingsCollectionName)

  listingsRef
    .doc(listingId)
    .update({ isApproved: true })
    .then(() => {
      callback({ success: true })
    })
    .catch(error => {
      callback({ success: false })
      console.log('Error approving listing: ', error)
    })
}

export const postListing = (
  selectedItem,
  uploadObject,
  photoUrls,
  location,
  listingsCollectionName,
  callback,
) => {
  const listingsRef = firebase.firestore().collection(listingsCollectionName)

  const updatedUploadObjects = {
    ...uploadObject,
    createdAt: getUnixTimeStamp(),
    coordinate: new firebase.firestore.GeoPoint(
      location.latitude,
      location.longitude,
    ),
  }

  const coverPhoto = photoUrls.length > 0 ? photoUrls[0] : null

  if (selectedItem) {
    listingsRef
      .doc(selectedItem.id)
      .update({ ...updatedUploadObjects, photo: coverPhoto })
      .then(docRef => {
        callback({ success: true })
      })
      .catch(error => {
        console.log(error)
        callback({ success: false })
      })
  } else {
    listingsRef
      .add(updatedUploadObjects)
      .then(docRef => {
        if (docRef.id) {
          listingsRef
            .doc(docRef.id)
            .update({ id: docRef.id, photo: coverPhoto })
        }
        callback({ success: true })
      })
      .catch(error => {
        console.log(error)
        callback({ success: false })
      })
  }
}

export const subscribeToUnapprovedListings = (
  listingsCollectionName,
  callback,
) => {
  const listingsRef = firebase.firestore().collection(listingsCollectionName)

  return listingsRef
    .where('isApproved', '==', false)
    .onSnapshot(querySnapshot => {
      const data = []
      querySnapshot?.forEach(doc => {
        const listing = doc.data()
        data.push({ ...listing, id: doc.id })
      })
      callback(data)
    })
}

export default {
  subscribeToUnapprovedListings,
  postListing,
  removeListing,
  approveListing,
  saveUnsaveListing,
  subscribeSavedListings,
  subscribeListings,
  fetchListing,
  subscribeListingCategories,
}
