import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal as RCTModal,
} from 'react-native'
import { MotiView, AnimatePresence } from 'moti'
import { MotiPressable } from 'moti/interactions'
import { useDispatch, useSelector } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { UserNearbyCard } from '../../components/UserNearbyCard'
import { useTheme, useTranslations } from 'dopenative'
import callables from '~/api/firebase/callables'
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context'
import { IUser } from '~/Core/onboarding/hooks/useCurrentUser'
import {
  getDefaultProfilePicture,
  IS_ANDROID,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '~/helpers/statics'
import Modal from 'react-native-modal'
import CardDetailsView from '~/components/swipe/CardDetailsView/CardDetailsView'
import { SwipeType } from '~/api/firebase/types'
import { addSwipe, removeUserLikedBy } from '~/api/firebase/swipes'
import { useNavigation } from '@react-navigation/native'
import NewMatch from '~/components/swipe/newMatch'
import { addSwipe as addReduxSwipe } from '~/redux/actions'

interface IBounds {
  count: number
  hasMoreData: boolean
  startAt: string
  endAt: string
}

interface INearUser extends IUser {
  distance: number
}

const NearYouScreen = () => {
  const { theme, appearance } = useTheme()
  const colorSet = theme.colors[appearance]

  const [peopleNearYou, setPeopleNearYou] = useState<INearUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const navigation = useNavigation<any>()
  const dispatch = useDispatch()

  const bottomPadding = useSafeAreaInsets().bottom

  const [radius, setRadius] = useState(25)
  const [isRadiusSelectorOpen, setIsRadiusSelectorOpen] = useState(false)

  const boundsListRef = useRef<IBounds[] | null>(null)

  const userSwipes = useSelector(state => state.dating.swipes)

  useEffect(() => {
    if (userSwipes) {
      setPeopleNearYou(prev => {
        const newLikes = prev.filter(doc => !userSwipes[doc.id])
        return [...newLikes]
      })
    }
  }, [userSwipes])

  //@ts-ignore @burzacoding
  const currentUser = useSelector(state => state.auth.user)
  const centerLatLng = [
    currentUser.location.latitude,
    currentUser.location.longitude,
  ]

  const fetchNearbyUsers = async (bounds: IBounds[] | null) => {
    if (bounds && bounds.length === 0) {
      return {
        boundsList: null,
        matchingDocs: null,
      }
    }
    const { data } = await callables.fetchGeoProximityUsers({
      centerLatLng,
      radInKm: radius,
      bounds: bounds || null,
      userSwipes,
    })
    return data as { boundsList: IBounds[]; matchingDocs: INearUser[] }
  }

  useEffect(() => {
    setIsLoading(true)
    setPeopleNearYou([])
    boundsListRef.current = null
    fetchNearbyUsers(null)
      .then(res => {
        const { boundsList, matchingDocs } = res
        if (matchingDocs) {
          const otherUsers = matchingDocs.filter(
            user => user.id !== currentUser.id,
          )
          setPeopleNearYou(otherUsers)
        }
        boundsListRef.current = boundsList?.filter(b => b.hasMoreData) || null
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
      })
  }, [radius])

  const onEndReached = async () => {
    if (boundsListRef.current && boundsListRef.current.length !== 0) {
      const { boundsList, matchingDocs } = await fetchNearbyUsers(
        boundsListRef.current,
      )
      if (matchingDocs) {
        const otherUsers = matchingDocs.filter(
          user => user.id !== currentUser.id,
        )
        setPeopleNearYou([...peopleNearYou, ...otherUsers])
      }
      boundsListRef.current = boundsList?.filter(b => b.hasMoreData) || null
    }
  }

  const safeAreas = useSafeAreaInsets()

  const styles = dynamicStyles(colorSet, safeAreas)

  const [userDetail, setUserDetail] = useState<INearUser | null>(null)
  const [currentMatchData, setCurrentMatchData] = useState<INearUser | null>(
    null,
  )
  const [showMode, setShowMode] = useState(0)

  const onDislikePressed = () => {
    onSwipe(SwipeType.dislike)
  }

  const onLikePressed = () => {
    onSwipe(SwipeType.like)
  }

  const onSuperLikePressed = () => {
    onSwipe(SwipeType.like)
  }

  const onSwipe = async (type: SwipeType) => {
    setPeopleNearYou(prevUsers => {
      const newUsers = [...prevUsers]
      return newUsers.filter(user => user.id !== userDetail!.id)
    })
    if (userDetail) {
      dispatch(addReduxSwipe({ swipedProfileID: userDetail.id, type }))
      const matchedUser = await addSwipe(currentUser, userDetail, type)
      if (matchedUser) {
        setCurrentMatchData(matchedUser)
      }
      await removeUserLikedBy(
        currentUser.id || currentUser.userID,
        userDetail.id || userDetail.userID,
      )
    }
  }

  const handleNewMatchButtonTap = (nextScreen: string | null) => {
    setShowMode(0)
    setCurrentMatchData(null)
    if (nextScreen) {
      navigation.navigate(nextScreen)
    }
  }

  useEffect(() => {
    if (currentMatchData) {
      setShowMode(2)
    } else if (currentMatchData === null) {
      setShowMode(0)
    }
  }, [currentMatchData])

  const renderNewMatch = () => {
    return (
      <NewMatch
        url={
          currentMatchData?.profilePictureURL ||
          getDefaultProfilePicture(currentMatchData?.userCategory)
        }
        onSendMessage={() => handleNewMatchButtonTap('Matches')}
        onKeepSwiping={() => handleNewMatchButtonTap(null)}
      />
    )
  }

  const renderCardDetail = useCallback(
    (user: INearUser) => {
      const profilePic =
        user.profilePictureURL ||
        getDefaultProfilePicture(user?.userCategory)
      return user ? (
        <CardDetailsView
          key={'CardDetail' + user.id}
          profilePictureURL={profilePic}
          firstName={user.firstName}
          lastName={user.lastName}
          age={user.age ? String(user.age) : null}
          school={user.school}
          distance={(user.distance * 1.609).toFixed(2) + ' miles away'}
          uid={user.id}
          bio={user.bio}
          instagramPhotos={
            (user.photos || []).length > 0 ? user.photos : [profilePic]
          }
          setShowMode={setShowMode}
          onSwipeTop={onSuperLikePressed}
          onSwipeRight={onLikePressed}
          onSwipeLeft={onDislikePressed}
          bottomTabBar={true}
        />
      ) : null
    },
    [userDetail],
  )
  const renderItem = useCallback(({ item }: { item: INearUser }) => {
    return (
      <UserNearbyCard
        user={item}
        onPress={user => {
          setShowMode(1)
          setUserDetail(user)
        }}
      />
    )
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <RadiusSelect
        isOpen={isRadiusSelectorOpen}
        radius={radius}
        setIsOpen={setIsRadiusSelectorOpen}
        setRadius={setRadius}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6f6f6f" />
        </View>
      ) : (
        <FlatList
          data={peopleNearYou}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={onEndReached}
          ListEmptyComponent={ListEmptyComponent}
          onEndReachedThreshold={0.3}
          numColumns={2}
          contentContainerStyle={{ flexGrow: 1 }}
          contentInset={{ bottom: bottomPadding }}
        />
      )}
      {userDetail ? (
        <Modal
          propagateSwipe
          style={styles.modal}
          onBackdropPress={() => setShowMode(0)}
          onBackButtonPress={() => setShowMode(0)}
          isVisible={showMode == 1}>
          <View style={styles.cardDetailContainer}>
            {renderCardDetail(userDetail)}
          </View>
        </Modal>
      ) : null}
      {showMode == 2 ? (
        <RCTModal transparent={false} visible animationType={'slide'}>
          <View style={styles.newMatch}>{renderNewMatch()}</View>
        </RCTModal>
      ) : null}
    </View>
  )
}

export default NearYouScreen

const ListEmptyComponent = () => {
  const { localized } = useTranslations()
  const { appearance, theme } = useTheme()

  const colorSet = theme.colors[appearance]
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{ color: colorSet.primaryText }}>
        {localized('No users found')}
      </Text>
    </View>
  )
}

interface RadiusSelectProps {
  isOpen: boolean
  radius: number
  setIsOpen: (isOpen: boolean) => void
  setRadius: (radius: number) => void
}

const RadiusSelect: React.FC<RadiusSelectProps> = ({
  radius,
  setRadius,
  isOpen,
  setIsOpen,
}) => {
  const { localized } = useTranslations()
  const { appearance } = useTheme()

  const isDarkMode = appearance === 'dark'

  return (
    <View
      style={{
        marginLeft: 'auto',
        marginRight: 16,
        marginVertical: 8,
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fcfcfc',
        shadowColor: isDarkMode ? '#ffffff' : '#000000',
        zIndex: 1,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        height: 42,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AnimatePresence>
        <MotiPressable
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            height: 42,
          }}
          onPress={() => setIsOpen(!isOpen)}>
          <Text
            style={{
              paddingLeft: 8,
              color: isDarkMode ? '#fff' : '#888888',
            }}>
            {localized('Radius')}:
          </Text>
          <Text
            style={{
              color: isDarkMode ? '#fff' : '#888888',
              paddingRight: 4,
              width: 64,
              textAlign: 'right',
            }}>
            {radius} km
          </Text>
          <MotiView
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 4,
              marginRight: 8,
            }}
            animate={{
              transform: [
                {
                  rotateX: isOpen ? '180deg' : '0deg',
                },
              ],
            }}
            transition={{
              type: 'timing',
              duration: 200,
            }}>
            <AntDesign
              name="down"
              size={16}
              color={isDarkMode ? '#fff' : '#888888'}
            />
          </MotiView>
        </MotiPressable>
        {isOpen ? (
          <MotiView
            key="moti-deployable"
            from={{
              opacity: 0,
              transform: [
                {
                  translateY: -12,
                },
                {
                  scale: 0.8,
                },
              ],
            }}
            animate={{
              opacity: 1,
              transform: [
                {
                  translateY: 0,
                },
                {
                  scale: 1,
                },
              ],
            }}
            style={{
              backgroundColor: isDarkMode ? '#1e1e1e' : '#fcfcfc',
              position: 'absolute',
              alignItems: 'center',
              top: 56,
              right: 0,
              zIndex: 1,
              borderRadius: 8,
              overflow: 'hidden',
            }}
            exit={{
              opacity: 0,
            }}>
            {[25, 50, 100, 200, 500].map((rad, index) => {
              return (
                <MotiPressable
                  key={rad}
                  style={{
                    height: 42,
                    width: 128,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomColor: isDarkMode ? '#e5e5e5' : '#dddddd',
                    borderBottomWidth: index === 4 ? 0 : 1,
                  }}
                  onPress={() => {
                    setRadius(rad)
                    setIsOpen(false)
                  }}>
                  <Text
                    style={{
                      paddingHorizontal: 4,
                      color: isDarkMode ? '#ebebeb' : '#888888',
                    }}>
                    {rad} km
                  </Text>
                </MotiPressable>
              )
            })}
          </MotiView>
        ) : null}
      </AnimatePresence>
    </View>
  )
}

const dynamicStyles = (colorSet: any, safeAreas: EdgeInsets) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      flex: 1,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      margin: 0,
      alignItems: 'center',
    },
    cardDetailContainer: {
      alignItems: 'center',
      width: SCREEN_WIDTH,
      marginTop: 54 + safeAreas.top,
      height: SCREEN_HEIGHT - (54 + safeAreas.top * (IS_ANDROID ? 2 : 1)),
    },
    newMatch: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: 'white',
    },
  })
