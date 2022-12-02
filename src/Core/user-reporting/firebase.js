import { firebase } from '@react-native-firebase/firestore'
import { getUnixTimeStamp } from '../helpers/timeFormat'

const abuseDBRef = firebase.firestore().collection('reports')
const usersDBRef = firebase.firestore().collection('users')

export const markAbuse = (outBoundID, toUserID, abuseType) => {
  if (outBoundID == toUserID) {
    return Promise(r => {
      r()
    })
  }
  return new Promise(resolve => {
    const data = {
      dest: toUserID,
      source: outBoundID,
      type: abuseType,
      createdAt: getUnixTimeStamp(),
    }
    abuseDBRef
      .add(data)
      .then(() => {
        resolve({ success: true })
      })
      .catch(error => {
        resolve({ error: error })
      })
  })
}

export const unsubscribeAbuseDB = (userID, callback) => {
  return abuseDBRef.where('source', '==', userID).onSnapshot(querySnapshot => {
    const abuses = []
    querySnapshot?.forEach(doc => {
      abuses.push(doc.data())
    })
    return callback(abuses)
  })
}

export const unblockUser = async (currentUserID, blockedUserID, callback) => {
  await abuseDBRef
    .where('source', '==', currentUserID)
    .where('dest', '==', blockedUserID)
    .get()
    .then(querySnapshot => {
      querySnapshot?.forEach(doc => {
        doc.ref.delete()
      })
      return callback(true)
    })
}

export const hydrateAllReportedUsers = (userID, callback) => {
  return abuseDBRef.where('source', '==', userID).onSnapshot(snapshot => {
    const list = []
    snapshot.forEach(
      childSnapshot => {
        let blockedUser = childSnapshot.data()
        let promise = new Promise((resolve, fail) => {
          usersDBRef
            .doc(blockedUser.dest)
            .get()
            .then(
              snap => {
                resolve(snap.data())
              },
              _error => {
                resolve(null)
              },
            )
        })
        list.push(promise)
      },
      error => {
        console.error(error)
      },
    )
    const allPromise = Promise.all(list)
    allPromise.then(response => {
      callback && callback(response.filter(x => x != null))
    })
  })
}
