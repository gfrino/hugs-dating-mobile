import React, { useMemo } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from 'dopenative'
import { TNStoriesTray } from '../../Core/truly-native'
import { IMConversationListView } from '../../Core/chat'
import dynamicStyles from './styles'

const maxChannels = 2

function ConversationsHomeComponent(props) {
  const {
    matches,
    onMatchUserItemPress,
    navigation,
    emptyStateConfig,
    audioVideoChatConfig,
  } = props
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const channels = useSelector(state => state.chat.channels ?? [])
  const isPremium = useSelector(state => state.inAppPurchase.isPlanActive)

  const inactiveConversations = useMemo(() => {
    const channelsParticipantsIDs = channels.flatMap(channel =>
      channel.participants.map(participant => participant.id),
    )

    return matches.filter(match => !channelsParticipantsIDs.includes(match.id))
  }, [matches, channels])

  const renderHeaderComponent = () => {
    return (
      <TNStoriesTray
        onStoryItemPress={onMatchUserItemPress}
        storyItemContainerStyle={styles.userImageContainer}
        data={inactiveConversations}
        displayLastName={false}
        showOnlineIndicator={true}
        isPremium={isPremium}
        maxChannels={maxChannels}
      />
    )
  }

  return (
    <View style={styles.container}>
      <IMConversationListView
        navigation={navigation}
        emptyStateConfig={emptyStateConfig}
        audioVideoChatConfig={audioVideoChatConfig}
        headerComponent={renderHeaderComponent}
        isPremium={isPremium}
        maxChannels={maxChannels}
      />
    </View>
  )
}

export default ConversationsHomeComponent
