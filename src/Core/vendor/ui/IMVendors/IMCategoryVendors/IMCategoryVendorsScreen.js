import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslations } from 'dopenative'
import IMVendorsScreen from '../IMVendorsScreen'

export function IMCategoryVendorsScreen({ route, navigation }) {
  const category = route?.params?.category
  const vendors = useSelector(state => state.vendor.vendors)

  const { localized } = useTranslations()

  const [foods, setVendors] = useState([])

  useEffect(() => {
    let vendorCategoryList = vendors.filter(
      vendorItem => vendorItem.categoryID === category?.id,
    )
    setVendors(vendorCategoryList)
  }, [category, vendors])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route?.params?.category
        ? `${route?.params?.category.title}`
        : localized('Home'),
      headerRight: () => <View />,
    })
  }, [navigation])

  return <IMVendorsScreen navigation={navigation} vendors={foods} />
}
