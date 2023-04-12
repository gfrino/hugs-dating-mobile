import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native'
import Swiper from 'react-native-swiper'
import { useTheme, useTranslations } from 'dopenative'
import { firebase } from '../../Core/api/firebase/config'
import { storageAPI } from '../../Core/media'
import ImagePicker from 'react-native-image-crop-picker'
import ImageView from 'react-native-image-view';
import ActionSheet from 'react-native-actionsheet'
import FastImage from 'react-native-fast-image'
import ActivityModal from '../../components/ActivityModal'
import { logout } from '../../Core/onboarding/redux/auth'
import { setUserData } from '../../Core/onboarding/redux/auth'
import { TNProfilePictureSelector } from '../../Core/truly-native'
import dynamicStyles from './styles'
import { useIap } from '../../Core/inAppPurchase/context'
import { useConfig } from '../../config'
import { useAuth } from '../../Core/onboarding/hooks/useAuth'
import { getDefaultProfilePicture } from '../../helpers/statics'
import BoostOption from './options/Boost'

const MyProfileScreen = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const config = useConfig()
  const authManager = useAuth()

  const [loading, setLoading] = useState(false)

  const [myphotos, setMyphotos] = useState([])

  const [showPhotoSelectedInFullScreen, setShowSelectedPhotoInFullScreen] = useState(false);
  const photoSelectedForFullScreen = useRef();

  const { setSubscriptionVisible } = useIap()
  const photoDialogActionSheetRef = useRef(null)
  const photoUploadDialogActionSheetRef = useRef(null)

  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.auth.user)
  const userGender = useSelector(
    state => state.auth.user.settings?.gender || null,
  )

  var selectedItemIndex = -1

  const updatePhotos = photos => {
    let myUpdatePhotos = []
    let pphotos = photos ? [...photos] : []
    let temp = []

    pphotos.push({ add: true })
    pphotos.map((item, index) => {
      temp.push(item)

      if (index % 6 == 5) {
        myUpdatePhotos.push(temp)
        temp = []
      } else if (item && item.add) {
        myUpdatePhotos.push(temp)
        temp = []
      }
    })

    setMyphotos(myUpdatePhotos)
    selectedItemIndex = -1
  }

  useEffect(() => {
    if (currentUser) {
      updatePhotos(currentUser.photos)
    }

    StatusBar.setHidden(false)
  }, [])

  const detail = () => {
    props.navigation.navigate('AccountDetails', {
      form: config.editProfileFields,
      screenTitle: localized('Edit Profile'),
    })
  }

  const onUpgradeAccount = () => {
    setSubscriptionVisible(true)
  }

  const setting = () => {
    props.navigation.navigate('Settings', {
      userId: currentUser.id,
      form: config.userSettingsFields,
      screenTitle: localized('Settings'),
    })
  }

  const contact = () => {
    props.navigation.navigate('ContactUs', {
      form: config.contactUsFields,
      screenTitle: localized('Contact Us'),
    })
  }

  const blocked = () => {
    props.navigation.navigate('BlockedUsers')
  }

  const onLogout = () => {
    authManager?.logout(currentUser)
    dispatch(logout())
    props.navigation.navigate('LoadScreen')
  }

  const onSelectAddPhoto = () => {
    photoUploadDialogActionSheetRef.current.show()
  }

  const onPhotoUploadDialogDone = index => {
    if (index == 0) {
      onLaunchCamera()
    }

    if (index == 1) {
      onOpenPhotos()
    }
  }

  const updateUserPhotos = uri => {
    const { photos } = currentUser
    let pphotos = photos ? photos : []

    pphotos.push(uri)

    const data = {
      photos: pphotos,
    }

    updateUserInfo(data)
    updatePhotos(pphotos)
  }

  const onLaunchCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then(image => {
      startUpload(image, updateUserPhotos)
    })
  }

  const onOpenPhotos = () => {
    ImagePicker.openPicker({
      cropping: false,
      multiple: true
    })
      .then(images => {
        for (image in images) {
          // console.log(images[image]);
          startUpload(images[image], updateUserPhotos)
          // console.log("+++++++++");
        }

        // startUpload(image, updateUserPhotos)
      })
      .catch(error => {
        console.log(error)
        setTimeout(() => {
          alert(
            localized(
              'An errord occurred while loading image. Please try again.',
            ),
          )
        }, 1000)
      })
  }

  const startUpload = (source, updateUserData) => {
    setLoading(true)

    if (!source) {
      updateUserData(null)
      return
    }

    storageAPI
      .processAndUploadMediaFile(source)
      .then(({ downloadURL }) => {
        if (downloadURL) {
          updateUserData(downloadURL)
        } else {
          // an error occurred
          setLoading(false)
        }
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }

  const updateUserInfo = data => {
    const userRef = firebase.firestore().collection('users').doc(currentUser.id)

    const tempUser = currentUser
    // optimistically update the UI
    dispatch(setUserData({ user: { ...currentUser, ...data } }))
    userRef
      .update(data)
      .then(() => {
        setLoading(false)
      })
      .catch(error => {
        const { message } = error
        setLoading(false)
        dispatch(setUserData({ user: { ...tempUser } }))
        console.log('upload error', error)
      })
  }

  const updateProfilePictureURL = file => {
    startUpload(file, uri => updateUserInfo({ profilePictureURL: uri }))
  }

  const onSelectDelPhoto = index => {
    selectedItemIndex = index
    photoDialogActionSheetRef.current.show()
  }

  const onPhotoDialogDone = actionSheetActionIndex => {
    const { photos } = currentUser

    if (selectedItemIndex == -1 || selectedItemIndex >= photos.length) {
      return
    }

    if (actionSheetActionIndex == 0) {
      if (photos) {
        photos.splice(selectedItemIndex, 1)
      }

      updateUserInfo({ photos })
      updatePhotos(photos)
    }

    if (actionSheetActionIndex == 2) {
      const photoToUpdate = photos[selectedItemIndex]
      updateUserInfo({ profilePictureURL: photoToUpdate })
    }

    if (actionSheetActionIndex === 3) {
      const selectedPhoto = photos[selectedItemIndex];

      setShowSelectedPhotoInFullScreen(true);
      photoSelectedForFullScreen.current = selectedPhoto;
    }
  }

  const { firstName, lastName, profilePictureURL } = currentUser
  const userLastName = currentUser && lastName ? lastName : ' '
  const userfirstName = currentUser && firstName ? firstName : ' '

  const profilePicUrl =
    profilePictureURL || getDefaultProfilePicture(currentUser.userCategory)

  const Leaves_BG = theme.icons.Leaves_BG

  return (
    <View style={styles.MainContainer}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.MainContainer}>
          <ImageBackground
            style={{
              position: 'absolute',
              right: 0,
              width: '100%',
              height: '100%',
              bottom: 0,
              opacity: 0.225
            }}
            source={Leaves_BG}
            resizeMode="cover"
          />
          <ScrollView style={styles.body}>
            <View style={styles.profilePictureContainer}>
              <TNProfilePictureSelector
                setProfilePictureFile={updateProfilePictureURL}
                profilePictureURL={profilePicUrl}
                key={profilePicUrl}
              />
            </View>
            <View style={styles.nameView}>
              <Text style={styles.name}>
                {userfirstName + ' ' + userLastName}
              </Text>
            </View>
            <View
              style={[
                styles.myphotosView,
                myphotos[0] && myphotos[0].length <= 3
                  ? { height: 158 }
                  : { height: 268 },
              ]}>
              <View style={styles.itemView}>
                <Text style={styles.photoTitleLabel}>
                  {localized('My Photos')}
                </Text>
              </View>
              <Swiper
                removeClippedSubviews={false}
                showsButtons={false}
                loop={false}
                paginationStyle={{ top: -230, left: null, right: 0 }}
                dot={<View style={styles.inactiveDot} />}
                activeDot={
                  <View
                    style={{
                      backgroundColor: '#db6470',
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  />
                }>
                {myphotos.map((photos, i) => (
                  <View key={'photos' + i} style={styles.slide}>
                    <View style={styles.slideActivity}>
                      <FlatList
                        horizontal={false}
                        numColumns={3}
                        data={photos}
                        scrollEnabled={false}
                        renderItem={({ item, index }) =>
                          item.add ? (
                            <TouchableOpacity
                              key={'item' + index}
                              style={[
                                styles.myphotosItemView,
                                {
                                  backgroundColor:
                                    theme.colors[appearance].primaryForeground,
                                },
                              ]}
                              onPress={onSelectAddPhoto}>
                              <Image
                                style={styles.icon}
                                source={theme.icons.cameraFilled}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              key={'item' + index}
                              style={styles.myphotosItemView}
                              onPress={() => onSelectDelPhoto(i * 6 + index)}>
                              <FastImage
                                style={{ width: '100%', height: '100%' }}
                                source={{ uri: item }}
                              />
                            </TouchableOpacity>
                          )
                        }
                      />
                    </View>
                  </View>
                ))}
              </Swiper>
            </View>
            <TouchableOpacity style={styles.optionView} onPress={detail}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#687cf0',
                    resizeMode: 'cover',
                  }}
                  source={theme.icons.account}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>
                  {localized('Account Details')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionView}
              onPress={onUpgradeAccount}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'cover',
                  }}
                  source={theme.icons.vip}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>
                  {localized('Upgrade account')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionView} onPress={setting}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#9a91c4',
                    resizeMode: 'cover',
                  }}
                  source={theme.icons.setting}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>{localized('Settings')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionView} onPress={contact}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#88e398',
                    resizeMode: 'cover',
                  }}
                  source={theme.icons.callIcon}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>{localized('Contact Us')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionView} onPress={blocked}>
              <View style={styles.iconView}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: '#9a91c4',
                    resizeMode: 'cover',
                  }}
                  source={theme.icons.blockedUser}
                />
              </View>
              <View style={styles.textView}>
                <Text style={styles.textLabel}>
                  {localized('Blocked Users')}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutView} onPress={onLogout}>
              <Text style={styles.textLabel}>{localized('Logout')}</Text>
            </TouchableOpacity>
          </ScrollView>
          <ActionSheet
            ref={photoDialogActionSheetRef}
            title={localized('Photo Dialog')}
            options={[
              localized('Remove Photo'),
              localized('Cancel'),
              localized('Make Profile Picture'),
              localized('Display in Full Screen'),
            ]}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={onPhotoDialogDone}
          />
          <ActionSheet
            ref={photoUploadDialogActionSheetRef}
            title={localized('Photo Upload')}
            options={[
              localized('Launch Camera'),
              localized('Open Photo Gallery'),
              localized('Cancel'),
            ]}
            cancelButtonIndex={2}
            onPress={onPhotoUploadDialogDone}
          />
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

          <ImageView
            images={[{ source: { uri: photoSelectedForFullScreen.current } }]}
            imageIndex={0}
            isVisible={photoSelectedForFullScreen && showPhotoSelectedInFullScreen}
            onClose={() => setShowSelectedPhotoInFullScreen(false)}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default MyProfileScreen
