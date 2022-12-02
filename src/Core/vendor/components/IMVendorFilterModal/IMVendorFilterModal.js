import React from 'react'
import { View, Text, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { useTheme } from 'dopenative'
import Modal from 'react-native-modal'
import dynamicStyles from './styles'

export default function IMVendorFilterModal({ filters, isVisible, close }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <Modal style={styles.modalContainer} isVisible={isVisible}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.modalHeaderContainer}>
            <Text />
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableWithoutFeedback
              style={styles.doneContainer}
              onPress={close}>
              <Text style={styles.filterTitle}>Done</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Price</Text>
            <Text style={styles.filterSubtitle}>{filters.Price}</Text>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Good for Breakfast</Text>
            <Text style={styles.filterSubtitle}>
              {filters['Good for Breakfast']}
            </Text>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Good for Lunch</Text>
            <Text style={styles.filterSubtitle}>
              {filters['Good for Lunch']}
            </Text>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Good for Dinner</Text>
            <Text style={styles.filterSubtitle}>
              {filters['Good for Dinner']}
            </Text>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Takes Reservations</Text>
            <Text style={styles.filterSubtitle}>
              {filters['Takes Reservations']}
            </Text>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Vegetarian Friendly</Text>
            <Text style={styles.filterSubtitle}>
              {filters['Vegetarian Friendly']}
            </Text>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Cuisine</Text>
            <Text style={styles.filterSubtitle}>{filters.Cuisine}</Text>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Live Music</Text>
            <Text style={styles.filterSubtitle}>{filters['Live Music']}</Text>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Outdoor Seating</Text>
            <Text style={styles.filterSubtitle}>
              {filters['Outdoor Seating']}
            </Text>
          </View>
          <View style={styles.singleFilterContainer}>
            <Text style={styles.filterTitle}>Free Wi-Fi</Text>
            <Text style={styles.filterSubtitle}>{filters['Free Wi-Fi']}</Text>
          </View>
        </View>
      </ScrollView>
    </Modal>
  )
}
