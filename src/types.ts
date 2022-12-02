import { SwipeType } from './api/firebase/types'

export interface Store {
  dating: DatingStore
}

export interface DatingStore {
  swipes: {
    [key: string]: SwipeType
  }
  // matches: null
  // incomingSwipes: null
  // didSubscribeToSwipes: boolean
}
