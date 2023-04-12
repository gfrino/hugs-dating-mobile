import { Dimensions, Platform } from 'react-native'

export const DEVICE_WIDTH = Dimensions.get('window').width
export const DEVICE_HEIGHT = Dimensions.get('window').height

export const SCREEN_WIDTH = Dimensions.get('screen').width
export const SCREEN_HEIGHT = Dimensions.get('screen').height

export const IS_ANDROID = Platform.OS === 'android'

export const LOCAL_STORAGE_KEY = 'mid5LocalStorage'

export const defaultPicturePictures = {
  motor_disabilities: "https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/default_profile_pictures%2Fmotor_disabilities.jpg?alt=media&token=d491330e-e046-49a1-8336-e0cfac1c0f78",
  psychic_disability: "https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/default_profile_pictures%2Fpsychic_disability.jpg?alt=media&token=2e085be1-d085-4b0d-bf14-4b038c9ea34f",
  sensory_disability: "https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/default_profile_pictures%2Fsensory_disability.jpg?alt=media&token=f4b29aad-31b7-4d49-9710-1520a8608f54",
  // no_disabilities: "https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/default_profile_pictures%2Fno-disabilities.jpg?alt=media&token=a729980b-7679-41b9-84e4-0aceb9b81721",
  with_disabilities: "https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/default_profile_pictures%2Fwith_disability.jpg?alt=media&token=0094dd63-31d3-48e7-9878-0d098b8e482b",
  no_disabilities: "https://firebasestorage.googleapis.com/v0/b/hugs-datings.appspot.com/o/default_profile_pictures%2Fwithout_disability.jpg?alt=media&token=d31d1c8c-2942-4ccc-b294-fa58b34a3c6f",
}

export const getDefaultProfilePicture = disabilityCategory => {
  if (!Object.keys(defaultPicturePictures).includes(disabilityCategory)) {
    return defaultPicturePictures["no_disabilities"];
  }

  return defaultPicturePictures[disabilityCategory];
}



export const profilePictureBorder = {
  male: {
    borderColor: "#00aae4",
    borderWidth: 4,
  },
  female: {
    borderColor: "#ff6961",
    borderWidth: 4,
  },
  default: {
    borderColor: "#a2cf9b",
    borderWidth: 4,
  },
  none: {
    borderColor: "#a2cf9b",
    borderWidth: 4,
  },
}

export const validateBoost = boostExpireUnixTime => {
  const currentUnixTime = new Date().getTime() / 1000
  return currentUnixTime < boostExpireUnixTime
}
