import React from 'react'
import moment from 'moment'
import { View, Text } from 'react-native'
import { useTheme } from 'dopenative'
import { Icon } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import dynamicStyles from './styles'

export default function IMVendorReviewItem({ singleReview }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const now = Date.now() / 1000
  const date = moment.unix(singleReview?.createdAt?.seconds ?? now)
  return (
    <View style={styles.reviewContainer}>
      <View style={[styles.horizontalPane, styles.pad]}>
        <View style={styles.horizontalPane}>
          <FastImage
            source={{ uri: singleReview.authorProfilePic }}
            style={styles.profilePic}
          />
          <View>
            <Text style={styles.authorName}>{singleReview.authorName}</Text>
            <Text style={styles.date}>{date.format('MMMM Do YYYY')}</Text>
          </View>
        </View>

        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map(item => (
            <Icon
              size={15}
              key={item}
              type="ionicon"
              style={styles.starStyle}
              name={
                item <= singleReview.rating
                  ? 'ios-star-sharp'
                  : 'ios-star-outline'
              }
              color={theme.colors[appearance].primaryForeground}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{singleReview.text}</Text>
    </View>
  )
}
