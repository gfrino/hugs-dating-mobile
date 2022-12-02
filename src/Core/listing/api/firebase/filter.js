import { firebase } from '@react-native-firebase/firestore'

export const subscribeFilters = (collection, categoryID, callback) => {
  const filterRef = firebase.firestore().collection(collection)

  return filterRef.onSnapshot(querySnapshot => {
    var updatedData = []
    querySnapshot?.forEach(doc => {
      const updatedFilter = doc.data()
      const isFilterCategory = getIsFilterCategory(updatedFilter, categoryID)
      if (isFilterCategory) {
        updatedData.push({ ...updatedFilter, id: doc.id })
      }
    })
    callback && callback(updatedData)
  })
}

const getIsFilterCategory = (filter, categoryID) => {
  if (filter.categories) {
    return filter.categories.includes(categoryID)
  } else {
    return true
  }
}

export default {
  subscribeFilters,
}
