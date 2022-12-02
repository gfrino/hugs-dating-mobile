import firestore from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'

export const subscribeToReportedUsers = (userID, callback) => {
  return firestore()
    .collection('user_reports')
    .doc(userID)
    .collection('reports_live')
    .onSnapshot(snapshot => {
      if (!snapshot || !snapshot.docs) {
        callback && callback([])
      } else {
        callback && callback(snapshot?.docs?.map(doc => doc.data()))
      }
    })
}

export const fetchBlockedUsers = async (userID, page = 0, size = 1000) => {
  const instance = functions().httpsCallable('fetchBlockedUsers')
  try {
    const res = await instance({
      userID,
      page,
      size,
    })

    return res?.data?.users
  } catch (error) {
    console.log(error)
    return null
  }
}

export const markAbuse = async (sourceUserID, destUserID, abuseType) => {
  if (sourceUserID === destUserID) {
    return null
  }

  const instance = functions().httpsCallable('markAbuse')
  try {
    const res = await instance({
      sourceUserID,
      destUserID,
      abuseType,
    })

    return res?.data
  } catch (error) {
    console.log(error)
    return null
  }
}

export const cancelMatch = async (sourceUID, destUID, channelID) => {
  if (sourceUID === destUID) {
    return null
  }

  const instance = functions().httpsCallable('cancelMatch')

  try {
    const res = await instance({
      sourceUID,
      destUID,
      channelID,
    })

    return res?.data
  } catch {
    return { success: false } 
  }

}

export const unblockUser = async (sourceUserID, destUserID) => {
  const instance = functions().httpsCallable('unblockUser')
  try {
    const res = await instance({
      sourceUserID,
      destUserID,
    })
    return res?.data
  } catch (error) {
    console.log(error)
    return null
  }
}
