import React from 'react'
import { View } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import SearchBarAlternate from '../../../ui/SearchBarAlternate/SearchBarAlternate'
import { TNStoriesTray } from '../../../truly-native'
import dynamicStyles from './styles'
import IMConversationListView from '../../IMConversationListView/IMConversationListView'

function IMChatHomeComponent(props) {
  const {
    friends,
    onFriendListEndReached,
    onSearchBarPress,
    onFriendItemPress,
    navigation,
    onEmptyStatePress,
    searchBarplaceholderTitle,
    emptyStateConfig,
  } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  const styles = dynamicStyles(theme, appearance)

  const defaultEmptyStateConfig = {
    title: localized('No Conversations'),
    description: localized(
      'Add some friends and start chatting with them. Your conversations will show up here.',
    ),
    buttonName: localized('Add friends'),
    onPress: onEmptyStatePress,
  }

  return (
    <View style={styles.container}>
      <View style={styles.chatsChannelContainer}>
        <IMConversationListView
          navigation={navigation}
          emptyStateConfig={emptyStateConfig ?? defaultEmptyStateConfig}
          headerComponent={
            <>
              <View style={styles.searchBarContainer}>
                <SearchBarAlternate
                  onPress={onSearchBarPress}
                  placeholderTitle={
                    searchBarplaceholderTitle ?? localized('Search for friends')
                  }
                />
              </View>
              {friends && friends.length > 0 && (
                <TNStoriesTray
                  onStoryItemPress={onFriendItemPress}
                  onListEndReached={onFriendListEndReached}
                  storyItemContainerStyle={styles.userImageContainer}
                  data={friends}
                  displayVerifiedBadge={false}
                  displayLastName={false}
                  showOnlineIndicator={true}
                />
              )}
            </>
          }
        />
      </View>
    </View>
  )
}

export default IMChatHomeComponent
