export const boostConfig: Boosts = {
  freeBoostsPerMonth: {
    premium: 5,
    basic: 1,
  },
  // maxBoostTimeInSeconds: 60 * 30,
  maxBoostTimeInSeconds: 60 * 2,
}

interface Boosts {
  freeBoostsPerMonth: FreeBoostsPerMonth
  maxBoostTimeInSeconds: number
}

interface FreeBoostsPerMonth {
  premium: number
  basic: number
}
