import React, { useState, useEffect, useRef, useContext } from 'react'
import {
  View,
  Alert,
  StatusBar,
  SafeAreaView,
  AppState,
  ImageBackground, // eslint-disable-line react-native/split-platform-components
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import { useIsFocused } from '@react-navigation/native'
import { firebase } from '../../Core/api/firebase/config'
import ActivityModal from '../../components/ActivityModal'
import Deck from '../../components/swipe/deck'
import NoMoreCard from '../../components/swipe/no_more_card'
import NewMatch from '../../components/swipe/newMatch'
import { setUserData } from '../../Core/onboarding/redux/auth'
import { SwipeTracker } from '../../api/'
import dynamicStyles from './styles'
import { notificationManager } from '../../Core/notifications'
import { useIap } from '../../Core/inAppPurchase/context'
import { getUserAwareCanUndoAsync } from '../../utils'
import { useConfig } from '../../config'
import { getDefaultProfilePicture } from '../../helpers/statics'
import { addSwipe, setSwipes } from '~/redux/actions'

const SwipeScreen = props => {
  const config = useConfig()
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const isFocused = useIsFocused()

  const { setSubscriptionVisible } = useIap()
  const user = useSelector(state => state.auth.user)
  const isPlanActive = useSelector(state => state.inAppPurchase.isPlanActive)
  const dispatch = useDispatch()

  const [matches, setMatches] = useState([])
  const [recommendations, setRecommendations] = useState([])

  const [showMode, setShowMode] = useState(0)
  const [currentMatchData, setCurrentMatchData] = useState()
  const [
    hasConsumedRecommendationsStream,
    setHasConsumedRecommendationsStream,
  ] = useState(false)
  const [canUserSwipe, setCanUserSwipe] = useState(false)
  const [isComputing, setIsComputing] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  const userRef = useRef(null)

  const userAwareCanUndo = useRef(false)
  const isLoadingRecommendations = useRef(false)
  const swipeCountDetail = useRef({})
  const swipeTracker = useRef(null)
  const defaultMatchIndex = useRef(0).current
  const [limitExcedeed, setLimitExcedeed] = useState(false)

  const userSwipes = useSelector(state => state.dating.swipes)

  useEffect(() => {
    console.log('mounting computing status listener')
    swipeTracker.current = new SwipeTracker(user.id)
    StatusBar.setHidden(false)
    swipeTracker.current.subscribeComputingStatus(onComputingStatusUpdate)

    const eventListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    )

    if (user) {
      userRef.current = firebase.firestore().collection('users').doc(user.id)
    }

    handleShouldFetchRecommendations()
    getUserSwipeCount()

    getUserSwipes()

    return () => {
      console.log(
        'unmounting and unsubscribing for the computing status listener',
      )
      swipeTracker.current.unsubscribe()
      eventListener.remove()
      userRef.current = null
    }
  }, [user?.id])

  useEffect(() => {
    if (!currentMatchData && matches?.length && isFocused) {
      const unseenMatch = matches[defaultMatchIndex]
      notificationManager.sendPushNotification(
        unseenMatch,
        localized('New match!'),
        localized('You just got a new match!'),
        'dating_match',
        { fromUser: user },
      )
      setCurrentMatchData(unseenMatch)
    }
  }, [matches?.length, isFocused])

  useEffect(() => {
    if (currentMatchData === null) {
      const seenMatch = matches[defaultMatchIndex] || {}
      setMatches(prevMatches => {
        return prevMatches.filter(prevMatch => prevMatch.id !== seenMatch?.id)
      })
    }
  }, [currentMatchData])

  useEffect(() => {
    if (currentMatchData) {
      setShowMode(2)
    }
  }, [currentMatchData])

  useEffect(() => {
    if (isComputing === false && isLoading) {
      getMoreRecommendations()
    }
  }, [isComputing])

  const prevDependecies = useRef([
    user?.settings?.distance_radius,
    user?.settings?.gender_preference,
    user?.settings?.category_preference,
    user?.settings?.gender,
    user?.location?.latitude,
    user?.location?.longitude,
  ])

  useEffect(() => {
    // console.log({
    //   'Distance Radius': `${prevDependecies.current[0]} => ${user?.settings?.distance_radius}`,
    //   'Gender Preference': `${prevDependecies.current[1]} => ${user?.settings?.gender_preference}`,
    //   'Category Preference': `${prevDependecies.current[2]} => ${user?.settings?.category_preference}`,
    //   Gender: `${prevDependecies.current[3]} => ${user?.settings?.gender}`,
    // })

    console.log('useEffect SwipeScreen, location:', user?.location)

    prevDependecies.current[0] = user?.settings?.distance_radius
    prevDependecies.current[1] = user?.settings?.gender_preference
    prevDependecies.current[2] = user?.settings?.category_preference
    prevDependecies.current[3] = user?.settings?.gender

    if (user?.location) {
      isLoadingRecommendations.current = false
      setHasConsumedRecommendationsStream(false)
      console.log('use Effect user settings set to TRUE')
      setIsLoading(true)
      setRecommendations([])
    }
  }, [
    user?.settings?.distance_radius,
    user?.settings?.gender_preference,
    user?.settings?.category_preference,
    user?.settings?.gender,
  ])

  const handleShouldFetchRecommendations = async () => {
    setIsComputing(true)
    const didTrigger =
      await swipeTracker.current.triggerComputeRecommendationsIfNeeded(user)

    if (!didTrigger) {
      getMoreRecommendations()
    }
  }

  const onComputingStatusUpdate = isComputingRecommendation => {
    setIsComputing(isComputingRecommendation)
    if (isComputingRecommendation) {
      console.log(
        'onComputingStatusUpdate: isComputingRecommendation: setIsLoading TRUE ',
      )
      setIsLoading(true)
      setRecommendations([])
    }
  }

  const getUserSwipes = async () => {
    const userSwipes = await swipeTracker.current.getUserSwipes()
    dispatch(setSwipes(userSwipes))
  }

  const getUserSwipeCount = async () => {
    const userID = user.id || user.userID

    const swipeCountInfo = await swipeTracker.current.getUserSwipeCount(userID)

    if (swipeCountInfo) {
      swipeCountDetail.current = swipeCountInfo
    } else {
      resetSwipeCountDetail()
    }

    if (swipeCountDetail.current.count + 1 >= config.totalSwipeLimit) {
      setCanUserSwipe(false)
      setLimitExcedeed(true)
    } else {
      setCanUserSwipe(true)
    }

    getCanUserSwipe(false)
  }

  const resetSwipeCountDetail = () => {
    swipeCountDetail.current = {
      count: 0,
      createdAt: {
        seconds: Date.now() / 1000,
        _seconds: Date.now() / 1000,
      },
    }
  }

  const updateSwipeCountDetail = () => {
    const userID = user.id || user.userID

    swipeTracker.current.updateUserSwipeCount(
      userID,
      swipeCountDetail.current.count,
    )
  }

  const getSwipeTimeDifference = swipeCountDetail => {
    let now = +new Date()
    let createdAt = +new Date()

    if (swipeCountDetail?.createdAt?.seconds) {
      createdAt = +new Date(swipeCountDetail.createdAt.seconds * 1000)
    }

    return now - createdAt
  }

  const getCanUserSwipe = (shouldUpdate = true) => {
    if (isPlanActive) {
      setCanUserSwipe(false)

      return true
    }

    const oneDay = 60 * 60 * 24 * 1000

    const swipeTimeDifference = getSwipeTimeDifference(swipeCountDetail.current)

    if (swipeTimeDifference > oneDay) {
      resetSwipeCountDetail()
      updateSwipeCountDetail()

      setCanUserSwipe(false)

      return true
    }

    if (
      swipeTimeDifference < oneDay &&
      swipeCountDetail.current.count < config.dailySwipeLimit
    ) {
      if (shouldUpdate) {
        swipeCountDetail.current.count += 1
        updateSwipeCountDetail()
      }


      setCanUserSwipe(
        swipeCountDetail.current.count + 1 <= config.dailySwipeLimit,
      )


      return true
    }

    if (
      swipeTimeDifference < oneDay &&
      swipeCountDetail.current.count >= config.dailySwipeLimit
    ) {
      setCanUserSwipe(false)

      return false
    }
  }

  const handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      userRef.current
        ?.update({
          isOnline: true,
        })
        .then(() => {
          dispatch(setUserData({ user: { ...user, isOnline: true } }))
        })
        .catch(error => {
          console.log('ERROR [handleAppStateChange]', error)
        })
      console.log('handleAppStateChange active')
    } else {
      userRef.current
        ?.update({
          isOnline: false,
        })
        .then(() => {
          dispatch(setUserData({ user: { ...user, isOnline: false } }))
        })
        .catch(error => {
          console.log('ERROR [handleAppStateChange]', error)
        })

      console.log('handleAppStateChange background')
    }
  }

  const handleNewMatchButtonTap = nextScreen => {
    setShowMode(0)
    setCurrentMatchData(null)
    if (nextScreen) {
      props.navigation.navigate(nextScreen)
    }
  }

  const getMoreRecommendations = async () => {
    if (isLoadingRecommendations.current || hasConsumedRecommendationsStream) {
      return
    }

    console.log('getMoreRecommendations setIsLoading(true)')
    setIsLoading(true)

    isLoadingRecommendations.current = true

    const data = await swipeTracker.current.fetchRecommendations(user)
    isLoadingRecommendations.current = false

    if (data?.length) {
      const filteredData = data.filter(doc => !userSwipes[doc.id])
      setRecommendations(filteredData)
    }
    console.log('getMoreRecommendations setIsLoading(false)')
    setIsLoading(false)
    setIsComputing(false)

    if (data?.length === 0) {
      setHasConsumedRecommendationsStream(true)
      return
    }

    if (!data) {
      Alert.alert(localized('Error'), localized("Couldn't load cards"))
    }
  }

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

  const Leaves_BG = theme.icons.Leaves_BG

  const undoSwipe = swipedUserToUndo => {
    if (!swipedUserToUndo) {
      return
    }

    const userID = user.id || user.userID

    swipeTracker.current.undoSwipe(swipedUserToUndo, userID)
  }

  const onSwipe = async (type, swipeItem) => {
    const canSwipe = getCanUserSwipe()

    if (!canSwipe) {
      return
    }

    if (swipeItem && canSwipe) {
      dispatch(addSwipe({ swipedProfileID: swipeItem.id, type }))
      const matchedUser = await swipeTracker.current.addSwipe(
        user,
        swipeItem,
        type,
      )

      if (matchedUser) {
        addToMatches(matchedUser)
      }

      if (!userAwareCanUndo.current && type === 'dislike' && !isPlanActive) {
        shouldAlertCanUndo()
      }

      updateSwipeCountDetail()
      getUserSwipeCount()
    }
  }

  const onAllCardsSwiped = () => {
    setRecommendations([])
    getMoreRecommendations()
  }

  const shouldAlertCanUndo = async () => {
    const isUserAware = await getUserAwareCanUndoAsync()

    if (isUserAware) {
      userAwareCanUndo.current = true

      return
    }

    Alert.alert(
      localized('Pardon the interruption'),
      localized(
        "Don't lose this amazing friend just because you accidentally swiped left. Upgrade your account now to see them again.",
      ),
      [
        {
          text: localized('Upgrade Now'),
          onPress: () => setSubscriptionVisible(true),
        },
        {
          text: localized('Cancel'),
        },
      ],
      { cancelable: true },
    )
    userAwareCanUndo.current = true
  }

  const renderEmptyState = () => {
    return <NoMoreCard user={user} />
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <ImageBackground
          style={styles.container}
          source={Leaves_BG}
          imageStyle={{ opacity: 0.15 }}>
          {(recommendations.length > 0 || hasConsumedRecommendationsStream) && (
            <Deck
              data={recommendations}
              setShowMode={setShowMode}
              onUndoSwipe={undoSwipe}
              onSwipe={onSwipe}
              showMode={showMode}
              onAllCardsSwiped={onAllCardsSwiped}
              isPlanActive={isPlanActive}
              setSubscriptionVisible={setSubscriptionVisible}
              renderEmptyState={renderEmptyState}
              renderNewMatch={renderNewMatch}
              canUserSwipe={canUserSwipe}
              // @burzacoding
              // limitExcedeed={limitExcedeed}
              limitExcedeed={false}
            />
          )}

          <ActivityModal
            loading={
              (isComputing || isLoading) && !hasConsumedRecommendationsStream
            }
            title={localized('Please wait')}
            size={'large'}
            activityColor={'white'}
            titleColor={'white'}
            activityWrapperStyle={{
              backgroundColor: '#404040',
            }}
          />
        </ImageBackground>
      </SafeAreaView>
    </View>
  )
}

//'https://pbs.twimg.com/profile_images/681369932207013888/CHESpTzF.jpg'

export default SwipeScreen
