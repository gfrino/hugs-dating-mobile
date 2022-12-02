import React, { memo, useCallback, useEffect } from 'react'
import IMConversationList from '../IMConversationList'
import { useChatChannels } from '../api'
import { useCurrentUser } from '../../onboarding'
import { useIsFocused } from "@react-navigation/native"

const IMConversationListView = props => {
  const { navigation, headerComponent, emptyStateConfig, isPremium, maxChannels } = props
  const currentUser = useCurrentUser()

  const {
    channels,
    refreshing,
    subscribeToChannels,
    loadMoreChannels,
    pullToRefresh,
  } = useChatChannels({
    maxChannels,
    isPremium,
  })

  useEffect(() => {
    const unsubscribe = subscribeToChannels(currentUser?.id)
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [currentUser?.id])

  const onConversationPress = useCallback(
    channel => {
      navigation.navigate('PersonalChat', {
        channel: { ...channel, name: channel.title },
      })
    },
    [navigation],
  )

  const onListEndReached = useCallback(() => {
    loadMoreChannels(currentUser?.id)
  }, [loadMoreChannels])

  const onPullToRefresh = useCallback(() => {
    pullToRefresh(currentUser?.id)
  }, [pullToRefresh])

  const pullToRefreshConfig = { refreshing, onRefresh: onPullToRefresh }

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      pullToRefresh(currentUser?.id)
    }
  }, [isFocused])



  return (
    <IMConversationList
      loading={channels == null}
      conversations={channels}
      onConversationPress={onConversationPress}
      emptyStateConfig={emptyStateConfig}
      user={currentUser}
      headerComponent={headerComponent}
      onListEndReached={onListEndReached}
      pullToRefreshConfig={pullToRefreshConfig}
    />
  )
}

export default memo(IMConversationListView)
