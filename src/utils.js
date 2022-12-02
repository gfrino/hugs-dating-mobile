import { AsyncStorage } from 'react-native'

const AWARE_CAN_UNDO_SWIPE = 'AWARE_CAN_UNDO_SWIPE'

export const isDatingProfileCompleteForUser = user => {
  return (
    user.profilePictureURL &&
    user.profilePictureURL.length > 0 &&
    user.age &&
    user.bio &&
    user.school &&
    user.firstName
  )
}

export const getUserAwareCanUndoAsync = async () => {
  const isUserAware = await AsyncStorage.getItem(AWARE_CAN_UNDO_SWIPE)

  if (isUserAware !== null) {
    return true
  } else {
    await AsyncStorage.setItem(AWARE_CAN_UNDO_SWIPE, 'true')

    return false
  }
}

export const getLocationUpdated = (prevUserLocation, newUserLocation) => {
  if (prevUserLocation && newUserLocation) {
    const { latitude: prevLat, longitude: prevLon } = prevUserLocation
    const { latitude: newLat, longitude: newLon } = newUserLocation
    const latitudeUpdated = prevLat !== newLat
    const longitudeUpdate = prevLon !== newLon
    const isNewLocation =
      Math.abs(prevLat - newLat) > 0.033 || Math.abs(prevLon - newLon) > 0.033
    return isNewLocation && (latitudeUpdated || longitudeUpdate)
  }
  return false
}
