import firestore from '@react-native-firebase/firestore'

export const subscribeSingleOrder = (orderId, callback) => {
  const ref = firestore().collection('restaurant_orders').doc(orderId)
  return ref.onSnapshot(
    doc => {
      this.data.length = 0
      let singleOrder = doc.data()
      callback?.(singleOrder)
    },
    error => {
      console.warn(error)
    },
  )
}
