export default class IMVendorListAPI {
  /**
   * Constructor call
   * @param {object} table - app collection table configuration
   * @param {function} callback - function to be called when a vendor list is available or updated.
   */
  constructor(table, callback) {
    this.callback = callback
  }

  /**
   * unsubscribe from the list of vendors
   */
  unsubscribe() {}

  /**
   * Subscribe to a category list of vendor
   * @param {string} categoryID - a category id
   * @param {function} callback - function to be called when the category list of vendor is available or updated.
   */
  subscribeCategoryVendors(categoryID, callback) {
    if (!categoryID) {
      return
    }
    callback([])
  }

  /**
   * Subscribe to a category list of vendor
   * @param {string} vendorId - a vendor id
   * @returns {function}  a vendor .
   */
  getVendor = async vendorId => {
    if (!vendorId) {
      return null
    }
    return {}
  }

  /**
   * Subscribe to a single  vendor
   * @param {string} vendorId - a vendor id
   * @param {function}  {function} callback  function to be called when the vendor is available or updated.
   */
  subscribeVendor = async (vendorId, callback) => {
    if (!vendorId) {
      return () => {}
    }
    callback([])
  }

  /**
   * Update to a single  vendor
   * @param {object} vendor - the vendor object
   * @param {string} uploadObject - thea updated vendor fields object
   * @param {string} photoUrls - the list of photo Urls for the vendor
   * @param {string} location - the location of the vendor
   * @param {function}  {function} callback  function to be called with an object of success.
   */
  updateVendor = (vendor, uploadObject, photoUrls, location, callback) => {
    callback({ success: true })
  }

  /**
   * Delete to a single  vendor
   * @param {string} vendorId - a vendor id
   */
  deleteVendor = async vendorId => {
    if (!vendorId) {
      return null
    }
  }
}
