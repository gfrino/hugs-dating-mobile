import firestore from '@react-native-firebase/firestore'

export const subscribeAdminOrders = (vendorOrdersTableName, callback) => {
  const ref = firestore()
    .collection(vendorOrdersTableName)
    .orderBy('createdAt', 'desc')

  return ref.onSnapshot(
    querySnapshot => {
      const data = []
      querySnapshot?.forEach(doc => {
        const { foods } = doc.data()
        data.push({
          id: doc.id,
          list: foods,
        })
      })
      callback?.(data)
    },
    error => {
      console.warn(error)
    },
  )
}

export const deleteOrder = async orderID => {
  return firestore()
    .collection('restaurant_orders')
    .doc(orderID)
    .delete()
    .then(result => console.warn(result))
}
