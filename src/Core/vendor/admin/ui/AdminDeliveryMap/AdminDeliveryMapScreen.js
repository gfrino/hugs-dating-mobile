import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import DeliverIcon from '../../../../../../assets/icons/deliver.png'
import styles from './styles'
import { useAdminDeliveryMapMarkers } from '../../api'

export default function AdminDeliveryMapScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const { markers } = useAdminDeliveryMapMarkers()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Delivery',
      headerTitle: 'MapScreen',
      headerRight: () => <Text />,
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <MapView region={region} style={styles.map} customMapStyle={mapStyle}>
        {markers.map(marker => (
          <Marker
            coordinate={{
              latitude: marker.data.location.lat,
              longitude: marker.data.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            image={DeliverIcon}
            title={'Delivery of your burger king'}
          />
        ))}
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
