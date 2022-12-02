import React, { useState, useLayoutEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'
import IMRatingReview from '../../components/IMRatingReview/IMRatingReview'
import IMVendorFilterModal from '../../components/IMVendorFilterModal/IMVendorFilterModal'
import { useCurrentUser } from '../../../onboarding'

function IMVendorsScreen({
  navigation,
  vendors,
  renderListHeader,
  containerStyle,
  contentContainerStyle,
}) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [filters, setFilters] = useState({})
  const [isVisible, setVisible] = useState(false)

  const currentUser = useCurrentUser()

  const isAppAdmin = currentUser?.role === 'admin'

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    })
  }, [navigation])

  const renderHeaderRight = () => {
    if (isAppAdmin) {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EditVendor')
          }}>
          <Image
            style={styles.icon}
            source={require('../../../../assets/icons/add.png')}
          />
        </TouchableOpacity>
      )
    }
  }

  const onPressVendorItem = item => {
    navigation.navigate('SingleVendor', {
      vendor: item,
    })
  }

  const onPressReview = item => {
    navigation.navigate('Reviews', { entityID: item.id })
  }

  const onViewFilter = currentFilter => {
    setFilters(currentFilter)
    setVisible(true)
  }

  const renderVendorItem = ({ item }) => {
    let count = item.reviewsCount === undefined ? 0 : item.reviewsCount
    let reviewAvg =
      item.reviewsCount === undefined
        ? 0
        : Math.fround(item.reviewsSum / item.reviewsCount)
    reviewAvg = Number(Math.round(reviewAvg + 'e' + 2) + 'e-' + 2)
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressVendorItem(item)}>
        <View style={styles.vendorItemContainer}>
          <FastImage
            placeholderColor={theme.colors[appearance].grey9}
            style={styles.foodPhoto}
            source={{ uri: item.photo }}
          />
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{item.title}</Text>
          </View>
          <Text
            onPress={() => onViewFilter(item.filters)}
            style={styles.description}>
            Outdoor Seats, Free WIFI
          </Text>
          <IMRatingReview
            onPressReview={() => onPressReview(item)}
            number={count}
            rating={reviewAvg}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <IMVendorFilterModal
        isVisible={isVisible}
        filters={filters}
        close={() => setVisible(false)}
      />
      <FlatList
        style={containerStyle}
        contentContainerStyle={contentContainerStyle}
        initialNumToRender={12}
        data={vendors}
        renderItem={renderVendorItem}
        ListHeaderComponent={renderListHeader}
        keyExtractor={item => `${item.id}`}
      />
    </View>
  )
}

export default IMVendorsScreen
