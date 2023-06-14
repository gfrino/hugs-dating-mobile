import React, { useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal as RCTModal,
  Alert,
} from 'react-native'
import { useSelector } from 'react-redux'
import Swiper from 'react-native-deck-swiper'
import Modal from 'react-native-modal'
import { useTranslations } from 'dopenative'
import TinderCard from './tinder_card'
import BottomTabBar from './bottom_tab_bar'
import CardDetailsView from './CardDetailsView/CardDetailsView'
import { getDefaultProfilePicture, IS_ANDROID } from '../../helpers/statics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const Deck = props => {
  const {
    data,
    setShowMode,
    onUndoSwipe,
    onSwipe,
    showMode,
    onAllCardsSwiped,
    // isPlanActive,
    setSubscriptionVisible,
    renderEmptyState,
    renderNewMatch,
    canUserSwipe,
    limitExcedeed,
    isRoomSwiper,
  } = props

  const { localized } = useTranslations()
  const isPlanActive = useSelector(state => state.inAppPurchase.isPlanActive)

  const useSwiper = useRef(null)
  const hasActivePlan = useRef(false)
  const currentDeckIndex = useRef(0)

  const safeAreas = useSafeAreaInsets()

  useEffect(() => {
    hasActivePlan.current = isPlanActive
  }, [isPlanActive])

  const onDislikePressed = () => {
    useSwiper.current.swipeLeft()
  }

  const onSuperLikePressed = () => {
    useSwiper.current.swipeTop()
  }

  const onLikePressed = () => {
    useSwiper.current.swipeRight()
  }

  const handleSwipe = (type, index) => {
    const currentDeckItem = data[index]

    currentDeckIndex.current = index

    if (canUserSwipe || hasActivePlan.current) {
      onSwipe(type, currentDeckItem)
    } else {
      useSwiper.current.swipeBack()
      if (limitExcedeed) {
        alertLimitSwipeExceeded()
      } else {
        alertDailySwipeExceeded()
      }
    }
  }

  const onSwipedLeft = index => {
    handleSwipe('dislike', index)
  }

  const onSwipedRight = index => {
    handleSwipe('like', index)
  }

  const onSwipedTop = index => {
    handleSwipe('like', index)
  }

  const onSwipedBottom = index => {
    handleSwipe('like', index)
  }

  const onSwipedAll = () => {
    onAllCardsSwiped()
  }

  const onTapCard = index => {
    currentDeckIndex.current = index
    setShowMode(1)
  }

  const undoSwipe = () => {
    if (!hasActivePlan.current) {
      requestUpgrade()

      return
    }

    useSwiper.current.swipeBack(index => {
      const prevDeckItem = data[index - 1]

      currentDeckIndex.current = index
      onUndoSwipe(prevDeckItem)
    })
  }

  const requestUpgrade = () => {
    Alert.alert(
      localized('Upgrade account'),
      localized('Upgrade your account now to undo a swipe.'),
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
  }

  const alertDailySwipeExceeded = () => {
    Alert.alert(
      localized('Daily swipes exceeded'),
      localized(
        'You have exceeded the daily swipes limit. Upgrade your account now to enjoy unlimited swipes',
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
  }

  const alertLimitSwipeExceeded = () => {
    Alert.alert(
      localized('Upgrade account'),
      localized('Upgrade your account to continue Swiping.'),
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
  }

  const styles = dynamicStyles(safeAreas.top, safeAreas.bottom, isRoomSwiper)

  const renderCard = item => {
    if (item) {
        return (
          <TinderCard
            key={'TinderCard' + item.id}
            url={
              item.profilePictureURL ||
              getDefaultProfilePicture(item?.userCategory)
            }
            name={item.firstName}
            age={item.age}
            school={item.school}
            distance={item.distance}
            setShowMode={setShowMode}
            isRoomSwiper={isRoomSwiper}
          />
        )
    }
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
          bio={item.bio}
          instagramPhotos={
            item?.photos?.length > 0 ? item.photos : [profilePic]
          }
          uid={item.id}
          setShowMode={setShowMode}
          onSwipeTop={onSuperLikePressed}
          onSwipeRight={onLikePressed}
          onSwipeLeft={onDislikePressed}
          isDone={isDone}
          bottomTabBar={true}
        />
      )
    )
  }

  const renderOverlayLabel = (label, color) => {
    return (
      <View style={[styles.overlayLabel, { borderColor: color }]}>
        <Text style={[styles.overlayLabelText, { color }]}>{label}</Text>
      </View>
    )
  }

  const renderBottomTabBar = (containerStyle, buttonContainerStyle) => {
    return (
      <View style={styles.bottomTabBarContainer}>
        <BottomTabBar
          onDislikePressed={onDislikePressed}
          onSuperLikePressed={onSuperLikePressed}
          onLikePressed={onLikePressed}
          containerStyle={containerStyle}
          buttonContainerStyle={buttonContainerStyle}
          undoSwipe={undoSwipe}
        />
      </View>
    )
  }

  if (data.length === 0) {
    return <View style={styles.noMoreCards}>{renderEmptyState()}</View>
  }

  return (
    <View style={styles.container}>
      <Swiper
        ref={useSwiper}
        animateCardOpacity={true}
        containerStyle={styles.swiperContainer}
        cards={data}
        renderCard={renderCard}
        cardIndex={0}
        backgroundColor="white"
        stackSize={8}
        stackScale={4.5}
        verticalSwipe={true}
        infinite={false}
        showSecondCard={true}
        animateOverlayLabelsOpacity={true}
        onTapCard={onTapCard}
        onSwipedRight={onSwipedRight}
        onSwipedTop={onSwipedTop}
        onSwipedLeft={onSwipedLeft}
        onSwipedAll={onSwipedAll}
        onSwipedBottom={onSwipedBottom}
        swipeBackCard={true}
        overlayLabels={{
          left: {
            title: 'NOPE',
            element: renderOverlayLabel('NOPE', '#E5566D'),
            style: {
              wrapper: styles.overlayWrapper,
            },
          },
          right: {
            title: 'LIKE',
            element: renderOverlayLabel('LIKE', '#4CCC93'),
            style: {
              wrapper: {
                ...styles.overlayWrapper,
                alignItems: 'flex-start',
                marginLeft: 30,
              },
            },
          },
        }}
      />
      {renderBottomTabBar()}
      {data[currentDeckIndex.current] ? (
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
          isVisible={showMode == 1}>
          <View style={styles.cardDetailContainer}>
            {renderCardDetail(data[currentDeckIndex.current])}
          </View>
        </Modal>
      ) : null}
      {showMode == 2 && (
        <RCTModal
          transparent={false}
          visible={showMode == 2 ? true : false}
          animationType={'slide'}>
          <View style={styles.newMatch}>{renderNewMatch()}</View>
        </RCTModal>
      )}
    </View>
  )
}

const dynamicStyles = (
  safeAreaTop = 0,
  safeAreaBottom = 0,
  isRoomSwiper = false,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    overlayLabel: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderWidth: 2,
      borderRadius: 10,
    },
    overlayLabelText: {
      fontSize: 32,
      fontWeight: '800',
      padding: 10,
    },
    swiperContainer: {
      marginLeft: -20,
      marginTop:
        -54 + (isRoomSwiper && !IS_ANDROID ? 32 + safeAreaBottom / 2 : 0),
      alignItems: 'center',
      justifyContent: 'center',
      height: SCREEN_HEIGHT - 54 - safeAreaBottom,
      backgroundColor: 'transparent',
    },
    overlayWrapper: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginTop: Math.floor(SCREEN_HEIGHT * 0.04),
    },
    cardDetailContainer: {
      alignItems: 'center',
      width: SCREEN_WIDTH,
      marginTop: safeAreaTop,
      height: SCREEN_HEIGHT - safeAreaTop * (IS_ANDROID ? -1 : 1),
    },
    bottomTabBarContainer: {
      marginBottom: -8,
      position: 'absolute',
      bottom: 0,
      width: '100%',
      alignSelf: 'center',
    },
    noMoreCards: {
      position: 'absolute',
      top: 0,
      bottom: 50,
      left: 0,
      right: 0,
      zIndex: -1,
      width: SCREEN_WIDTH,
    },
    newMatch: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: 'white',
    },
  })

export default Deck
