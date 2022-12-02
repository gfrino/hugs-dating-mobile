import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react'
import { useTheme, useTranslations } from 'dopenative'
import { TNTouchableIcon } from '../../../../truly-native'
import { FriendshipConstants } from '../../constants'
import IMFriendsListComponent from '../../ui/IMFriendsListComponent/IMFriendsListComponent'
import { useSocialGraphFriendships, useSocialGraphMutations } from '../../api'
import { useCurrentUser } from '../../../../onboarding'

const IMFriendsScreen = props => {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const currentUser = useCurrentUser()

  const {
    friendships,
    setFriendships,
    refreshing,
    subscribeToFriendships,
    loadMoreFriendships,
    pullToRefresh,
  } = useSocialGraphFriendships()
  const { addEdge, unfriend } = useSocialGraphMutations(setFriendships)

  const { navigation, route } = props
  const followEnabled = route.params.followEnabled

  const [isLoading, setIsLoading] = useState(false)
  const [willBlur, setWillBlur] = useState(false)

  const willBlurSubscription = useRef(null)
  const didFocusSubscription = useRef(
    navigation.addListener('focus', payload => {
      setWillBlur(false)
    }),
  )

  useLayoutEffect(() => {
    const showDrawerMenuButton = route.params.showDrawerMenuButton
    const headerTitle = route.params.friendsScreenTitle || localized('Friends')
    const colorSet = theme.colors[appearance]
    navigation.setOptions({
      headerTitle: headerTitle,
      headerLeft: () =>
        showDrawerMenuButton && (
          <TNTouchableIcon
            imageStyle={{ tintColor: colorSet.primaryText }}
            iconSource={theme.icons.menuHamburger}
            onPress={openDrawer}
          />
        ),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToFriendships(currentUser?.id)
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [currentUser?.id])

  useEffect(() => {
    willBlurSubscription.current = navigation.addListener('blur', payload => {
      setWillBlur(true)
    })
    return () => {
      willBlurSubscription.current && willBlurSubscription.current()
      didFocusSubscription.current && didFocusSubscription.current()
    }
  }, [])

  const onFriendshipsListEndReached = useCallback(() => {
    loadMoreFriendships(currentUser?.id)
  }, [loadMoreFriendships, currentUser?.id])

  const openDrawer = () => {
    navigation.openDrawer()
  }

  const onSearchButtonPress = useCallback(async () => {
    navigation.navigate('UserSearchScreen', {
      followEnabled: followEnabled,
    })
  }, [followEnabled, navigation])

  const onFriendAction = useCallback(
    (item, index) => {
      if (isLoading || (item.user && item.user.id == currentUser.id)) {
        return
      }
      switch (item.type) {
        case FriendshipConstants.FriendshipType.none:
          onAddFriend(item, index)
          break
        case FriendshipConstants.FriendshipType.reciprocal:
          onUnfriend(item, index)
          break
        case FriendshipConstants.FriendshipType.inbound:
          onAccept(item, index)
          break
        case FriendshipConstants.FriendshipType.outbound:
          onCancel(item, index)
          break
      }
    },
    [onAddFriend, onUnfriend, onAccept, onCancel, isLoading, currentUser],
  )

  const onUnfriend = async (item, index) => {
    await unfriend(currentUser, item.user)
  }

  const onAddFriend = async (item, index) => {
    setIsLoading(true)
    await addEdge(currentUser, item.user)
    await pullToRefresh(currentUser?.id)
    setIsLoading(false)
  }

  const onCancel = async (item, index) => {
    await unfriend(currentUser, item.user)
  }

  const onAccept = async (item, index) => {
    setIsLoading(true)
    await addEdge(currentUser, item.user)
    await pullToRefresh(currentUser?.id)
    setIsLoading(false)
  }

  const onFriendItemPress = useCallback(
    friendship => {
      if (friendship.user && friendship.user.id == currentUser.id) {
        return
      }
      navigation.push('FriendsProfile', {
        user: friendship.user,
        lastScreenTitle: 'Friends',
      })
    },
    [navigation],
  )

  const onEmptyStatePress = useCallback(() => {
    onSearchButtonPress()
  }, [onSearchButtonPress])

  const emptyStateConfig = {
    title: localized('No Friends'),
    description: localized(
      'Make some friend requests and have your friends accept them. All your friends will show up here.',
    ),
    buttonName: localized('Find friends'),
    onPress: onEmptyStatePress,
  }

  const pullToRefreshConfig = {
    refreshing: refreshing,
    onRefresh: () => {
      pullToRefresh(currentUser?.id)
    },
  }

  return (
    <IMFriendsListComponent
      onListEndReached={onFriendshipsListEndReached}
      friendsData={friendships}
      searchBar={true}
      onSearchBarPress={onSearchButtonPress}
      onFriendItemPress={onFriendItemPress}
      onFriendAction={onFriendAction}
      isLoading={isLoading}
      followEnabled={followEnabled}
      emptyStateConfig={emptyStateConfig}
      pullToRefreshConfig={pullToRefreshConfig}
      displayActions={true}
      viewer={currentUser}
    />
  )
}

export default IMFriendsScreen
