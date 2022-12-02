import { useState, useEffect } from 'react'
import { subscribeToSingleVendor as subscribeToSingleVendorAPI } from './FirebaseVendorClient'

const useSingleVendor = (vendorsTableName, vendorId) => {
  const [vendor, setVendor] = useState()

  useEffect(() => {
    const unsubscribeVendor = subscribeToSingleVendorAPI(
      vendorsTableName,
      vendorId,
      onVendorUpdate,
    )
    return unsubscribeVendor
  }, [])

  const onVendorUpdate = item => {
    setVendor(item)
  }

  return { vendor }
}

export default useSingleVendor
