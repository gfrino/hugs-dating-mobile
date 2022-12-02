// VIDEO_CALL_FLAG_ENABLED_BEGIN
import VoipPushNotification from 'react-native-voip-push-notification'
// VIDEO_CALL_FLAG_ENABLED_END
import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging'
import { ErrorCode } from '../../api/ErrorCode'

// const baseAPIURL = 'https://codebaze.herokuapp.com/api/';
const baseAPIURL = 'http://localhost:3000/api/'

const fetchUser = userID => {
  return new Promise((resolve, _reject) => {
    fetch(baseAPIURL + 'user/' + userID, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(json => {
        resolve(json)
      })
      .catch(error => {
        alert(error)
        console.error(error)
      })
  })
}

export const retrievePersistedAuthUser = () => {
  return new Promise(resolve => {
    AsyncStorage.getItem('logged_in_user_id').then(userID => {
      if (!userID) {
        resolve(null)
        return
      }
      fetchUser(userID).then(res => resolve(res))
    })
  })
}

export const sendPasswordResetEmail = email => {
  firebase.auth().sendPasswordResetEmail(email)
}

const signInWithCredential = (authManager, credential, appIdentifier) => {
  return new Promise((resolve, _reject) => {
    authManager
      .auth()
      .signInWithCredential(credential)
      .then(response => {
        const isNewUser = response.additionalUserInfo.isNewUser
        const { first_name, last_name } = response.additionalUserInfo.profile
        const { uid, email, phoneNumber, photoURL } = response.user

        if (isNewUser) {
          const timestamp = firebase.firestore.FieldValue.serverTimestamp()
          const userData = {
            id: uid,
            email: email || '',
            firstName: first_name || '',
            lastName: last_name || '',
            phone: phoneNumber || '',
            profilePictureURL: photoURL,
            userID: uid,
            appIdentifier,
            createdAt: timestamp,
          }
          usersRef
            .doc(uid)
            .set(userData)
            .then(() => {
              resolve({
                user: { ...userData, id: uid, userID: uid },
                accountCreated: true,
              })
            })
        }
        usersRef
          .doc(uid)
          .get()
          .then(document => {
            const userData = document.data()
            resolve({
              user: { ...userData, id: uid, userID: uid },
              accountCreated: false,
            })
          })
      })
      .catch(_error => {
        console.log(_error)
        resolve({ error: ErrorCode.serverError })
      })
  })
}

export const checkUniqueUsername = username => {
  return new Promise(resolve => {
    if (!username) {
      resolve()
    }
    usersRef
      .where('username', '==', username?.toLowerCase())
      .get()
      .then(querySnapshot => {
        if (querySnapshot?.docs.length <= 0) {
          // doesn't exist
          resolve({ isUnique: true })
        } else {
          // does exist
          resolve({ taken: true })
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const registerWithEmail = (userDetails, appIdentifier) => {
  const {
    email,
    firstName,
    lastName,
    username,
    password,
    phone,
    profilePictureURL,
    location,
    signUpLocation,
  } = userDetails
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async response => {
        const usernameResponse = await checkUniqueUsername(username)

        if (usernameResponse?.taken) {
          firebase.default.auth().currentUser.delete()
          return resolve({ error: ErrorCode.usernameInUse })
        }

        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const uid = response.user.uid

        const data = {
          id: uid,
          userID: uid, // legacy reasons
          email,
          firstName,
          lastName,
          username: (username || '')?.toLowerCase(),
          phone: phone || '',
          profilePictureURL,
          location: location || '',
          signUpLocation: signUpLocation || '',
          appIdentifier,
          createdAt: timestamp,
        }
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            resolve({ user: data })
          })
          .catch(error => {
            alert(error)
            resolve({ error: ErrorCode.serverError })
          })
      })
      .catch(error => {
        console.log('_error:', error)
        var errorCode = ErrorCode.serverError
        if (error.code === 'auth/email-already-in-use') {
          errorCode = ErrorCode.emailInUse
        }
        resolve({ error: errorCode })
      })
  })
}

export const loginWithEmailAndPassword = async (email, password) => {
  return new Promise(function (resolve, reject) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        const uid = response.user.uid

        const userData = {
          email,
          password,
          id: uid,
        }
        usersRef
          .doc(uid)
          .get()
          .then(function (firestoreDocument) {
            if (!firestoreDocument.exists) {
              resolve({ errorCode: ErrorCode.noUser })
              return
            }
            const user = firestoreDocument.data()
            const newUserData = {
              ...userData,
              ...user,
            }
            resolve({ user: newUserData })
          })
          .catch(function (_error) {
            console.log('_error:', _error)
            resolve({ error: ErrorCode.serverError })
          })
      })
      .catch(error => {
        console.log('error:', error)
        var errorCode = ErrorCode.serverError
        switch (error.code) {
          case 'auth/wrong-password':
            errorCode = ErrorCode.invalidPassword
            break
          case 'auth/network-request-failed':
            errorCode = ErrorCode.serverError
            break
          case 'auth/user-not-found':
            errorCode = ErrorCode.noUser
            break
          default:
            errorCode = ErrorCode.serverError
        }
        resolve({ error: errorCode })
      })
  })
}

export const loginWithApple = (identityToken, nonce, appIdentifier) => {
  const appleCredential = RNFBAuth.auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  )

  return new Promise((resolve, _reject) => {
    signInWithCredential(RNFBAuth, appleCredential, appIdentifier).then(
      response => {
        resolve(response)
      },
    )
  })
}

export const loginWithFacebook = (accessToken, appIdentifier) => {
  const credential = firebase.auth.FacebookAuthProvider.credential(accessToken)

  return new Promise((resolve, _reject) => {
    signInWithCredential(firebase, credential, appIdentifier).then(response => {
      resolve(response)
    })
  })
}

export const logout = () => {}

export const onVerificationChanged = phone => {
  auth()
    .verifyPhoneNumber(phone)
    .on(
      'state_changed',
      phoneAuthSnapshot => {
        console.log('State: ', phoneAuthSnapshot.state)
      },
      error => {
        console.error(error)
      },
      phoneAuthSnapshot => {
        console.log(phoneAuthSnapshot)
      },
    )
}

export const retrieveUserByPhone = phone => {
  return new Promise(resolve => {
    if (!phone) {
      resolve()
    }
    usersRef
      .where('phone', '==', phone)
      .get()
      .then(querySnapshot => {
        if (querySnapshot?.docs.length <= 0) {
          resolve({ error: true })
        } else {
          resolve({ success: true })
        }
      })
  })
}

export const sendSMSToPhoneNumber = phoneNumber => {
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        resolve({ confirmationResult })
      })
      .catch(function (_error) {
        console.log(_error)
        console.warn(_error)
        resolve({ error: ErrorCode.smsNotSent })
      })
  })
}

export const loginWithSMSCode = (smsCode, verificationID) => {
  const credential = firebase.auth.PhoneAuthProvider.credential(
    verificationID,
    smsCode,
  )
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        const { user } = result
        usersRef
          .doc(user.uid)
          .get()
          .then(function (firestoreDocument) {
            if (!firestoreDocument.exists) {
              resolve({ errorCode: ErrorCode.noUser })
              return
            }
            const userData = firestoreDocument.data()
            resolve({ user: userData })
          })
          .catch(function (_error) {
            resolve({ error: ErrorCode.serverError })
          })
      })
      .catch(_error => {
        resolve({ error: ErrorCode.invalidSMSCode })
      })
  })
}

export const registerWithPhoneNumber = (
  userDetails,
  smsCode,
  verificationID,
  appIdentifier,
) => {
  const {
    firstName,
    lastName,
    username,
    phone,
    profilePictureURL,
    location,
    signUpLocation,
  } = userDetails
  const credential = firebase.auth.PhoneAuthProvider.credential(
    verificationID,
    smsCode,
  )
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(async response => {
        const phoneResponse = await retrieveUserByPhone(phone)
        if (phoneResponse?.success) {
          firebase.default.auth().currentUser.delete()
          return resolve({ error: ErrorCode.phoneInUse })
        }
        const usernameResponse = await checkUniqueUsername(username)

        if (usernameResponse?.taken) {
          firebase.default.auth().currentUser.delete()
          return resolve({ error: ErrorCode.usernameInUse })
        }

        const timestamp = firebase.firestore.FieldValue.serverTimestamp()
        const uid = response.user.uid
        const data = {
          id: uid,
          userID: uid, // legacy reasons
          firstName,
          lastName,
          username: (username || '')?.toLowerCase(),
          phone,
          profilePictureURL,
          location: location || '',
          signUpLocation: signUpLocation || '',
          appIdentifier,
          createdAt: timestamp,
        }
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            resolve({ user: data })
          })
      })
      .catch(error => {
        console.log(error)
        var errorCode = ErrorCode.serverError
        if (error.code === 'auth/email-already-in-use') {
          errorCode = ErrorCode.emailInUse
        }
        resolve({ error: errorCode })
      })
  })
}

export const updateProfilePhoto = (userID, profilePictureURL) => {
  return new Promise((resolve, reject) => {
    fetch(baseAPIURL + 'user/' + userID, {
      method: 'put',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ profilePictureURL: profilePictureURL }),
    })
      .then(response => {
        console.log(response)
        resolve({ success: true })
      })
      .catch(error => {
        alert(error)
        console.error(error)
        resolve({ sucess: false })
      })
  })
}

export const fetchAndStorePushTokenIfPossible = async user => {
  try {
    const settings = await messaging().requestPermission()
    if (settings) {
      const token = await messaging().getToken()
      updateUser(user.id || user.userID, {
        pushToken: token,
        pushKitToken: '',
        badgeCount: 0,
      })
    }

    // VIDEO_CALL_FLAG_ENABLED_BEGIN
    if (Platform.OS === 'ios') {
      VoipPushNotification.requestPermissions()
      VoipPushNotification.registerVoipToken()

      VoipPushNotification.addEventListener('register', token => {
        console.log('push kit token from ios', token)
        updateUser(user.id || user.userID, { pushKitToken: token })
      })
    }
    // VIDEO_CALL_FLAG_ENABLED_END
  } catch (error) {
    console.log(error)
  }
}

export const removeUser = userID => {
  // TODO: Implement custom backend method
}
