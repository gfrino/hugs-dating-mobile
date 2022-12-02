import { StyleSheet } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorSet.primaryBackground,
    },
    //
    navBarContainer: {
      flexDirection: 'row',
      position: 'absolute',
      justifyContent: 'center',
      ...ifIphoneX(
        {
          top: 50,
        },
        {
          top: 12,
        },
      ),
      paddingVertical: 10,
      // height: 25,
      width: '100%',
      paddingHorizontal: 10,
      backgroundColor: colorSet.primaryBackground,
      zIndex: 1,
    },
    navBarTitleContainer: {
      flex: 5,
    },
    leftButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 14,
      color: colorSet.primaryForeground,
      fontWeight: '600',
    },
    // GooglePlacesAutocomplete
    placesAutocompleteContainer: {
      ...ifIphoneX(
        {
          marginTop: 46,
        },
        {
          marginTop: 24,
        },
      ),
      backgroundColor: colorSet.grey0,
    },
    placesAutocompleteTextInputContainer: {
      width: '100%',
      height: 42,
      backgroundColor: colorSet.primaryBackground,
      paddingHorizontal: 8,
      borderBottomWidth: 0,
      borderTopWidth: 0,
    },
    placesAutocompleteTextInput: {
      backgroundColor: colorSet.primaryBackground,
      color: colorSet.primaryText,
      height: 42,
    },
    placesAutocompletedDescription: {
      fontWeight: '400',
      color: colorSet.secondaryText,
    },
    placesAutocompleteRow: {
      backgroundColor: colorSet.primaryBackground,
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: colorSet.hairline,
    },
    predefinedPlacesDescription: {
      color: colorSet.secondaryText,
    },
    predefinedPlacesPoweredContainer: {
      backgroundColor: colorSet.primaryBackground,
    },
    placesAutocompleteListView: {
      borderTopWidth: 1,
      borderTopColor: colorSet.hairline,
    },
    mapContainer: {
      flex: 1,
      backgroundColor: colorSet.grey0,
    },
    markerContainer: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      zIndex: 1,
    },
  })
}

export default dynamicStyles
