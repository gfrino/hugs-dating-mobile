import { firebase } from './config'

export default class PaymentMethodDataManager {
  constructor(appConfig) {
    this.appConfig = appConfig
    this.paymentMethodsRef = firebase
      .firestore()
      .collection(this.appConfig.FIREBASE_COLLECTIONS.PAYMENT_METHODS)
  }

  subscribePaymentMethods = (ownerId, callback) => {
    if (!ownerId) {
      return
    }
    return this.paymentMethodsRef
      .where('ownerId', '==', ownerId)
      .onSnapshot(querySnapshot => {
        const paymentMethods = []

        querySnapshot?.forEach(doc => {
          const data = doc.data()

          paymentMethods.push(data)
        })

        return callback(paymentMethods)
      })
  }

  addUserPaymentMethod = async paymentMethod => {
    try {
      this.paymentMethodsRef.doc(paymentMethod.id).set(paymentMethod)
    } catch (error) {
      return { error, success: false }
    }
  }

  deleteFromUserPaymentMethods = async cardId => {
    try {
      this.paymentMethodsRef.doc(cardId).delete()
    } catch (error) {
      return { error, success: false }
    }
  }
}
