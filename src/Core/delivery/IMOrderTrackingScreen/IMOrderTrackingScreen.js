import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Text, View, Dimensions, Image, ScrollView } from 'react-native'
import { Bar } from 'react-native-progress'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { useSingleOrder } from '../api'
import IMDeliveryView from '../IMDelivery/IMDeliveryView'
import FastImage from 'react-native-fast-image'
import { getDirections, getETA } from '../api/directions'
import { useDeliverConfig } from '../hooks/useDeliveryConfig'

export default function IMOrderTrackingScreen({ navigation, route }) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { config } = useDeliverConfig()

  const item = route.params.item
  const [eta, setEta] = useState(0)
  const [region, setRegion] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])

  const { order } = useSingleOrder(item)

  const { width } = Dimensions.get('screen')

  const stages = [
    'Order Placed',
    'Order Shipped',
    'In Transit',
    'Order Completed',
  ]

  const computeETA = async () => {
    const preparingTime = 900

    if (
      (order.status === 'Order Placed' ||
        order.status === 'Driver Pending' ||
        order.status === 'Driver Accepted' ||
        order.status === 'Driver Rejected') &&
      order.address &&
      order.author
    ) {
      const eta = await getETA(
        { latitude: order.vendor.latitude, longitude: order.vendor.longitude },
        order.address.location ? order.address.location : order.author.location,
        config.googleAPIKey,
      )
      setEta(2 * eta + preparingTime)
      return
    }
    if (order.driver && order.vendor && order.address) {
      if (order.status === 'Order Shipped') {
        // ETA = 2 * (driver_to_restaurant + restaurant_to_customer)
        const eta1 = await getETA(
          order.driver.location,
          {
            latitude: order.vendor.latitude,
            longitude: order.vendor.longitude,
          },
          config.googleAPIKey,
        )
        const eta2 = await getETA(
          {
            latitude: order.vendor.latitude,
            longitude: order.vendor.longitude,
          },
          order.address.location
            ? order.address.location
            : order.author.location,
          config.googleAPIKey,
        )
        setEta(eta1 + eta2 + preparingTime)
        return
      }
      if (order.status === 'In Transit') {
        const eta = await getETA(
          order.driver.location,
          order.address.location,
          config.googleAPIKey,
        )
        setEta(eta)
        return
      }
    }
    setEta(0)
  }

  const computePolylineCoordinates = () => {
    if (!order) {
      // invalid order
      return
    }
    const driver = order.driver
    const author = order.author
    const vendor = order.vendor
    const address = order.address

    if (order.status === 'Order Shipped' && vendor && driver) {
      // Driver has been allocated, and they're driving to pick up the order from the vendor location
      const sourceCoordinate = {
        latitude: driver.location?.latitude,
        longitude: driver.location?.longitude,
      }
      const destCoordinate = {
        latitude: vendor.latitude,
        longitude: vendor.longitude,
      }
      getDirections(
        sourceCoordinate,
        destCoordinate,
        config.googleAPIKey,
        coordinates => {
          const pointOfInterests = [
            sourceCoordinate,
            ...coordinates,
            destCoordinate,
          ]
          setRouteCoordinates(coordinates)
          centerMap(pointOfInterests)
        },
      )
      return
    }

    if (order.status === 'In Transit' && vendor && driver) {
      // Driver has picked up the order from the vendor, and now they're delivering it to the shipping address
      const sourceCoordinate = {
        latitude: driver.location?.latitude,
        longitude: driver.location?.longitude,
      }
      const destLocation = address ? address.location : author.location
      const destCoordinate = {
        latitude: destLocation.latitude,
        longitude: destLocation.longitude,
      }
      getDirections(
        sourceCoordinate,
        destCoordinate,
        config.googleAPIKey,
        coordinates => {
          const pointOfInterests = [
            sourceCoordinate,
            ...coordinates,
            destCoordinate,
          ]
          setRouteCoordinates(coordinates)
          centerMap(pointOfInterests)
        },
      )
      return
    }
  }

  const centerMap = pointOfInterests => {
    var maxLatitude = -400
    var minLatitude = 400
    var maxLongitude = -400
    var minLongitude = 400
    pointOfInterests.forEach(coordinate => {
      if (maxLatitude < coordinate.latitude) maxLatitude = coordinate.latitude
      if (minLatitude > coordinate.latitude) minLatitude = coordinate.latitude
      if (maxLongitude < coordinate.longitude)
        maxLongitude = coordinate.longitude
      if (minLongitude > coordinate.longitude)
        minLongitude = coordinate.longitude
    })

    setRegion({
      latitude: (maxLatitude + minLatitude) / 2,
      longitude: (maxLongitude + minLongitude) / 2,
      latitudeDelta: Math.abs(
        (maxLatitude - (maxLatitude + minLatitude) / 2) * 4,
      ),
      longitudeDelta: Math.abs(
        (maxLongitude - (maxLongitude + minLongitude) / 2) * 4,
      ),
    })
  }

  useEffect(() => {
    computeETA()
    computePolylineCoordinates()
  }, [order?.status])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized('Your Order'),
      headerRight: () => <View />,
    })
  }, [navigation])

  var deliveryDate = new Date()
  if (eta > 0) {
    deliveryDate.setSeconds(deliveryDate.getSeconds() + eta)
  }

  var latestArrivalDate = new Date()
  latestArrivalDate.setSeconds(latestArrivalDate.getSeconds() + eta + 20 * 60)

  const etaString =
    eta > 0
      ? (deliveryDate.getHours() < 10
          ? '0' + deliveryDate.getHours()
          : deliveryDate.getHours()) +
        ':' +
        (deliveryDate.getMinutes() < 10
          ? '0' + deliveryDate.getMinutes()
          : deliveryDate.getMinutes())
      : ''
  var latestArrivalString =
    eta > 0
      ? (latestArrivalDate.getHours() < 10
          ? '0' + latestArrivalDate.getHours()
          : latestArrivalDate.getHours()) +
        ':' +
        (latestArrivalDate.getMinutes() < 10
          ? '0' + latestArrivalDate.getMinutes()
          : latestArrivalDate.getMinutes())
      : ''

  const tempIndex = stages.indexOf(order.status)
  const stagesIndex = tempIndex === -1 ? 0 : tempIndex

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        {order.status == 'Order Completed' ? (
          <View style={styles.upperPane}>
            <Text style={styles.time}>{localized('Order Delivered')}</Text>
          </View>
        ) : (
          <View style={styles.upperPane}>
            <Text style={styles.time}>{etaString}</Text>
            <Text style={styles.eta}>{localized('Estimated arrival')}</Text>
          </View>
        )}

        {order.status != 'Order Completed' && (
          <Bar
            progress={0.25 * (stagesIndex + 1)}
            color={theme.colors[appearance].primaryForeground}
            borderWidth={0}
            width={width - 20}
            unfilledColor={theme.colors[appearance].grey0}
            style={styles.bar}
          />
        )}
        <Text style={styles.prepText}>
          {order.status === 'Order Placed' ||
          order.status == 'Driver Pending' ||
          order.status === 'Driver Accepted' ||
          order.status === 'Driver Rejected'
            ? localized('Preparing your order...')
            : order.status === 'In Transit'
            ? order.driver.firstName + localized(' is heading your way')
            : order.status === 'Order Shipped'
            ? order.driver.firstName + localized(' is picking up your order')
            : ''}
        </Text>
        {order.status !== 'Order Completed' && (
          <Text style={styles.eta}>
            {localized('Latest arrival by')} {latestArrivalString}
          </Text>
        )}
        {stagesIndex == 0 && (
          <FastImage
            source={require('../../../assets/icons/prepare.png')}
            resizeMode={'contain'}
            style={styles.image}
          />
        )}
        {region &&
          (order.status === 'In Transit' ||
            order.status === 'Order Shipped') && (
            <MapView
              initialRegion={region}
              provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
              showsUserLocation={true}
              style={styles.mapStyle}>
              <Polyline coordinates={routeCoordinates} strokeWidth={5} />
              {order.driver !== undefined && (
                <Marker
                  title={order.driver.firstName}
                  coordinate={{
                    latitude: order.driver.location.latitude,
                    longitude: order.driver.location.longitude,
                  }}
                  style={styles.marker}>
                  <Image
                    source={require('../assets/car-icon.png')}
                    style={styles.mapCarIcon}
                  />
                  {/* <Text style={styles.markerTitle}>{order.driver.firstName}</Text> */}
                </Marker>
              )}
              {order.status === 'Order Shipped' && order.vendor && (
                <Marker
                  title={order.vendor.title}
                  coordinate={{
                    latitude: order.vendor.latitude,
                    longitude: order.vendor.longitude,
                  }}
                  style={styles.marker}>
                  <Image
                    source={require('../assets/destination-icon.png')}
                    style={styles.mapCarIcon}
                  />
                  {/* <Text style={styles.markerTitle}>{order.vendor.title}</Text> */}
                </Marker>
              )}

              {order.status === 'In Transit' && order.address && (
                <Marker
                  title={`${order.address?.line1} ${order.address?.line2}`}
                  coordinate={{
                    latitude: order.address.location
                      ? order.address.location.latitude
                      : order.author.location.latitude,
                    longitude: order.address.location
                      ? order.address.location.longitude
                      : order.author.location.longitude,
                  }}
                  style={styles.marker}>
                  <Image
                    source={require('../assets/destination-icon.png')}
                    style={styles.mapCarIcon}
                  />
                  {/* <Text style={styles.markerTitle}>{order.vendor.title}</Text> */}
                </Marker>
              )}
            </MapView>
          )}
        {((order?.status != 'In Transit' && order?.status != 'Order Shipped') ||
          (region &&
            (order?.status == 'In Transit' ||
              order?.status == 'Order Shipped'))) && (
          <IMDeliveryView navigation={navigation} order={order} />
        )}
      </View>
    </ScrollView>
  )
}
