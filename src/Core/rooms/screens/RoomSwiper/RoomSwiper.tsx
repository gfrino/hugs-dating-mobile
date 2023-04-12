import React, { useEffect, useState, useRef, useCallback } from 'react'
import { View, Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme, useTranslations } from 'dopenative'
import { LeavesBackground } from '../../../../components/LeavesBackground'
import { SwiperHeader } from '../../components/SwiperHeader'
import { dynamicStyles } from './styles'
import { useCurrentUser } from '~/Core/onboarding'
import { useIap } from '~/Core/inAppPurchase/context'
import { RoomSwipeTracker } from '~/api'
import { IUser } from '~/Core/onboarding/hooks/useCurrentUser'
import ActivityModal from '~/components/ActivityModal'
import Deck from '~/components/swipe/deck'
import { SwipeType } from '~/api/firebase/types'
import NoMoreCard from '~/components/swipe/no_more_card'
import NewMatch from '~/components/swipe/newMatch'
import { getDefaultProfilePicture } from '~/helpers/statics'
import { StackScreenProps } from '@react-navigation/stack'
import { updateUser } from '~/Core/users'
import firestore from '@react-native-firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { addSwipe } from '~/redux/actions'

interface RouteParams {
  id: string
  name: string
  description: string
}

const RoomSwiper: React.FC<StackScreenProps<{}>> = ({ navigation, route }) => {
  const { id: roomId, name, description } = route.params as RouteParams

  const { localized } = useTranslations()

  const { theme, appearance } = useTheme()
  const colorSet = theme.colors[appearance]
  const marginTop = useSafeAreaInsets().top
  const styles = dynamicStyles(colorSet, marginTop)

  const isFocused = useIsFocused()

  const user = useCurrentUser()
  const isPlanActive = useIap().activePlan !== 0
  const setSubscriptionVisible = useIap().setSubscriptionVisible

  const [matches, setMatches] = useState<IUser[]>([])
  const [recommendations, setRecommendations] = useState<IUser[]>([])

  const [showMode, setShowMode] = useState(0)
  const [currentMatchData, setCurrentMatchData] = useState<IUser | null>(null)
  const [
    hasConsumedRecommendationsStream,
    setHasConsumedRecommendationsStream,
  ] = useState(false)
  const [isComputing, setIsComputing] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const isLoadingRecommendations = useRef(false)
  const roomSwipeTracker = useRef<RoomSwipeTracker | null>(null)
  const defaultMatchIndex = useRef(0).current

  const userSwipes = useSelector(state => state.dating.swipes)

  const dispatch = useDispatch()

  const handleShouldFetchRecommendations = useCallback(async () => {
    setIsComputing(true)
    const [didTrigger, remoteUserRooms = []] = await Promise.all([
      roomSwipeTracker.current?.triggerComputeRecommendationsIfNeeded(user),
      roomSwipeTracker.current?.fetchRemoteUserRooms() || Promise.resolve([]),
    ])

    if (!remoteUserRooms.includes(roomId)) {
      await addUserToRoom()
    }

    if (!didTrigger) {
      getMoreRecommendations()
    }
  }, [user?.id, user.rooms, user?.settings?.gender])

  useEffect(() => {
    roomSwipeTracker.current = new RoomSwipeTracker(
      user.id,
      user?.settings?.gender_preference,
      roomId,
    )

    roomSwipeTracker.current.subscribeComputingStatus(onComputingStatusUpdate)

    handleShouldFetchRecommendations()

    return () => {
      console.log(
        'unmounting and unsubscribing for the computing status listener',
      )
      roomSwipeTracker.current?.unsubscribe()
    }
  }, [user?.id, user?.settings?.gender])

  useEffect(() => {
    if (!currentMatchData && matches?.length && isFocused) {
      const unseenMatch = matches[defaultMatchIndex]
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
      console.log('Getting recommendations after computing set to false...')
      getMoreRecommendations()
    }
  }, [isComputing])

  const addUserToRoom = async () => {
    try {
      await updateUser(user.id, {
        rooms: firestore.FieldValue.arrayUnion(roomId),
      })
    } catch (e) {
      console.log('ERROR [addUserToRoom]', e)
    }
  }

  const onComputingStatusUpdate = (isComputingRecommendation: boolean) => {
    console.log(
      'onComputingStatusUpdate: isComputingRoomsRec:',
      isComputingRecommendation,
    )
    setIsComputing(isComputingRecommendation)
    if (isComputingRecommendation) {
      setIsLoading(true)
    }
  }

  const getMoreRecommendations = async () => {
    if (isLoadingRecommendations.current || hasConsumedRecommendationsStream) {
      return
    }

    console.log('getMoreRecommendations setIsLoading(true)')
    setIsLoading(true)

    isLoadingRecommendations.current = true

    const data = await roomSwipeTracker.current?.fetchRecommendations()
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

  const undoSwipe = (swipedUserToUndo: IUser) => {
    if (!swipedUserToUndo) {
      return
    }
    roomSwipeTracker.current?.undoSwipe(swipedUserToUndo)
  }

  const addToMatches = (matchedUser: IUser) => {
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

  const onSwipe = async (type: SwipeType, swipeItem: IUser) => {
    if (swipeItem) {
      dispatch(addSwipe({ swipedProfileID: swipeItem.id, type }))
      const matchedUser = await roomSwipeTracker.current?.addSwipe(
        user,
        swipeItem,
        type,
      )
      // await roomSwipeTracker.current?.updateUserSwipeCount(0);
      console.log("())()()()(()(", roomSwipeTracker.current?.getUserSwipeCount());
      roomSwipeTracker.current?.getUserSwipeCount().then((res: any) => {
        roomSwipeTracker.current?.updateUserSwipeCount(res.count + 1);
        console.log("())()()()(()(", res.count);
      })
      if (matchedUser) {
        addToMatches(matchedUser)
      }

      // getUserSwipeCount()
    }
  }



  const onAllCardsSwiped = () => {
    setRecommendations([])
    getMoreRecommendations()
  }

  const renderEmptyState = () => {
    return <NoMoreCard user={user} isFromRooms={true} />
  }
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
  const handleNewMatchButtonTap = (nextScreen: string | null) => {
    setShowMode(0)
    setCurrentMatchData(null)
    if (nextScreen) {
      // @ts-ignore
      navigation.navigate(nextScreen)
    }
  }

  return (
    <View style={styles.container}>
      <LeavesBackground screen />
      <SwiperHeader title={name} description={description} />
      {(recommendations.length > 0 || hasConsumedRecommendationsStream) && (
        <Deck
          data={recommendations}
          setShowMode={setShowMode}
          onUndoSwipe={undoSwipe}
          isRoomSwiper
          onSwipe={onSwipe}
          showMode={showMode}
          onAllCardsSwiped={onAllCardsSwiped}
          isPlanActive={isPlanActive}
          setSubscriptionVisible={setSubscriptionVisible}
          renderEmptyState={renderEmptyState}
          renderNewMatch={renderNewMatch}
          canUserSwipe={true}
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
    </View>
  )
}

export default React.memo(RoomSwiper)
