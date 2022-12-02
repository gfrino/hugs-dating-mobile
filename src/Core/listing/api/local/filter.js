/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

import { mockFilterData } from './localData'

export const subscribeFilters = (collectionName, categoryID, callback) => {
  const filterRef = null
  callback(mockFilterData) // invoke callback(filterData) each time the filter backend changes
  // return subscribtion object
  return filterRef
}
