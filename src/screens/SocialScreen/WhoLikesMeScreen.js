import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal as RCTModal,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersLikes, removeUserLikedBy } from '../../api/firebase/swipes'
import CardDetailsView from '../../components/swipe/CardDetailsView/CardDetailsView'
import { useIap } from '../../Core/inAppPurchase/context'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { SwipeTracker } from '../../api'
import Modal from 'react-native-modal'
import { useTheme, useTranslations } from 'dopenative'
import {
  DEVICE_WIDTH,
  getDefaultProfilePicture,
  IS_ANDROID,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../helpers/statics'
import NewMatch from '~/components/swipe/newMatch'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { addSwipe } from '~/redux/actions'

const defaultMatchIndex = 0

const WhoLikesMeScreen = ({ setNumLikesMe }) => {
  const user = useSelector(state => state.auth.user)
  const [userLikes, setUserLikes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const isPremium = useSelector(state => state.inAppPurchase.isPlanActive)
  const [isActive, setIsActive] = useState(null)
  const [showMode, setShowMode] = useState(0)
  const { setSubscriptionVisible } = useIap()
  const swipeTracker = useRef(null)
  const [matches, setMatches] = useState([])
  const isFocused = useIsFocused()
  const [currentMatchData, setCurrentMatchData] = useState()
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  const userSwipes = useSelector(state => state.dating.swipes)

  const dispatch = useDispatch()

  useEffect(() => {
    let filteredLikes = []
    setUserLikes(prev => {
      const newLikes = prev.filter(doc => !userSwipes[doc.id])
      filteredLikes = newLikes
      return newLikes
    })
    setNumLikesMe((filteredLikes?.length || 0) > 0 ? filteredLikes.length : 0)
  }, [userSwipes])

  const safeAreas = useSafeAreaInsets()

  const styles = dynamicStyles(safeAreas)

  const navigation = useNavigation()

  const getLikes = useCallback(async () => {
    const users = await getUsersLikes(user.id)
    const filteredLikes = users.filter(doc => !userSwipes[doc.id])
    setIsLoading(false)
    setUserLikes(filteredLikes)
    setNumLikesMe(filteredLikes?.length)
  }, [])

  useEffect(() => {
    console.log('WhoLikesMeScreen useEffect')
    getLikes()
    swipeTracker.current = new SwipeTracker(user.id)
    return () => {
      swipeTracker.current.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!currentMatchData && matches?.length && isFocused) {
      const unseenMatch = matches[defaultMatchIndex]
      setCurrentMatchData(unseenMatch)
      undoSwipe()
    }
  }, [matches?.length, isFocused])

  const undoSwipe = async () => {
    await swipeTracker.current.undoSwipe(user, matches[0].userID)
  }

  useEffect(() => {
    if (currentMatchData === null) {
      const seenMatch = matches[defaultMatchIndex] || {}
      setMatches(prevMatches => {
        return prevMatches.filter(prevMatch => prevMatch.id !== seenMatch?.id)
      })
    } else {
      if (currentMatchData) {
        setShowMode(2)
      }
    }
  }, [currentMatchData])

  const addToMatches = matchedUser => {
    setMatches(prevMatches => {
      const newMatches = [...prevMatches]
      const index = prevMatches.findIndex(
        prevMatch => prevMatch.id === matchedUser.id,
      )
      if (index < 0) {
        newMatches.push(matchedUser)
      }
      return newMatches
    })
  }

  const onSwipe = async (type, swipeItem) => {
    if (swipeItem) {
      const matchedUser = await swipeTracker.current.addSwipe(
        user,
        swipeItem,
        type,
      )
      if (matchedUser) {
        console.log('ITS A MATCH')
        addToMatches(matchedUser)
      }
    }
    await removeUserLikedBy(
      user.id || user.userID,
      swipeItem.id || swipeItem.userID,
    )
  }

  const onUpgradeAccount = () => {
    setSubscriptionVisible(true)
  }

  const onDislikePressed = index => {
    handleSwipe('dislike', isActive)
  }

  const onLikePressed = index => {
    handleSwipe('like', isActive)
  }

  const onSuperLikePressed = index => {
    handleSwipe('like', isActive)
  }

  const handleSwipe = (type, index) => {
    const currentDeckItem = userLikes[index]
    onSwipe(type, currentDeckItem)
    dispatch(addSwipe({ swipedProfileID: currentDeckItem.id, type }))
  }

  const renderCardDetail = (item, isDone) => {
    const profilePic =
      item.profilePictureURL || getDefaultProfilePicture(item.userCategory)
    return (
      item && (
        <CardDetailsView
          key={'CardDetail' + item.id}
          profilePictureURL={profilePic}
          firstName={item.firstName}
          lastName={item.lastName}
          age={item.age}
          school={item.school}
          distance={item.distance}
          uid={item.id}
          bio={item.bio}
          instagramPhotos={
            item?.photos?.length > 0 ? item.photos : [profilePic]
          }
          setShowMode={setShowMode}
          onSwipeTop={onSuperLikePressed}
          onSwipeRight={onLikePressed}
          onSwipeLeft={onDislikePressed}
          isDone={isDone}
          screen="whoLikesMe"
          bottomTabBar={true}
        />
      )
    )
  }
  const handleNewMatchButtonTap = nextScreen => {
    setShowMode(0)
    setCurrentMatchData(null)
    if (nextScreen) {
      navigation.navigate(nextScreen)
    }
  }

  const renderNewMatch = () => {
    return (
      <NewMatch
        url={
          currentMatchData?.profilePictureURL ||
          getDefaultProfilePicture(currentMatchData.userCategory)
        }
        onSendMessage={() => handleNewMatchButtonTap('Matches')}
        onKeepSwiping={() => handleNewMatchButtonTap(null)}
      />
    )
  }

  const color = theme.colors[appearance].primaryText

  const RenderItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        onPress={() => {
          if (isPremium) {
            setIsActive(index)
            setShowMode(1)
          } else {
            onUpgradeAccount()
          }
        }}
        style={{ marginVertical: 8 }}>
        <View>
          <Image
            source={{
              uri:
                item.profilePictureURL ||
                getDefaultProfilePicture(item.userCategory),
            }}
            style={{
              width: DEVICE_WIDTH / 2 - 24,
              height: DEVICE_WIDTH / 2 - 24,
              borderRadius: 20,
              margin: 12,
              marginRight: 'auto',
            }}
            blurRadius={isPremium ? 0 : 16}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 15,
              color,
            }}>
            {isPremium
              ? item.firstName + '' + (item.age ? `, ${item.age}` : '')
              : ''}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [isPremium],
  )

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
      {userLikes && userLikes[isActive] ? (
        <Modal
          propagateSwipe
          style={{
            flex: 1,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            margin: 0,
            alignItems: 'center',
          }}
          onBackdropPress={() => setShowMode(0)}
          onBackButtonPress={() => setShowMode(0)}
          isVisible={showMode == 1 && userLikes[isActive] ? true : false}>
          <View style={styles.cardDetailContainer}>
            {renderCardDetail(userLikes[isActive])}
          </View>
        </Modal>
      ) : null}
      {isLoading ? (
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            alignSelf: 'center',
            marginBottom: 5,
            color,
          }}>
          {localized('Please wait...')}
        </Text>
      ) : null}
      {!isPremium && (
        <Text
          style={{
            fontSize: 14,
            color,
            fontWeight: 'bold',
            textAlign: 'center',
            marginHorizontal: 5,
          }}>
          {localized(
            'You can see who likes you only if you are a premium member',
          )}
        </Text>
      )}
      {!isLoading && userLikes?.length > 0 ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={userLikes}
            contentContainerStyle={{
              paddingHorizontal: 4,
            }}
            keyExtractor={item => item.id}
            renderItem={RenderItem}
            numColumns={2}
          />
        </View>
      ) : null}
      {showMode == 2 && (
        <RCTModal
          transparent={false}
          visible={showMode == 2 ? true : false}
          animationType={'slide'}>
          <View style={styles.newMatch}>{renderNewMatch()}</View>
        </RCTModal>
      )}
      {isPremium ? null : (
        <View
          style={{
            paddingVertical: 32,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={onUpgradeAccount}
            style={{
              backgroundColor: '#E3AC0E',
              padding: 12,
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#ffffff',
                fontWeight: 'bold',
              }}>
              {localized('DISCOVER WHO LIKES YOU')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const dynamicStyles = safeAreas =>
  StyleSheet.create({
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

export default WhoLikesMeScreen
