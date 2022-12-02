import React, { useState, useLayoutEffect } from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslations } from 'dopenative'
import MapView, { Marker } from 'react-native-maps'
import styles from './styles'

function IMVendorMapScreen({ navigation, route }) {
  const vendors = useSelector(state => state.vendor.vendors)
  const vendorRouteName = route.params?.vendorRouteName

  const { localized } = useTranslations()

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: localized('Vendors'),
      headerRight: () => <Text />,
    })
  }, [vendors])

  const onPressMarkerItem = item => {
    navigation.navigate(vendorRouteName ?? 'SingleVendor', {
      vendor: item,
    })
  }

  const renderMarker = (marker, index) => {
    if (marker?.latitude && marker?.longitude) {
      return (
        <Marker
          key={`${index}`}
          onPress={() => onPressMarkerItem(marker)}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          title={marker.title}
        />
      )
    }
  }

  return (
    <View style={styles.container}>
      <MapView region={region} style={styles.map} customMapStyle={mapStyle}>
        {vendors?.length > 0 && vendors.map(renderMarker)}
      </MapView>
    </View>
  )
}

const mapStyle = [
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
]

export default IMVendorMapScreen
