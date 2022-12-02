import { useState, useEffect } from 'react'
import { subscribeCategoryVendors as subscribeCategoryVendorsAPI } from './FirebaseVendorClient'

const useCategoryVendors = (vendorsTableName, categoryID) => {
  const [categoryVendors, setCategoryVendors] = useState()

  useEffect(() => {
    const unsubscribeCategoryVendors = subscribeCategoryVendorsAPI(
      vendorsTableName,
      categoryID,
      onCategoryVendorsUpdate,
    )
    return unsubscribeCategoryVendors
  }, [])

  const onCategoryVendorsUpdate = list => {
    setCategoryVendors(list)
  }

  return { categoryVendors }
}

export default useCategoryVendors
