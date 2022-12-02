import firestore from '@react-native-firebase/firestore'
import { getUnixTimeStamp } from '../../../helpers/timeFormat'

export const subscribeVendors = (table, callback) => {
  const vendorsRef = firestore().collection(table)

  return vendorsRef.onSnapshot(querySnapshot => {
    const vendors = []
    querySnapshot?.forEach(doc => {
      vendors.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    callback?.(vendors)
  })
}

export const subscribeCategories = (table, callback) => {
  const categoriesRef = firestore().collection(table).orderBy('order')

  return categoriesRef.onSnapshot(querySnapshot => {
    const vendors = []
    querySnapshot?.forEach(doc => {
      vendors.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    callback?.(vendors)
  })
}

export const subscribeCategoryVendors = (table, categoryID, callback) => {
  if (!categoryID) {
    return () => {}
  }

  const vendorsRef = firestore().collection(table)
  return vendorsRef
    .where('categoryID', '==', categoryID)
    .onSnapshot(querySnapshot => {
      const list = []
      querySnapshot?.forEach(doc => {
        list.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      callback?.(list)
    })
}

export const subscribeToSingleVendor = async (table, vendorId, callback) => {
  if (!vendorId) {
    return () => {}
  }
  const vendorsRef = firestore().collection(table)

  return vendorsRef.doc(vendorId).onSnapshot(doc => {
    callback?.(doc?.data())
  })
}

export const updateVendor = (
  table,
  vendor,
  uploadObject,
  photoUrls,
  location,
  callback,
) => {
  const updatedUploadObjects = {
    ...uploadObject,
    createdAt: getUnixTimeStamp(),
    coordinate: new firestore.GeoPoint(location.latitude, location.longitude),
  }

  const coverPhoto = photoUrls.length > 0 ? photoUrls[0] : null

  const vendorsRef = firestore().collection(table)

  vendorsRef
    .doc(vendor.id)
    .update({ ...updatedUploadObjects, photo: coverPhoto })
    .then(docRef => {
      callback({ success: true })
    })
    .catch(error => {
      console.log(error)
      callback({ success: false })
    })
}

export const deleteVendor = async (table, vendorId) => {
  if (!vendorId) {
    return null
  }
  try {
    const vendorsRef = firestore().collection(table)

    await vendorsRef.doc(vendorId).delete()

    return vendorId
  } catch (error) {
    return null
  }
}
