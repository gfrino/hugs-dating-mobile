import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from '@react-native-community/geolocation'
import * as Location from 'expo-location'
import { storageAPI } from '../../../media'
import * as authAPI from './authClient'
import { updateUser } from '../../../users'

const baseAPIURL = 'https://codebaze.herokuapp.com/api/';
// const baseAPIURL = 'http://localhost:3000/api/'
/**
 * A method that logs the user into his account
 * Parameters
 * @email - The user's email
 * @password - The user's password
 *
 * returns a promise that resolves to user data
 **/
const loginWithEmailAndPassword = (email, password) => {
  return new Promise(function (resolve, _reject) {
    fetch(baseAPIURL + 'login', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        AsyncStorage.setItem('jwt_token', json?.token)
        AsyncStorage.setItem('logged_in_user_id', json?.userData?.id)
        handleSuccessfulLogin(json.userData, false).then(res => {
          // Persisted login successful, push token stored, login credential persisted, so we log the user in.
          // const userData = {
          //   isOnline: false,
          // }
          // updateUser(res.user.id, userData);
          resolve({
            user: res.user,
          })
        })
      })
      .catch(error => {
        alert(error)
        console.error(error)
        resolve({ error: JSON.stringify(error) })
      })
  })
}

/**
 * A method that creates a new user using email and password
 * Parameters
 * @userDetails - The user details submitted by the user
 * format of userDetials:
 * const userDetails = {
 *     id,
 *     userID,
 *     stripeCustomerID,
 *     phone,
 *     email,
 *     firstName,
 *     lastName,
 *     profilePictureURL,
 *     ...
 *  };
 * @appConfig - config containing details of he app
 *
 * format of config:
 *
 * const config = {
 *    isSMSAuthEnabled: true,
 *    isUIOnlyVariantEnabled: true,
 *    isFirebaseBackendEnabled: false,
 *    appIdentifier: 'rn-messenger-android',
 *    ...
 * }
 *
 * returns a promise that resolves to user data
 **/
const createAccountWithEmailAndPassword = (userDetails, appConfig) => {
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
    stripeCustomerID,
    photoFile,
  } = userDetails

  return new Promise(function (resolve, _reject) {
    fetch(baseAPIURL + 'register', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        email,
        password,
        confirmPassword: password, // We don't show a "confirm password" field on mobile
        stripeCustomerID,
        phone,
        firstName,
        lastName,
        signUpLocation,
        location,
        profilePictureURL: profilePictureURL,
        username,
        appIdentifier: appConfig.appIdentifier,
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        // We've created the account, and now we are going to upload the profile picture if the user picked one
        if (!photoFile) {
          // No profile picture, we're done
          loginWithEmailAndPassword(email, password).then(data => resolve(data))
          return
        } else {
          storageAPI.processAndUploadMediaFile(photoFile).then(response => {
            // Once upload finished, we update the profile photo field with the correct download URL
            updateUser(json.id, {
              profilePictureURL: response.downloadURL,
            })
            loginWithEmailAndPassword(email, password).then(data =>
              resolve(data),
            )
          })
        }
      })
      .catch(error => {
        alert(error)
        console.error(error)
        resolve({ error: JSON.stringify(error) })
      })
  })
}

/**
 * Registers users using Facebook gateway
 *
 * @appConfig - config containing details of he app
 *
 * format of config:
 *
 * const config = {
 *    isSMSAuthEnabled: true,
 *    isUIOnlyVariantEnabled: true,
 *    isFirebaseBackendEnabled: false,
 *    appIdentifier: 'rn-messenger-android',
 *    ...
 * }
 * returns a promise that resolves to user data
 **/
const loginOrSignUpWithFacebook = appConfig => {
  return new Promise(function (resolve, _reject) {
    resolve({ user: mockData })
    // morkData takes the format of:
    // const mockData = {
    //   id,
    //   userID,
    //   stripeCustomerID,
    //   phone,
    //   email,
    //   firstName,
    //   lastName,
    //   profilePictureURL,
    // };
  })
}

/**
 * A method that creates a new user using facebook gateway
 *
 * @appConfig - config containing details of he app
 *
 * format of config:
 *
 * const config = {
 *    isSMSAuthEnabled: true,
 *    isUIOnlyVariantEnabled: true,
 *    isFirebaseBackendEnabled: false,
 *    appIdentifier: 'rn-messenger-android',
 *    ...
 * }
 *
 * returns a promise that resolves to user data
 **/
const loginOrSignUpWithApple = () => {
  return new Promise(function (resolve, _reject) {
    resolve({ user: mockData })
    // morkData takes the format of:
    // const mockData = {
    //   id,
    //   userID,
    //   stripeCustomerID,
    //   phone,
    //   email,
    //   firstName,
    //   lastName,
    //   profilePictureURL,
    // };
  })
}

/**
 * Send out a password reset to the user's email
 * Parameters
 * @email - The user's email
 *
 * returns a promise that resolves to user data
 **/
const sendPasswordResetEmail = email => {
  return {}
}

/**
 * Login using the SMS code
 *
 * returns a promise that resolves to user data
 **/
const loginWithSMSCode = () => {
  return new Promise(function (resolve, _reject) {
    resolve({ user: mockData })
    // morkData takes the format of:
    // const mockData = {
    //   id,
    //   userID,
    //   stripeCustomerID,
    //   phone,
    //   email,
    //   firstName,
    //   lastName,
    //   profilePictureURL,
    // };
  })
}

/*
 ** Logout out of the app
 **
 ** returns a promise that resolves to user data
 */
const logout = async user => {
  await AsyncStorage.removeItem('jwt_token')
  await AsyncStorage.removeItem('logged_in_user_id')
  const userData = {
    isOnline: false,
  }
  updateUser(user.id, userData)
}

const retrievePersistedAuthUser = () => {
  return new Promise(resolve => {
    authAPI.retrievePersistedAuthUser().then(user => {
      if (user) {
        handleSuccessfulLogin(user, false).then(res => {
          // Persisted login successful, push token stored, login credential persisted, so we log the user in.
          resolve({
            user: res.user,
          })
        })
      } else {
        resolve(null)
      }
    })
  })
}

const handleSuccessfulLogin = (user, accountCreated) => {
  // After a successful login, we fetch & store the device token for push notifications, location, online status, etc.
  // we don't wait for fetching & updating the location or push token, for performance reasons (especially on Android)
  fetchAndStoreExtraInfoUponLogin(user, accountCreated)
  return new Promise(resolve => {
    resolve({ user: { ...user } })
  })
}

const fetchAndStoreExtraInfoUponLogin = async (user, accountCreated) => {
  authAPI.fetchAndStorePushTokenIfPossible(user)

  getCurrentLocation(Geolocation).then(async location => {
    const latitude = location.coords.latitude
    const longitude = location.coords.longitude
    var locationData = {}
    if (location) {
      locationData = {
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      }
      if (accountCreated) {
        locationData = {
          ...locationData,
          signUpLocation: {
            latitude: latitude,
            longitude: longitude,
          },
        }
      }
    }

    const userData = {
      ...locationData,
      isOnline: true,
    }

    updateUser(user.id || user.userID, userData)
  })
}

const getCurrentLocation = geolocation => {
  return new Promise(async resolve => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      resolve({ coords: { latitude: '', longitude: '' } })
      return
    }

    geolocation.getCurrentPosition(
      location => {
        console.log(location)
        resolve(location)
      },
      error => {
        console.log(error)
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 120000 }
    )

    // setRegion(location.coords);
    // onLocationChange(location.coords);

    // geolocation.getCurrentPosition(
    //     resolve,
    //     () => resolve({ coords: { latitude: "", longitude: "" } }),
    //     { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    // );
  })
}

const validateUsernameFieldIfNeeded = (inputFields, appConfig) => {
  return new Promise((resolve, reject) => {
    resolve({ success: true })

    // Error format:
    // resolve({ error: localized('Invalid username') });
  })
}

/**Deletes the user account
 *
 * @param {string} userId strting of the current user
 * @param {function} callback A callback to be called after the delete operation has finished
 */
const deleteUser = (userID, callback) => {
  // calls the removeUser from the auth API
}

const authManager = {
  loginWithEmailAndPassword,
  createAccountWithEmailAndPassword,
  loginOrSignUpWithFacebook,
  loginOrSignUpWithApple,
  loginWithSMSCode,
  sendPasswordResetEmail,
  logout,
  retrievePersistedAuthUser,
  validateUsernameFieldIfNeeded,
  deleteUser,
}

export default authManager
