import firestore from '@react-native-firebase/firestore'

const orderRef = firestore().collection('restaurant_orders')

export const persistOrder = async order => {
  return orderRef
    .add(order)
    .then(response => {
      const finalOrder = { ...order, id: response.id }
      orderRef.doc(response.id).update(finalOrder)
    })
    .catch(error => {
      alert(error.message)
      console.log(error)
    })
}
