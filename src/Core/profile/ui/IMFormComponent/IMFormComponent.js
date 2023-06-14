import PropTypes from 'prop-types'
import React, { Fragment, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import { useSelector } from 'react-redux'
import IMLocationSelectModal from '../../../location/IMLocationSelectorModal/IMLocationSelectorModal'
import { truncate } from 'lodash'

function IMFormComponent(props) {
  const { form, initialValuesDict, onFormChange, onFormButtonPress } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [alteredFormDict, setAlteredFormDict] = useState({})
  const [currentAddress, setCurrentAddress] = useState(
    initialValuesDict.address || '',
  )

  const isPremium = useSelector(state => state.inAppPurchase.isPlanActive)
  // const isPremium = useSelector(state => true)  //:TODO All User isPremium CHECK THIS
  const [selectedUserCategory, setSelectedUserCategory] = useState(
    initialValuesDict.userCategory ||
    initialValuesDict.category_preference ||
    'all',
  )

  const onFormFieldValueChange = (formField, value) => {
    var newFieldsDict = { ...alteredFormDict }
    newFieldsDict[formField.key] = value
    console.log("newFieldsDict", newFieldsDict)
    setAlteredFormDict(newFieldsDict)
    onFormChange(newFieldsDict)
    if (
      formField.key === 'userCategory' ||
      formField.key === 'category_preference'
    ) {
      setSelectedUserCategory(value)
    }
  }

  const renderSwitchField = (switchField, index) => {
    return (
      <View
        key={index}
        style={[styles.settingsTypeContainer, styles.appSettingsTypeContainer]}>
        <Text style={styles.text}>{switchField.displayName}</Text>
        <Switch
          value={computeValue(switchField)}
          onValueChange={value => onFormFieldValueChange(switchField, value)}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>
    )
  }

  const renderTextField = (formTextField, index, totalLen) => {
    return (
      <View key={index}>
        <View
          style={[
            styles.settingsTypeContainer,
            styles.appSettingsTypeContainer,
          ]}>
          <Text style={styles.text}>{formTextField.displayName}</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={[styles.text, { textAlign: 'right', flex: 1 }]}
            editable={formTextField.editable}
            onChangeText={text => {
              onFormFieldValueChange(formTextField, text)
            }}
            placeholderTextColor={styles.placeholderTextColor.color}
            placeholder={formTextField.placeholder}
            value={computeValue(formTextField)}
          />
        </View>
        {index < totalLen - 1 && <View style={styles.divider} />}
      </View>
    )
  }

  const renderButtonField = (buttonField, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => onFormButtonPress(buttonField)}
        style={[styles.settingsTypeContainer, styles.appSettingsSaveContainer]}>
        <Text style={styles.settingsType}>{buttonField.displayName}</Text>
      </TouchableOpacity>
    )
  }

  const onSelectFieldPress = (selectField, ref) => {
    ref.current.show()
  }

  const onActionSheetValueSelected = (selectField, selectedIndex) => {
    if (selectedIndex < selectField.options.length) {
      const newValue = selectField.options[selectedIndex]
      onFormFieldValueChange(selectField, newValue)
    }
  }

  const renderSelectField = (selectField, index) => {
    const actionSheetRef = React.createRef()
    const isFieldAboutCategory =
      selectField.key === 'userCategory' ||
      selectField.key === 'category_preference'
    const value = isFieldAboutCategory
      ? formatUserCategory(selectedUserCategory, localized)
      : computeValue(selectField)

    const premiumAlertDesc =
      selectField.key === 'category_preference'
        ? localized('Upgrade to change category preference')
        : ''
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          selectField.key === 'category_preference'
            ? isPremium
              ? onSelectFieldPress(selectField, actionSheetRef)
              : alertUserPremiumFeature(premiumAlertDesc)
            : onSelectFieldPress(selectField, actionSheetRef)
        }}
        style={[
          styles.settingsTypeContainer,
          styles.appSettingsTypeContainer,
          {
            opacity:
              selectField.key === 'category_preference'
                ? isPremium
                  ? 1
                  : 0.5
                : 1,
          },
        ]}>
        <Text style={styles.text}>{selectField.displayName}</Text>
        <Text style={styles.text}>{value}</Text>
        <ActionSheet
          ref={actionSheetRef}
          title={selectField.displayName}
          options={[...selectField.displayOptions, localized('Cancel')]}
          cancelButtonIndex={selectField.displayOptions.length}
          onPress={selectedIndex =>
            onActionSheetValueSelected(selectField, selectedIndex)
          }
        />
      </TouchableOpacity>
    )
  }

  const renderMapField = (mapField, index) => {
    return (
      <Fragment key={index}>
        <TouchableOpacity
          style={[
            styles.settingsTypeContainer,
            styles.appSettingsTypeContainer,
            { opacity: isPremium ? 1 : 0.5 },
          ]}
          onPress={
            isPremium
              ? onMapFieldPress
              : () =>
                alertUserPremiumFeature(
                  localized(
                    'Upgrade your account to set a custom location anytime you want',
                  ),
                )
          }>
          <Text style={styles.text}>{mapField.displayName}</Text>
          <Text style={styles.text}>
            {truncate(currentAddress, { length: 32 })}
          </Text>
        </TouchableOpacity>
        <IMLocationSelectModal
          isVisible={locationSelectorVisible}
          onCancel={onLocationSelectorCancel}
          onDone={onLocationSelectorDone}
          defaultLocation={initialValuesDict.location}
        />
      </Fragment>
    )
  }
  const alertUserPremiumFeature = subtitle => {
    Alert.alert(localized('Unlock this feature!'), localized(subtitle))
  }

  const [locationSelectorVisible, setLocationSelectorVisible] = useState(false)

  const onLocationSelectorCancel = () => {
    setLocationSelectorVisible(false)
  }
  const onLocationSelectorDone = (address, region) => {
    setCurrentAddress(address)
    setAlteredFormDict(prev => ({
      ...prev,
      location: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      address,
    }))
    onFormChange({
      ...alteredFormDict,
      location: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      address,
    })
    setLocationSelectorVisible(false)
  }

  const onMapFieldPress = () => {
    setLocationSelectorVisible(true)
  }

  const renderField = (formField, index, totalLen) => {
    const type = formField.type
    if (type == 'text') {
      return renderTextField(formField, index, totalLen)
    }
    if (type == 'switch') {
      return renderSwitchField(formField, index)
    }
    if (type == 'button') {
      return renderButtonField(formField, index)
    }
    if (type == 'select') {
      return renderSelectField(formField, index)
    }
    if (type == 'map') {
      return renderMapField(formField, index)
    }
    return null
  }

  const renderSection = section => {
    return (
      <View key={section.title || 'save-btn'}>
        {section.title ? (
          <View style={styles.settingsTitleContainer}>
            <Text style={styles.settingsTitle}>{section.title}</Text>
          </View>
        ) : null}
        <View
          style={[
            styles.contentContainer,
            section.title
              ? {}
              : {
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.16,
                shadowRadius: 2,

                elevation: 2,
              },
          ]}>
          {section.fields.map((field, index) =>
            renderField(field, index, section.fields.length),
          )}
        </View>
      </View>
    )
  }

  const displayValue = (field, value) => {
    if (!field.displayOptions || !field.options) {
      return value
    }
    for (var i = 0; i < field.options.length; ++i) {
      if (i < field.displayOptions.length && field.options[i] == value) {
        return field.displayOptions[i]
      }
    }
    return value
  }

  const computeValue = field => {
    if (alteredFormDict[field.key] != null) {
      return displayValue(field, alteredFormDict[field.key])
    }
    if (initialValuesDict[field.key] != null) {
      return displayValue(field, initialValuesDict[field.key])
    }
    return displayValue(field, field.value)
  }

  return (
    <View style={styles.container}>
      {form.sections.map(section => renderSection(section))}
    </View>
  )
}

IMFormComponent.propTypes = {
  onFormChange: PropTypes.func,
}

export default IMFormComponent

const formatUserCategory = (userCategory, localized) => {
  switch (userCategory) {
    case 'motor_disabilities':
      return localized('Motor disabilities')
    case 'psychic_disability':
      return localized('Psychic disability')
    case 'sensory_disability':
      return localized('Sensory disability')
    case 'no_disabilities':
      return localized('Without disabilities')
    case 'with_disabilities':
      return localized('With disabilities')
    case 'all':
      return localized('All')
    default:
      return ''
  }
}
