import functions from '@react-native-firebase/functions'

export const fetchGeoProximityUsers = functions().httpsCallable(
  'fetchGeoProximityUsers',
)

export const fetchRoomRecommendations = functions().httpsCallable(
  'fetchRoomRecommendations',
)

const callables = {
  fetchGeoProximityUsers,
  fetchRoomRecommendations,
}

export default callables
