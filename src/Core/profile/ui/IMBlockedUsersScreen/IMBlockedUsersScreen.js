import React, { useLayoutEffect, useCallback, useState } from 'react'
import { useTheme, useTranslations } from 'dopenative'
import IMBlockedUsersComponent from '../components/IMBlockedUsersComponent/IMBlockedUsersComponent'
import {
  useUserReporting,
  useUserReportingMutations,
} from '../../../user-reporting/index'
import { useCurrentUser } from '../../../onboarding'

const IMBlockedUsersScreen = props => {
  const navigation = props.navigation

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  const [isLoading, setIsLoading] = useState(false)

  const currentUser = useCurrentUser()
  const { unblockUser } = useUserReportingMutations()
  const { blockedUsers, loadMoreBlockedUsers, isLoadingMore } =
    useUserReporting(currentUser.id)

  const onUserUnblock = useCallback(
    async userID => {
      setIsLoading(true)
      await unblockUser(currentUser.id, userID)

      setIsLoading(false)
    },
    [unblockUser, currentUser.id],
  )

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]
    navigation.setOptions({
      headerTitle: localized('Blocked Users'),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [])

  const emptyStateConfig = {
    title: localized('No Blocked Users'),
    description: localized(
      "You haven't blocked nor reported anyone yet, The users that you block or report will show up here",
    ),
  }

  return (
    <IMBlockedUsersComponent
      blockedUsers={blockedUsers}
      onUserUnblock={onUserUnblock}
      isLoading={isLoading}
      emptyStateConfig={emptyStateConfig}
      loadMore={loadMoreBlockedUsers}
      isLoadingMore={isLoadingMore}
    />
  )
}

export default IMBlockedUsersScreen
