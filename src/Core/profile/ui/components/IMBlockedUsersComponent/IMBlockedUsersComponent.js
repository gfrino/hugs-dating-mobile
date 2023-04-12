import React from 'react'
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import { TNActivityIndicator, TNEmptyStateView } from '../../../../truly-native'
import { getDefaultProfilePicture } from '~/helpers/statics'

const IMBlockedUsersComponent = props => {
  const {
    isLoading,
    isLoadingMore,
    blockedUsers,
    onUserUnblock,
    emptyStateConfig,
    loadMore,
  } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const renderItemView = ({ item }) => {
    console.log("itemitemitem", item);
    const profilePicture = item.profilePictureURL
      ? item.user?.profilePictureURL
      : getDefaultProfilePicture(item.userCategory)
    return (
      <View style={styles.listItem}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        <View style={styles.centerItem}>
          <Text style={styles.text}>
            {item.user?.firstName} {item.user?.lastName}
          </Text>
          <Text style={styles.text}>{item.user?.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonOpacity}
          onPress={() => onUserUnblock(item.dest)}>
          <Text style={styles.button}>{localized('Unblock')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderListFooter = () => {
    if (isLoadingMore) {
      return <TNActivityIndicator style={{ marginVertical: 7 }} size="small" />
    }
    return null
  }

  return (
    <View style={styles.container}>
      {blockedUsers && blockedUsers.length > 0 && (
        <FlatList
          data={blockedUsers}
          renderItem={renderItemView}
          keyExtractor={(item) => item.email}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.3}
          onEndReached={loadMore}
          ListFooterComponent={renderListFooter}
        />
      )}
      {blockedUsers && blockedUsers.length <= 0 && (
        <View style={styles.emptyViewContainer}>
          <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
        </View>
      )}
      {(blockedUsers === null || isLoading) && <TNActivityIndicator />}
    </View>
  )
}

export default IMBlockedUsersComponent
