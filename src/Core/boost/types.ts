export interface IBoost {
  userID: string
  createdAt: number
  expiresAt: number
  freeUse: boolean
  id: string
}

export interface IBoostStore {
  boostHistory: IBoost[]
}

export interface BoostUserDoc {
  lastBoostExpirationUnixTime: number
  activeBoost: boolean
}
