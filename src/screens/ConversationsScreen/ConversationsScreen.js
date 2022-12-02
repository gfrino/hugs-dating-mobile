import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslations } from 'dopenative'
import CardDetailsView from '../../components/swipe/CardDetailsView/CardDetailsView'
import ConversationsHomeComponent from './ConversationsHomeComponent'
import { SwipeTracker } from '../../api/'

const ConversationsScreen = props => {
  const currentUser = useSelector(state => state.auth.user)

  const [matches, setMatches] = useState([])

  const { localized } = useTranslations()

  const [selectedUser, setSelectedUser] = useState({})
  const [isUserProfileDetailVisible, setIsUserProfileDetailVisible] =
    useState(false)

  const swipeTracker = useRef(null)

  useEffect(() => {
    swipeTracker.current = new SwipeTracker(currentUser?.id)
    swipeTracker.current.subscribeMatches(onMatchesUpdate)
  }, [])

  const onMatchesUpdate = data => {
    setMatches(data)
  }


  const onEmptyStatePress = () => {
    props.navigation.navigate('Swipe')
  }

  const onMatchUserItemPress = otherUser => {
    const id1 = currentUser.id || currentUser.userID
    const id2 = otherUser.id || otherUser.userID
    const channel = {
      id: id1 < id2 ? id1 + id2 : id2 + id1,
      participants: [otherUser],
    }
    props.navigation.navigate('PersonalChat', { channel })
  }

  const emptyStateConfig = {
    title: localized('No Conversations'),
    description: localized(
      'Start chatting with the people you matched, Your conversations will show up here',
    ),
    buttonName: localized('Start swiping'),
    onPress: onEmptyStatePress,
  }

  return (
    <ConversationsHomeComponent
      matches={matches}
      onMatchUserItemPress={onMatchUserItemPress}
      navigation={props.navigation}
      emptyStateConfig={emptyStateConfig}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff4',
  },
  cardDetailContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardDetailL: {
    // position: 'absolute',
    // bottom: 0,
    // width: Statics.DEVICE_WIDTH,
    // height: Statics.DEVICE_HEIGHT * 0.95,
    // paddingBottom: size(100),
    backgroundColor: 'white',
  },
})

export default ConversationsScreen
