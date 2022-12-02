import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import Button from 'react-native-button'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import { Icon } from 'react-native-elements'

export default function AddReviewModal({ submitReview, close, isVisible }) {
  const [rating, setRating] = useState(4)
  const [review, setReview] = useState('')

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const onTypeReview = text => {
    setReview(text)
  }

  const onSubmit = () => {
    submitReview(rating, review)
    close()
  }
  return (
    <Modal
      onSwipeComplete={close}
      swipeDirection="down"
      visible={isVisible}
      backdropColor={'grey'}>
      <KeyboardAvoidingView behavior={'height'} style={styles.container}>
        <View style={[styles.bar, styles.navBarContainer]}>
          <Text style={styles.headerTitle}>{localized('Add Review')}</Text>
          <Text
            style={[styles.rightButton, styles.selectorRightButton]}
            onPress={close}>
            {localized('Cancel')}
          </Text>
        </View>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map(item => (
            <Icon
              size={30}
              key={item}
              type="ionicon"
              style={styles.starStyle}
              onPress={() => setRating(item)}
              name={item <= rating ? 'ios-star-sharp' : 'ios-star-outline'}
              color={theme.colors[appearance].primaryForeground}
            />
          ))}
        </View>

        <TextInput
          placeholder={localized('Please write your review here')}
          placeholderTextColor={theme.colors[appearance].secondaryText}
          multiline
          onChangeText={onTypeReview}
          style={styles.input}
        />
        <Button
          containerStyle={styles.actionButtonContainer}
          style={styles.actionButtonText}
          onPress={onSubmit}>
          {localized('Add Review')}
        </Button>
      </KeyboardAvoidingView>
    </Modal>
  )
}
