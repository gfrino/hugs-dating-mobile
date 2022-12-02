import React, { useRef, useState } from 'react'
import { Modal, View, SafeAreaView } from 'react-native'
import PropTypes from 'prop-types'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useTheme, useTranslations } from 'dopenative'
import MapView, { Region } from 'react-native-maps'
import * as Location from 'expo-location'
import TextButton from 'react-native-button'
import dynamicStyles from './styles'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { GOOGLE_MAPS_API_KEY } from '../../../config'

const locationDelta = { latitudeDelta: 0.085, longitudeDelta: 0.085 }
const defaultGoogleApiKey = GOOGLE_MAPS_API_KEY

function IMLocationSelectorModal(props) {
  const { onCancel, isVisible, onDone, apiKey, defaultLocation } = props
  const [isValidAddress, setIsValidAddress] = useState(true)

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const colorSet = theme.colors[appearance]

  const { localized } = useTranslations()

  const buttonTextColor = isValidAddress
    ? colorSet.primaryForeground
    : colorSet.secondaryText

  const [region, setRegion] = useState({
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
    ...locationDelta,
  })
  const [address, setAddress] = useState(' ')

  const mapRef = useRef<MapView | null>(null)

  const onLocationChange = async location => {
    try {
      const GeoAddresses = await Location.reverseGeocodeAsync(location)
      if (!GeoAddresses[0] || GeoAddresses[0].country === null) {
        setIsValidAddress(false)
        return
      }
      setIsValidAddress(true)
      const formatted_address = `${GeoAddresses[0].city}, ${GeoAddresses[0].region}.`
      setAddress(formatted_address)
    } catch (error) {
      console.log(error)
      setAddress('')
    }
  }

  const setLocationDetails = (data, details) => {
    const { geometry, name } = details
    if (geometry) {
      mapRef.current.animateToRegion({
        longitude: geometry.location.lng,
        latitude: geometry.location.lat,
        ...locationDelta,
      })
    }

    if (name) {
      setAddress(name)
    }
  }

  const onRegionChangeComplete = (location: Region) => {
    setRegion(location)
    onLocationChange(location)
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onCancel}>
      <SafeAreaView style={styles.container}>
        <View style={styles.navBarContainer}>
          <View style={styles.leftButtonContainer}>
            <TextButton style={styles.buttonText} onPress={onCancel}>
              {localized('Cancel')}
            </TextButton>
          </View>
          <View style={styles.navBarTitleContainer} />

          <View style={styles.rightButtonContainer}>
            <TextButton
              style={[styles.buttonText, { color: buttonTextColor }]}
              disabled={!isValidAddress}
              onPress={() =>
                isValidAddress ? onDone(address, region) : () => null
              }>
              {localized('Done')}
            </TextButton>
          </View>
        </View>
        <GooglePlacesAutocomplete
          placeholder={localized('Enter location address')}
          minLength={2} // minimum length of text to search
          listViewDisplayed={false} // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            const { formatted_address } = details
            setAddress(formatted_address)
            setLocationDetails(data, details)
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: apiKey || defaultGoogleApiKey,
            language: 'en',
          }}
          suppressDefaultStyles={true}
          styles={{
            container: styles.placesAutocompleteContainer,
            textInputContainer: styles.placesAutocompleteTextInputContainer,
            textInput: styles.placesAutocompleteTextInput,
            description: styles.placesAutocompletedDescription,
            predefinedPlacesDescription: styles.predefinedPlacesDescription,
            poweredContainer: styles.predefinedPlacesPoweredContainer,
            listView: styles.placesAutocompleteListView,
            row: styles.placesAutocompleteRow,
          }}
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
          }}
          GooglePlacesDetailsQuery={{
            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
            fields: 'formatted_address,geometry',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          enablePoweredByContainer={false}
        />
        <View style={[styles.mapContainer]}>
          <MapView
            style={{ flex: 1 }}
            ref={mapRef}
            initialRegion={region}
            onRegionChangeComplete={onRegionChangeComplete}
          />
          <View style={styles.markerContainer}>
            <FontAwesome name="map-pin" size={24} color="#cb1e1e" />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default IMLocationSelectorModal
