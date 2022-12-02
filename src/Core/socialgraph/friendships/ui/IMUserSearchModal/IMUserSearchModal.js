import React, {
  useContext,
  useLayoutEffect,
  useState,
  useRef,
  useEffect,
} from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { useCurrentUser } from '../../../../onboarding'
import { useSearchUsers, useSocialGraphMutations } from '../../api'
import IMFriendItem from '../../ui/IMFriendItem/IMFriendItem'
import dynamicStyles from './styles'
import SearchBarAlternate from '../../../../ui/SearchBarAlternate/SearchBarAlternate'

function IMUserSearchModal(props) {
  const { onFriendItemPress, navigation, route } = props

  const currentUser = useCurrentUser()

  const { addEdge } = useSocialGraphMutations()
  const { users, search, removeUserAt } = useSearchUsers(currentUser?.id)

  const searchBarRef = useRef(null)

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const followEnabled = route.params.followEnabled

  const [keyword, setKeyword] = useState('')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: localized('Search users...'),
      headerStyle: {
        backgroundColor: theme.colors[appearance].primaryBackbround,
        borderBottomColor: theme.colors[appearance].hairline,
      },
    })
  }, [])

  useEffect(() => {
    console.log(`changed keyword ${keyword}`)
    search(keyword)
  }, [keyword])

  const renderItem = ({ item, index }) => (
    <IMFriendItem
      item={{ user: item, type: 'none' }}
      key={index}
      onFriendAction={() => onAddFriend(item, index)}
      onFriendItemPress={onFriendItemPress}
      followEnabled={followEnabled}
      displayActions={true}
    />
  )

  const onSearchClear = () => {
    setKeyword('')
  }

  const onSearchBarCancel = async () => {
    if (searchBarRef.current) {
      searchBarRef.current.blur()
    }
    navigation.goBack()
  }

  const onSearchTextChange = text => {
    setKeyword(text.trim())
  }

  const onAddFriend = (user, index) => {
    removeUserAt(index)
    addEdge(currentUser, user, response => {
      if (response?.error) {
        alert(response?.error)
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBarAlternate
          onChangeText={onSearchTextChange}
          placeholderTitle={localized('Search for people')}
          onSearchBarCancel={onSearchBarCancel}
          value={keyword}
        />
      </View>

      {users === null && (
        <ActivityIndicator
          style={{ marginTop: 15 }}
          size="small"
          color="#cccccc"
        />
      )}
      <FlatList
        keyboardShouldPersistTaps="always"
        data={users}
        renderItem={renderItem}
      />
    </View>
  )
}

export default IMUserSearchModal
