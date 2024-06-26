import React, { useState } from 'react'
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Button from 'react-native-button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import TNActivityIndicator from '../../../truly-native/TNActivityIndicator'
import TNProfilePictureSelector from '../../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector'
import { setUserData } from '../../redux/auth'
import { localizedErrorMessage } from '../../api/ErrorCode'
import TermsOfUseView from '../../components/TermsOfUseView'
import { useOnboardingConfig } from '../../hooks/useOnboardingConfig'
import { useAuth } from '../../hooks/useAuth'
import { BoostStoreCreators } from '../../../boost/redux'

const SignupScreen = props => {
  const { navigation } = props
  const authManager = useAuth()
  const dispatch = useDispatch()

  const { config } = useOnboardingConfig()
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [inputFields, setInputFields] = useState({})

  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const validateEmail = text => {
    let reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(String(text).toLowerCase()) ? true : false
  }

  const validatePassword = text => {
    let reg = /^(?=.*[A-Z])(?=.*[a-z])/
    return reg.test(String(text)) ? true : false
  }

  const trimFields = fields => {
    var trimmedFields = {}
    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        trimmedFields[key] = fields[key].trim()
      }
    })
    return trimmedFields
  }

  const onRegister = async () => {
    const { error: usernameError } =
      await authManager.validateUsernameFieldIfNeeded(inputFields, config)
    if (usernameError) {
      Alert.alert('', localized(usernameError), [{ text: localized('OK') }], {
        cancelable: false,
      })
      setInputFields(prevFields => ({
        ...prevFields,
        password: '',
      }))
      return
    }

    if (!validateEmail(inputFields?.email?.trim())) {
      Alert.alert(
        '',
        localized('Please enter a valid email address.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      return
    }

    if (inputFields?.password?.trim() == '') {
      Alert.alert(
        '',
        localized('Password cannot be empty.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      setInputFields(prevFields => ({
        ...prevFields,
        password: '',
      }))
      return
    }

    if (inputFields?.password?.trim()?.length < 6) {
      Alert.alert(
        '',
        localized(
          'Password is too short. Please use at least 6 characters for security reasons.',
        ),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      setInputFields(prevFields => ({
        ...prevFields,
        password: '',
      }))
      return
    }

    // if (!validatePassword(password)) {
    //   Alert.alert(
    //     '',
    //     localized(
    //       'The password must contain at least one uppercase and lowercase letter',
    //     ),
    //     [{ text: localized('OK') }],
    //     {
    //       cancelable: false,
    //     },
    //   );
    //   setPassword('');
    //   return;
    // };

    setLoading(true)

    const userDetails = {
      ...trimFields(inputFields),
      photoFile: profilePictureFile,
      appIdentifier: config.appIdentifier,
    }
    if (userDetails.username) {
      userDetails.username = userDetails.username?.toLowerCase()
    }

    authManager
      .createAccountWithEmailAndPassword(userDetails, config)
      .then(response => {
        const user = response.user
        dispatch(BoostStoreCreators.setMonthlyHistory([]))
        if (user) {
          dispatch(setUserData({ user }))
          const hasCategory = user.userCategory ? true : false
          Keyboard.dismiss()
          navigation.reset({
            index: 0,
            routes: [
              {
                name: hasCategory ? 'MainStack' : 'PickCategory',
                params: { user },
              },
            ],
          })
        } else {
          setLoading(false)
          Alert.alert(
            '',
            localizedErrorMessage(response.error, localized),
            [{ text: localized('OK') }],
            {
              cancelable: false,
            },
          )
        }
      })
  }

  const onChangeInputFields = (text, key) => {
    setInputFields(prevFields => ({
      ...prevFields,
      [key]: text,
    }))
  }

  const renderInputField = (field, index) => {
    return (
      <TextInput
        key={index?.toString()}
        style={styles.InputContainer}
        placeholder={field.placeholder}
        placeholderTextColor="#aaaaaa"
        secureTextEntry={field.secureTextEntry}
        onChangeText={text => onChangeInputFields(text, field.key)}
        value={inputFields[field.key]}
        keyboardType={field.type}
        underlineColorAndroid="transparent"
        autoCapitalize={field.autoCapitalize}
      />
    )
  }

  const renderSignupWithEmail = () => {
    return (
      <>
        {config.signupFields.map(renderInputField)}
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}>
          {localized('Sign Up')}
        </Button>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        contentInset={{ bottom: 8 }}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backArrowStyle} source={theme.icons.backArrow} />
        </TouchableOpacity>
        <Text style={styles.title}>{localized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureFile={setProfilePictureFile}
          profilePictureURL={''}
        />
        {renderSignupWithEmail()}
        {config.isSMSAuthEnabled && (
          <>
            <Text style={styles.orTextStyle}>{localized('OR')}</Text>
            <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() => navigation.navigate('Sms', { isSigningUp: true })}>
              {localized('Sign up with phone number')}
            </Button>
          </>
        )}
        <TermsOfUseView
          tosLink={config.tosLink}
          privacyPolicyLink={config.privacyPolicyLink}
          style={styles.tos}
        />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator />}
    </View>
  )
}

export default SignupScreen
