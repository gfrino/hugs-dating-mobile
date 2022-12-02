import {
  deleteVendor as deleteVendorAPI,
  updateVendor as updateVendorAPI,
} from './FirebaseVendorClient'

const useVendorsMutations = vendorsTableName => {
  const deleteVendor = vendorId => {
    return deleteVendorAPI(vendorsTableName, vendorId)
  }

  const updateVendor = (
    vendor,
    uploadObject,
    photoUrls,
    location,
    callback,
  ) => {
    return updateVendorAPI(
      vendorsTableName,
      vendor,
      uploadObject,
      photoUrls,
      location,
      callback,
    )
  }

  return { deleteVendor, updateVendor }
}

export default useVendorsMutations
