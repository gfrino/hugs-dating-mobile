import Geocoder from 'react-native-geocoding'
import Geolocation from '@react-native-community/geolocation'
import * as Facebook from 'expo-facebook'
import * as Location from 'expo-location'
import * as authAPI from './authClient'
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { storageAPI } from '../../../media'
import { updateUser } from '../../../users'
import { ErrorCode } from '../../api/ErrorCode'
import { GOOGLE_MAPS_API_KEY } from '../../../../config'
import { getAddressFromLocation } from '../../utils/Geolocation'
import { fetchBoostHistoryThisMonth } from '../../../boost/api'
import { inspect } from 'util'

Geocoder.init(GOOGLE_MAPS_API_KEY)

const validateUsernameFieldIfNeeded = (inputFields, appConfig) => {
  return new Promise((resolve, reject) => {
    const usernamePattern = /^[aA-zZ]\w{3,29}$/

    if (!appConfig.isUsernameFieldEnabled) {
      resolve({ success: true })
    }
    if (
      appConfig.isUsernameFieldEnabled &&
      !inputFields?.hasOwnProperty('username')
    ) {
      return resolve({ error: 'Invalid username' })
    }

    if (!usernamePattern.test(inputFields.username)) {
      return resolve({ error: 'Invalid username' })
    }

    resolve({ success: true })
  })
}

const loginWithEmailAndPassword = (email, password) => {
  return new Promise(function (resolve, _reject) {
    authAPI.loginWithEmailAndPassword(email, password).then(response => {
      if (!response.error) {
        handleSuccessfulLogin({ ...response.user }, false).then(res => {
          // Login successful, push token stored, login credential persisted, so we log the user in.
          resolve({ user: res.user, boosts: res.boosts })
        })
      } else {
        resolve({ error: response.error })
      }
    })
  })
}

const onVerification = phone => {
  authAPI.onVerificationChanged(phone)
}

const createAccountWithEmailAndPassword = (userDetails, appConfig) => {
  console.log("user Details FireBAseAuthManager" , userDetails);
  
  const { photoFile } = userDetails
  const accountCreationTask = userData => {
    return new Promise((resolve, _reject) => {
      authAPI
        .registerWithEmail(userData, appConfig.appIdentifier)
        .then(async response => {
          if (response.error) {
            resolve({ error: response.error })
          } else {
            // We created the user succesfully, time to upload the profile photo and update the users table with the correct URL
            let user = response.user
            if (photoFile) {
              storageAPI.processAndUploadMediaFile(photoFile).then(response => {
                if (response.error) {
                  // if account gets created, but photo upload fails, we still log the user in
                  resolve({
                    nonCriticalError: response.error,
                    user: {
                      ...user,
                      profilePictureURL: '',
                    },
                  })
                } else {
                  authAPI
                    .updateProfilePhoto(user.id, response.downloadURL)
                    .then(_result => {
                      resolve({
                        user: {
                          ...user,
                          profilePictureURL: response.downloadURL,
                        },
                      })
                    })
                }
              })
            } else {
              resolve({
                user: {
                  ...response.user,
                  profilePictureURL: '',
                },
              })
            }
          }
        })
    })
  }

  return new Promise(function (resolve, _reject) {
    const userData = {
      ...userDetails,
      profilePictureURL: '',
    }
    accountCreationTask(userData).then(response => {
      if (response.error) {
        resolve({ error: response.error })
      } else {
        // We signed up successfully, so we are logging the user in (as well as updating push token, persisting credential,s etc.)
        handleSuccessfulLogin(response.user, true).then(response => {
          resolve(response)
        })
      }
    })
  })
}

const retrievePersistedAuthUser = () => {
  console.log("authManagerFirebase.JS");

  return new Promise(resolve => {
    authAPI.retrievePersistedAuthUser().then(user => {
      if (user) {
        handleSuccessfulLogin(user, false).then(res => {
          // Persisted login successful, push token stored, login credential persisted, so we log the user in.
          resolve({
            user: res.user,
            boosts: res.boosts,
          })
        })
      } else {
        resolve(null)
      }
    })
  })
}

const sendPasswordResetEmail = email => {
  return new Promise(resolve => {
    authAPI.sendPasswordResetEmail(email)
    resolve()
  })
}

const logout = user => {
  const userData = {
    ...user,
    isOnline: false,
  }
  updateUser(user.id || user.userID, userData)
  authAPI.logout()
}

const loginOrSignUpWithApple = appConfig => {
  return new Promise(async (resolve, _reject) => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      })

      const { identityToken, nonce } = appleAuthRequestResponse

      authAPI
        .loginWithApple(identityToken, nonce, appConfig.appIdentifier)
        .then(async response => {
          if (response?.user) {
            const newResponse = {
              user: { ...response.user },
              accountCreated: response.accountCreated,
            }
            handleSuccessfulLogin(
              newResponse.user,
              response.accountCreated,
            ).then(response => {
              // resolve(response);
              resolve({
                ...response,
              })
            })
          } else {
            resolve({ error: ErrorCode.appleAuthFailed })
          }
        })
    } catch (error) {
      console.log(error)
      resolve({ error: ErrorCode.appleAuthFailed })
    }
  })
}

const loginOrSignUpWithGoogle = appConfig => {
  GoogleSignin.configure({
    webClientId: appConfig.webClientId,
  })
  return new Promise(async (resolve, _reject) => {
    try {
      const { idToken } = await GoogleSignin.signIn()
      authAPI
        .loginWithGoogle(idToken, appConfig.appIdentifier)
        .then(async response => {
          if (response?.user) {
            const newResponse = {
              user: { ...response.user },
              accountCreated: response.accountCreated,
            }
            handleSuccessfulLogin(
              newResponse.user,
              response.accountCreated,
            ).then(response => {
              // resolve(response);
              resolve({
                ...response,
              })
            })
          } else {
            resolve({ error: ErrorCode.googleSigninFailed })
          }
        })
    } catch (error) {
      console.log(error)
      resolve({
        error: ErrorCode.googleSigninFailed,
      })
    }
  })
}

const loginOrSignUpWithFacebook = appConfig => {
  Facebook.initializeAsync(appConfig.facebookIdentifier)

  return new Promise(async (resolve, _reject) => {
    try {
      const { type, token, expires, permissions, declinedPermissions } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email'],
        })

      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
        authAPI
          .loginWithFacebook(token, appConfig.appIdentifier)
          .then(async response => {
            if (response?.user) {
              const newResponse = {
                user: { ...response.user },
                accountCreated: response.accountCreated,
              }
              handleSuccessfulLogin(
                newResponse.user,
                response.accountCreated,
              ).then(response => {
                // resolve(response);
                resolve({
                  ...response,
                })
              })
            } else {
              resolve({ error: ErrorCode.fbAuthFailed })
            }
          })
      } else {
        resolve({ error: ErrorCode.fbAuthCancelled })
      }
    } catch (error) {
      resolve({ error: ErrorCode.fbAuthFailed })
    }
  })
}

const sendSMSToPhoneNumber = phoneNumber => {
  return authAPI.sendSMSToPhoneNumber(phoneNumber)
}

const loginWithSMSCode = (smsCode, verificationID) => {
  return new Promise(function (resolve, _reject) {
    authAPI.loginWithSMSCode(smsCode, verificationID).then(response => {
      if (response.error) {
        resolve({ error: response.error })
      } else {
        // successful phone number login, we fetch the push token
        handleSuccessfulLogin(response.user, false).then(response => {
          resolve(response)
        })
      }
    })
  })
}

const registerWithPhoneNumber = (
  userDetails,
  smsCode,
  verificationID,
  appIdentifier,
) => {
  const { photoFile } = userDetails
  const accountCreationTask = userData => {
    return new Promise(function (resolve, _reject) {
      authAPI
        .registerWithPhoneNumber(
          userData,
          smsCode,
          verificationID,
          appIdentifier,
        )
        .then(response => {
          if (response.error) {
            resolve({ error: response.error })
          } else {
            // We created the user succesfully, time to upload the profile photo and update the users table with the correct URL
            let user = response.user
            if (photoFile) {
              storageAPI.processAndUploadMediaFile(photoFile).then(response => {
                if (response.error) {
                  // if account gets created, but photo upload fails, we still log the user in
                  resolve({
                    nonCriticalError: response.error,
                    user: {
                      ...user,
                      profilePictureURL: '',
                    },
                  })
                } else {
                  authAPI
                    .updateProfilePhoto(user.id, response.downloadURL)
                    .then(_res => {
                      resolve({
                        user: {
                          ...user,
                          profilePictureURL: response.downloadURL,
                        },
                      })
                    })
                }
              })
            } else {
              resolve({
                user: {
                  ...response.user,
                  profilePictureURL: '',
                },
              })
            }
          }
        })
    })
  }

  return new Promise(function (resolve, _reject) {
    const userData = {
      ...userDetails,
      profilePictureURL: '',
    }
    accountCreationTask(userData).then(response => {
      if (response.error) {
        resolve({ error: response.error })
      } else {
        handleSuccessfulLogin(response.user, true).then(response => {
          resolve(response)
        })
      }
    })
  })
}

const handleSuccessfulLogin = async (user, accountCreated) => {
  console.log("inside handleSuccessfulLogin..." , inspect(user , {depth:4000 , colors : true}));
  // After a successful login, we fetch & store the device token for push notifications, location, online status, etc.
  // we don't wait for fetching & updating the location or push token, for performance reasons (especially on Android)
  const { extraInfo, boosts } = await fetchAndStoreExtraInfoUponLogin(
    user,
    accountCreated,
  )
  console.log("inside handleSuccessfulLogin...boosts" , inspect(boosts , {depth:4000 , colors : true}));
  console.log("inside handleSuccessfulLogin... extraInfo" , inspect(extraInfo , {depth:4000 , colors : true}));

  return { user: { ...user, ...extraInfo }, boosts }
}

const fetchAndStoreExtraInfoUponLogin = async (user, accountCreated) => {
  authAPI.fetchAndStorePushTokenIfPossible(user)

  const boostHistoryThisMonth = await fetchBoostHistoryThisMonth(
    user.userID || user.id,
  )

  const userData = await getCurrentLocation(Geolocation)
    .then(async location => {
      const latitude = location.coords.latitude
      const longitude = location.coords.longitude
      let locationData = {}
      let cityState = ''
      try {
        const geoData = await Geocoder.from(latitude, longitude)
        cityState = getAddressFromLocation(geoData)
      } catch (e) {
        console.log('ERROR [fetchAndStoreExtraInfoUponLogin]', e)
      }
      if (location) {
        locationData = {
          location: {
            latitude: latitude,
            longitude: longitude,
          },
          address: cityState,
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
      return userData
    })
    .catch(e => {
      console.log('ERROR [fetchAndStoreExtraInfoUponLogin]', e)
    })
  return { extraInfo: userData, boosts: boostHistoryThisMonth }
}

const getCurrentLocation = geolocation => {
  return new Promise(async (resolve, reject) => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      resolve({ coords: { latitude: '', longitude: '' } })
      return
    }

    geolocation.getCurrentPosition(
      location => {
        console.log('getCurrentLocation:', location)
        resolve(location)
      },
      error => {
        console.log('ERROR [getCurrentLocation]: ', error)
        reject(error)
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 120000
      }
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

const deleteUser = (userID, callback) => {
  authAPI.removeUser(userID).then(response => callback(response))
}

const authManager = {
  validateUsernameFieldIfNeeded,
  retrievePersistedAuthUser,
  loginWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
  createAccountWithEmailAndPassword,
  loginOrSignUpWithApple,
  loginOrSignUpWithFacebook,
  sendSMSToPhoneNumber,
  loginWithSMSCode,
  registerWithPhoneNumber,
  onVerification,
  loginOrSignUpWithGoogle,
  deleteUser,
}

export default authManager
