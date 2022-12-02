import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { FlatList, Text, View } from 'react-native'
import Button from 'react-native-button'
import FastImage from 'react-native-fast-image'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import Hamburger from '../../../../../components/Hamburger/Hamburger'
import { useAdminOrders, useAdminOrdersMutations } from '../../api'

function AdminOrderListScreen({ navigation }) {
  const apiManager = useRef(null)

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { orders } = useAdminOrders()
  const { deleteOrder } = useAdminOrdersMutations()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: localized('Orders'),
      headerRight: null,
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      ),
    })
  }, [])

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <View>
        {item != null &&
          item.products != null &&
          item.products[0] != null &&
          item.products[0].photo != null &&
          item.products[0].photo.length > 0 && (
            <FastImage
              animationStyle="fade"
              placeholderColor={theme.colors[appearance].grey9}
              style={styles.photo}
              source={{ uri: item.products[0].photo }}
            />
          )}
        <View style={styles.overlay} />
      </View>
      {item?.products?.map(product => {
        return (
          <View style={styles.rowContainer} key={product.id}>
            <Text style={styles.quantityLabel}>{product.quantity}</Text>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>
        )
      })}
      <View style={styles.actionContainer}>
        <Text style={styles.total}>
          Total: $
          {(
            item?.products?.reduce(
              (prev, next) => prev + next.price * next.count,
              0,
            ) + 1
          ).toFixed(2)}
        </Text>
        <Button
          containerStyle={styles.actionButtonContainer}
          style={styles.actionButtonText}
          onPress={() => deleteOrder(item.id)}>
          {localized('Delete')}
        </Button>
      </View>
    </View>
  )
  return (
    <FlatList
      style={styles.flat}
      data={orders}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
      initialNumToRender={5}
    />
  )
}

export default AdminOrderListScreen
