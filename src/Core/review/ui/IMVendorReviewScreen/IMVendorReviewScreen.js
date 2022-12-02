import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { useReviewMutations, useReviews } from '../../api'
import FastImage from 'react-native-fast-image'
import { useTheme, useTranslations } from 'dopenative'
import IMAddReviewModal from '../../components/IMAddReviewModal/IMAddReviewModal'
import dynamicStyles from './styles'
import { TNEmptyStateView } from '../../../truly-native'
import IMVendorReviewItem from './IMVendorReviewItem/IMVendorReviewItem'
import { useCurrentUser } from '../../../onboarding'
import { useVendorConfig } from '../../../vendor/hooks/useVendorConfig'

function IMVendorReview({ navigation, route }) {
  const currentUser = useCurrentUser()

  const [isVisible, setVisible] = useState(false)

  const id = route.params?.entityID ?? ''

  const { config } = useVendorConfig()
  const isVendorAdmin =
    currentUser?.role === 'vendor' && currentUser.vendorID === id

  const { loading, reviews } = useReviews(
    config.tables?.vendorReviewsTableName,
    id,
  )
  const { addReview } = useReviewMutations(
    config.tables?.vendorReviewsTableName,
    config.tables?.vendorProductsTableName,
  )

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const emptyStateConfig = {
    title: localized('No reviews'),
    description: localized('There are currently no reviews for this vendor.'),
  }

  if (!isVendorAdmin) {
    emptyStateConfig.buttonName = localized('Add Review')
    emptyStateConfig.onPress = showModal
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    })
  }, [])

  const renderHeaderRight = () => {
    if (!isVendorAdmin) {
      return (
        <TouchableOpacity onPress={() => showModal()}>
          <FastImage
            tintColor={theme.colors[appearance].primaryForeground}
            style={styles.headerRightContainer}
            source={theme.icons.create}
          />
        </TouchableOpacity>
      )
    }
  }

  function showModal() {
    setVisible(true)
  }

  const renderSingleReview = ({ item, index }) => {
    return (
      <IMVendorReviewItem
        singleReview={item?.singleReview}
        key={`${item?.id ?? index}`}
      />
    )
  }
  return (
    <View style={styles.container}>
      <IMAddReviewModal
        isVisible={isVisible}
        close={() => setVisible(false)}
        submitReview={(rating, review) =>
          addReview(id, rating, review, currentUser)
        }
      />
      {reviews.length === 0 && !loading && (
        <>
          <TNEmptyStateView
            emptyStateConfig={emptyStateConfig}
            style={styles.emptystateConfig}
          />
        </>
      )}

      <FlatList
        data={reviews}
        renderItem={renderSingleReview}
        style={styles.container}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default IMVendorReview
