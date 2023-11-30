import firestore from '@react-native-firebase/firestore'
import { getUnixTimeStamp } from '../../../helpers/timeFormat'

const usersRef = firestore().collection('users')

export const updateUser = async (userID, newData) => {
  console.log('updateUser.....................', userID, newData)
  const dataWithOnlineStatus = {
    ...newData,
    lastOnlineTimestamp: getUnixTimeStamp(),
  }
  try {
    await usersRef.doc(userID).set({ ...dataWithOnlineStatus }, { merge: true })
    return { success: true }
  } catch (error) {
    console.log('ERROR [updateUser].,.,.,.,.,.,.,.,.,.========================', error)
    return error
  }
}

export const getUserByID = async userID => {
  try {
    const document = await usersRef.doc(userID).get()
    if (document) {
      console.log('getUserByID....' , document.data);
      return document.data()
    }
    return null
  } catch (error) {
    console.log('ERROR [getUserByID]', error)
    return null
  }
}

export const getUsersByIDs = async userIDs => {
  if (!userIDs || !userIDs.length) {
    return []
  }
  try {
    const documents = await usersRef.where('id', 'in', userIDs).get()
    if (documents) {
      return documents.docs.map(doc => doc.data())
    }
    return null
  } catch (error) {
    console.log('ERROR [getUsersByID]', error)
    return null
  }
}

export const updateProfilePhoto = async (userID, profilePictureURL) => {
  try {
    await usersRef.doc(userID).update({ profilePictureURL: profilePictureURL })
    return { success: true }
  } catch (error) {
    console.log('ERROR [updateProfilePhoto]', error)
    return { error: error }
  }
}
