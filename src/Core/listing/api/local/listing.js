/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

import { setFavoriteItems } from '../../../favorites/redux'
import { mockCategoriesData, mockListingsData } from './localData'

export const subscribeListingCategories = callback => {
  const ListingCategoriesRef = null
  callback(mockCategoriesData)
  return ListingCategoriesRef
}

/**
 *
 * @param {string} listingID the ID of the listings to be fetched from server
 * @param {function} callback the function called once the data is fetched from server
 * This method fetched the listing data from the server and passes it to the callback once the response comes back
 * It passes null if it cannot find the object in the database, or the request failed for any reason.
 */
export const fetchListing = async (listingID, callback) => {
  callback(mockListingsData[0])
}

export const subscribeListings = (
  { userId, categoryId, isApproved = true },
  favorites,
  callback,
) => {
  // check if user is logged and invoke callback(listings based on userID)
  // check if the listener is subscribed to from the category page and invoke callback(listings based on categoryID)
  const listingsRef = null
  callback(mockListingsData)
  return listingsRef
}

/**
 * This method fetched all the non-approved listings. It's used in the admin view for fetching all listings pending approval.
 * @param {function} callback - the function called once the data is fetched from server
 */

export const subscribeToUnapprovedListings = callback => {
  callback(mockListingsData)
  return null
}

export const subscribeSavedListings = (userId, callback, listingId) => {
  // check if listingId is supplied and invoke callback(savedListings) with only one listing with listingID
  // check if the listener is subscribed to from the category page and invoke callback(savedListings based on categoryID)

  const savedListingsRef = null

  callback(mockListingsData)

  return savedListingsRef
}

/**
 *
 * @param {object} listing the listing object to be saved/unsaved
 * @param {String} userId theu id of the current user
 * @param {Array} favorites the array of the current user's favorite istings
 * @param {function} dispatch the dispatch method to change favorites state
 */
export const saveUnsaveListing = async (
  listing,
  userId,
  favorites,
  dispatch,
) => {
  // remove or add items form favourites
  // update local favorites state using dispatch(setFavoriteItems(newFav));
  dispatch(setFavoriteItems(mockListingsData))
}

/**Function to remove a particular listing
 *
 * @param {integer} listingId the id of the listing to be deleted
 * @param {function} callback callback to be executed after listing has been deleted
 */
export const removeListing = async (listingId, callback) => {
  //remove a particular listing using the listingId
  // invoke callback({ success: true }); or callback({ success: false });
  callback({ success: false })
}

/**Function to approve a particular listing
 *
 * @param {integer} listingId the id of the listing to be approved
 * @param {function} callback callback to be executed after listing has been approved
 */
export const approveListing = (listingId, callback) => {
  // update a listing using the listingId and set isApproved: true
  // invoke callback({ success: true }); or callback({ success: false });
  callback({ success: false })
}

export const postListing = (
  selectedItem,
  uploadObject,
  photoUrls,
  location,
  callback,
) => {
  //save listing data on the database using the arguments
  // and call callback({ success: false }); or callback({ success: true });
  callback({ success: false })
}
