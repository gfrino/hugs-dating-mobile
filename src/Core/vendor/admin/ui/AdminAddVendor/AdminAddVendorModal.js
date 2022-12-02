import React, { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Text } from 'react-native'
import { useTheme } from 'dopenative'
import { useAdminVendorsMutations } from '../../api'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import MapView, { Marker } from 'react-native-maps'
import dynamicStyles from './styles'
import { useVendorAdminConfig } from '../../hooks/useVendorAdminConfig'

export default function AdminAddVendorModal({ isVisible, close }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { addVendor } = useAdminVendorsMutations()

  const submit = () => {
    const defaultRegion = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    if (name === '') {
      return
    } else if (description === '') {
      return
    } else if (region === defaultRegion) {
      return
    }

    let newVendor = {
      name,
      description,
      location: { latitude: region.latitude, longitude: region.longitude },
    }

    addVendor(newVendor)
    close()
  }

  const onPress = ({ nativeEvent }) =>
    setRegion({
      latitude: nativeEvent.coordinate.latitude,
      longitude: nativeEvent.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })

  return (
    <Modal
      onBackdropPress={() => close()}
      onBackButtonPress={() => close()}
      isVisible={isVisible}
      style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.mainText}>Name of vendor: </Text>
        <TextInput
          onChangeText={text => setName(text)}
          placeholder="Ocha eats"
          style={styles.textInput}
        />

        <Text style={styles.mainText}>Description: </Text>
        <TextInput
          onChangeText={text => setDescription(text)}
          placeholder="We provide quality dishes to you our valued customer"
          style={styles.textInput}
        />

        <Text style={styles.mainText}>Location: </Text>
        <MapView
          initialRegion={region}
          style={styles.map}
          onPress={onPress}
          //onRegionChangeComplete={newRegion => setRegion(newRegion)}
        >
          <Marker coordinate={region} />
        </MapView>

        <TouchableOpacity onPress={() => submit()}>
          <Text style={styles.button}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

AdminAddVendorModal.propTypes = {
  isVisible: PropTypes.bool,
  close: PropTypes.func,
}
