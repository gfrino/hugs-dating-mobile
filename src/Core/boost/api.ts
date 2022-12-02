import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore'
import { getCurrMonthUnixTimeStamp } from '../helpers/timeFormat'
import { IBoost } from './types'
const boostHistoryRef = firestore().collection('boostHistory')

const initUserBoosterCallable = functions().httpsCallable('initUserBooster')

export const initUserBooster = async () => {
  try {
    const response = await initUserBoosterCallable()
    const data = response.data
    console.log('initUserBooster response:', data)
    return data
  } catch (error) {
    console.error('ERROR [initUserBooster]', error)
    throw new Error(error.message)
  }
}

export const fetchBoostHistoryThisMonth = async (userID: string) => {
  const currMonthUnixTimestamp = getCurrMonthUnixTimeStamp()
  const query = boostHistoryRef
    .where('userID', '==', userID)
    .where('createdAt', '>=', currMonthUnixTimestamp)
  try {
    const querySnapshot = await query.get()
    const boostHistory = querySnapshot.docs.map(
      boostDoc =>
        ({
          ...boostDoc.data(),
          id: boostDoc.id,
        } as IBoost),
    )

    return boostHistory
  } catch (e) {
    console.error('ERROR [fetchBoostHistoryThisMonth]', e, JSON.stringify(e))
    return null
  }
}
