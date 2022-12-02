import { BoostUserDoc } from '../../boost/types'

export default function useCurrentUser(): IUser

export interface IUser {
  _X: null
  _W: null
  g: G
  age: undefined | number
  photos: undefined | string[]
  bio: undefined | string
  school: undefined | string
  hasComputedRcommendations: boolean
  isOnline: boolean
  createdAt: number
  position: Position
  _V: number
  lastName: string
  firstName: string
  pushKitToken: string
  lastOnlineTimestamp: number
  email: string
  id: string
  userCategory: string
  userID: string
  currentRecommendationSize: number
  currentRoomsRecommendationSize?: number
  profilePictureURL: string
  pushToken: string
  location: Position
  badgeCount: number
  username: string
  _U: number
  rooms?: string[]
  signUpLocation: string
  coordinates: Coordinates
  address: string
  phone: string
  settings: Settings
  appIdentifier: string
  boost: BoostUserDoc
}

export interface Coordinates {
  _latitude: number
  _longitude: number
}

export interface G {
  geohash: string
  geopoint: Coordinates
}

export interface Position {
  longitude: number
  latitude: number
}

export interface Settings {
  gender_preference: string
  distance_radius: string
  category_preference: string
  show_me: boolean
  gender: string
}
