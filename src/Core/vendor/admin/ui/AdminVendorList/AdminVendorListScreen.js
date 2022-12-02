import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, FlatList, TouchableOpacity, Text } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { useAdminVendors } from '../../api'
import AdminAddVendorModal from '../AdminAddVendor/AdminAddVendorModal'
import dynamicStyles from './styles'
import Hamburger from '../../../../../components/Hamburger/Hamburger'
import { useVendorAdminConfig } from '../../hooks/useVendorAdminConfig'

export default function AdminVendorListScreen({ navigation, route }) {
  const [isVisible, setVisible] = useState(false)
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const { config } = useVendorAdminConfig()

  const { vendors } = useAdminVendors()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: localized('Restaurants'),
      headerRight: () => <Text>{''}</Text>,
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      ),
    })
  })

  const renderVendors = item => {
    return (
      <View>
        <Text style={styles.mainText}>{item.data.name}</Text>
        <Text style={styles.subText}>{item.data.description}</Text>
        <View style={styles.divider} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AdminAddVendorModal
        isVisible={isVisible}
        close={() => setVisible(false)}
        route={route}
      />
      <FlatList data={vendors} renderItem={({ item }) => renderVendors(item)} />
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={styles.button}>{localized('Add new')}</Text>
      </TouchableOpacity>
    </View>
  )
}
