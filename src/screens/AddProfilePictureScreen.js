import React, { useState } from 'react'
import { Platform, Text, View, Image, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import PropTypes from 'prop-types'
import Button from 'react-native-button'
import ActivityModal from '../components/ActivityModal'
import { firebase } from '../Core/api/firebase/config'
import ImagePicker from 'react-native-image-crop-picker'
import { useConfig } from '../config'

const AddProfilePictureScreen = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const config = useConfig()

  const currentUser = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  const [url, setUrl] = useState('')
  const [photo, setPhoto] = useState('')
  const [loading, setLoading] = useState(false)

  const uploadPromise = source => {
    const uri = source

    return new Promise(resolve => {
      let filename = uri.substring(uri.lastIndexOf('/') + 1)
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

      firebase
        .storage()
        .ref(filename)
        .putFile(uploadUri)
        .then(snapshot => {
          resolve(snapshot.downloadURL)
        })
        .catch(error => {
          setLoading(false)
          setTimeout(() => {
            alert(localized('An has error occurred, please try again.'))
          }, 1000)
        })
    })
  }

  const addPhoto = () => {
    ImagePicker.openPicker({
      cropping: false,
    })
      .then(image => {
        const source = image.path

        setPhoto(source)
        setLoading(true)

        uploadPromise(source).then(url => {
          setUrl(url)
          setLoading(false)

          let data = {
            profilePictureURL: url,
            photos: [url],
          }

          updateUserInfo(data)
          dispatch({ type: 'Login' })
        })
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
        setTimeout(() => {
          alert(localized('An error has occurred, please try again.'))
        }, 1000)
      })
  }

  const updateUserInfo = data => {
    const userRef = firebase
      .firestore()
      .collection('users')
      .doc(currentUser?.id)

    userRef
      .update(data)
      .then(() => {
        userRef
          .get()
          .then(doc => {
            return doc.data()
          })
          .then(user => {
            dispatch({ type: 'UPDATE_USER_DATA', user })
          })
      })
      .catch(error => {
        const { message } = error

        setLoading(false)
        setTimeout(() => {
          alert(localized('An error has occurred, please try again.'))
        }, 1000)

        console.log(message)
      })
  }

  const next = () => {
    props.navigation.navigate('AccountDetails', {
      lastScreen: 'AccountDetails',
      form: config.editProfileFields,
      screenTitle: localized('Edit Profile'),
    })
  }

  return (
    <View style={styles.container}>
      <ActivityModal
        loading={loading}
        title={localized('Please wait')}
        size={'large'}
        activityColor={'white'}
        titleColor={'white'}
        activityWrapperStyle={{
          backgroundColor: '#404040',
        }}
      />
      <View style={styles.logo}>
        <Text style={styles.title}>{localized('Choose Profile Photo')}</Text>
        {photo && url ? (
          <View style={styles.imageView}>
            <Image source={{ uri: photo }} style={styles.image_photo} />
          </View>
        ) : (
          <Image style={styles.cameraIcon} source={theme.icons.cameraFilled} />
        )}
      </View>
      {url ? (
        <Button
          containerStyle={styles.button}
          style={styles.text}
          onPress={() => next()}>
          {localized('Next')}
        </Button>
      ) : (
        <Button
          containerStyle={styles.button}
          style={styles.text}
          onPress={() => addPhoto()}>
          {localized('Add Profile Photo')}
        </Button>
      )}
    </View>
  )
}

AddProfilePictureScreen.propTypes = {
  navigation: PropTypes.object,
}

const dynamicStyles = (theme, appearance) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
    },
    title: {
      marginVertical: 20,
      fontSize: 20,
    },
    imageView: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      overflow: 'hidden',
      marginTop: 20,
    },
    image_photo: {
      width: '150%',
      height: '150%',
      resizeMode: 'contain',
    },
    cameraIcon: {
      marginTop: 20,
      tintColor: '#eb5a6d',
      width: 100,
      height: 100,
    },
    button: {
      width: '85%',
      backgroundColor: theme.colors[appearance].primaryForeground,
      borderRadius: 12,
      padding: 15,
      marginBottom: 50,
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors[appearance].primaryBackground,
    },
  })
}

export default AddProfilePictureScreen
