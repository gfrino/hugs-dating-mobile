import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native'
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import ImageView from 'react-native-image-view'
import { useTheme, useTranslations } from 'dopenative'
import { DEVICE_WIDTH } from '../../../helpers/statics'
import BottomTabBar from '../bottom_tab_bar'
import dynamicStyles from './styles'
import { MinimalistBTN } from '~/components/MinimalistBTN'
import { useUserReportingMutations } from '~/Core/user-reporting'
import useCurrentUser from '~/Core/onboarding/hooks/useCurrentUser'


const HIT_SLOP = { top: 15, left: 15, right: 15, bottom: 15 }

const CardDetailsView = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const user = useCurrentUser() 
  const styles = dynamicStyles(theme, appearance)
  const [firstName] = useState(props.firstName || '')
  const [lastName] = useState(props.lastName || '')
  const [age] = useState(props.age || '')
  const [school] = useState(props.school || '')
  const [distance] = useState(props.distance || '')
  const [bio] = useState(props.bio || '')
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false)
  const [tappedImageIndex, setTappedImageIndex] = useState(null)
  const [photosUpdated, setPhotosUpdated] = useState(false)
  const [swiperDotWidth, setSwiperDotWidth] = useState(null)
  const [myPhotos] = useState(
    props.instagramPhotos || [props.profilePictureURL],
  )
  const [instagramPhotos, setInstagramPhotos] = useState(
    props.instagramPhotos || [],
  )

  const { markAbuse } = useUserReportingMutations();

  const formattedDistance = distance?.split(' ')[0] || [' - ']

  const updatePhotos = photos => {
    let myphotos = []
    let temp = []

    if (photos.length > 0) {
      photos.map((item, index) => {
        item && temp.push(item)

        if (index % 6 == 5) {
          temp && myphotos.push(temp)
          temp = []
        }
      })

      myphotos.push(temp)
      setInstagramPhotos(myphotos)
      setPhotosUpdated(true)
    }
  }

  useEffect(() => {
    updatePhotos(instagramPhotos)
    setSwiperDotWidth(Math.floor(DEVICE_WIDTH / myPhotos.length) - 4)
  }, [])

  const onDislikePressed = () => {
    props.setShowMode(0)
    props.onSwipeLeft()
  }

  const onLikePressed = () => {
    props.setShowMode(0)
    props.onSwipeRight()
  }

  const onSuperLikePressed = () => {
    props.setShowMode(0)
    props.onSwipeTop()
  }

  const closeButton = () => (
    <TouchableOpacity
      hitSlop={HIT_SLOP}
      style={styles.closeButton}
      onPress={() => setIsImageViewerVisible(false)}>
      <Text style={styles.closeButton__text}>×</Text>
    </TouchableOpacity>
  )

  const formatViewerImages = () => {
    const myPhotos = []

    if (photosUpdated) {
      instagramPhotos.map(photos => {
        photos.map(photo => {
          myPhotos.push({
            source: {
              uri: photo && photo,
            },
          })
        })
      })

      return myPhotos
    } else {
      return []
    }
  }

  const onReportPress = useCallback(() => {
    const report = () => {
      markAbuse(user.id, props.uid, 'profile_report')
        .finally(onDislikePressed);
    }
    Alert.alert(
      localized('Report'),
      localized('Are you sure you want to report this user?'),
      [
        { text: localized('Cancel'), style: 'cancel' },
        { text: localized('Report'), onPress: report },
      ],
      { cancelable: true },
    );
  },[]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.body} bounces={false}>
        <View style={styles.photoView}>
          <Swiper
            style={styles.wrapper}
            removeClippedSubviews={false}
            showsButtons={false}
            loop={false}
            paginationStyle={{ top: 5, bottom: null }}
            dot={
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  width: swiperDotWidth,
                  height: 4,
                  borderRadius: 4,
                  margin: 2,
                }}
              />
            }
            activeDot={
              <View
                style={{
                  backgroundColor: 'white',
                  width: swiperDotWidth,
                  height: 4,
                  borderRadius: 4,
                  margin: 2,
                }}
              />
            }>
            {myPhotos.map((photos, i) => {
              return (
                photos && (
                  <FastImage
                    key={'photos' + i}
                    style={styles.profilePhoto}
                    resizeMode="cover"
                    source={{ uri: photos }}
                  />
                )
              )
            })}
          </Swiper>
        </View>
        <TouchableOpacity activeOpacity={1}>
          <TouchableOpacity
            style={styles.backView}
            onPress={() => props.setShowMode(0)}>
            <Image style={styles.backIcon} source={theme.icons.arrowdownIcon} />
          </TouchableOpacity>
          <View style={styles.titleView}>
            <Text style={styles.nameText}>
              {firstName} {lastName}
            </Text>
            <Text style={styles.ageText}>{age}</Text>
          </View>
          <View style={styles.captionView}>
            {school ? (
              <View style={styles.itemView}>
                <Image style={styles.icon} source={theme.icons.schoolIcon} />
                <Text style={styles.text}>{school}</Text>
              </View>
            ) : null}
            {distance ? (
              <View style={styles.itemView}>
                <Image style={styles.icon} source={theme.icons.markerIcon} />

                <Text style={[styles.text, { marginLeft: 2 }]}>
                  {formattedDistance + ' ' + localized('miles away')}
                </Text>
              </View>
            ) : null}
          </View>
          {bio ? (
            <View style={styles.bioView}>
              <Text style={styles.bioText}>{bio}</Text>
            </View>
          ) : null}
          {instagramPhotos.length > 0 && (
            <View style={styles.instagramView}>
              <View style={styles.itemView}>
                <Text style={[styles.label, { fontWeight: 'bold' }]}>
                  {localized('Photos')}
                </Text>
              </View>
              <Swiper
                showsButtons={false}
                loop={false}
                paginationStyle={{ top: -240, left: null, right: 0 }}
                dot={
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,.2)',
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  />
                }
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
                {instagramPhotos.map((photos, i) => (
                  <View key={'photos' + i} style={styles.slide}>
                    <FlatList
                      horizontal={false}
                      numColumns={3}
                      data={photos}
                      scrollEnabled={false}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          onPress={() => {
                            setIsImageViewerVisible(true)
                            setTappedImageIndex(6 * i + index)
                          }}
                          key={'item' + index}
                          style={styles.myphotosItemView}>
                          {photosUpdated && item && (
                            <FastImage
                              style={{ width: '100%', height: '100%' }}
                              source={{ uri: item }}
                            />
                          )}
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                ))}
              </Swiper>
            </View>
          )}
        <MinimalistBTN onPress={onReportPress}>Report {firstName}</MinimalistBTN>
          <View style={{ height: 120 }} />
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.inlineActionsContainer}>
        {props.bottomTabBar && (
          <BottomTabBar
            isDone={props.isDone}
            onDislikePressed={onDislikePressed}
            onSuperLikePressed={onSuperLikePressed}
            onLikePressed={onLikePressed}
            containerStyle={{ width: '100%' }}
          />
        )}
        <ImageView
          isSwipeCloseEnabled={false}
          isPinchZoomEnabled={false}
          images={formatViewerImages()}
          isVisible={isImageViewerVisible}
          onClose={() => setIsImageViewerVisible(false)}
          imageIndex={tappedImageIndex}
          controls={{ close: closeButton }}
        />
      </View>
    </View>
  )
}

export default CardDetailsView
