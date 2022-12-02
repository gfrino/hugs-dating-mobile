import React, { useLayoutEffect, useState } from 'react'
import { FlatList, Text, View, TouchableWithoutFeedback } from 'react-native'
import Button from 'react-native-button'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import Hamburger from '../../../../components/Hamburger/Hamburger'
import { removeFromCart, updateCart } from '../../redux/actions'
import { TNEmptyStateView } from '../../../truly-native'
import EditCartModal from '../../components/EditCartModal/IMEditCartModal'
import { storeCartToDisk } from '../../redux/reducers'

function CartScreen(props) {
  const { route, navigation } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const emptyStateConfig = {
    title: localized('Empty Cart'),
    description: localized(
      'Your cart is currently empty. The food items you add to your cart will show up here.',
    ),
  }

  const cartItems = useSelector(state => state.cart.cartItems)
  const cartVendor = useSelector(state => state.cart.cartVendor)

  const dispatch = useDispatch()

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: localized('Your Cart'),
      headerLeft: () => (
        <Hamburger
          onPress={() => {
            props.navigation.openDrawer()
          }}
        />
      ),
      headerRight: () => <View />,
    })
  }, [])

  const [item, setItem] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const [id, setId] = useState(0)
  const [placeOrderVisible, setPlaceOrderVisible] = useState(false)

  const renderFooter = () => {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={styles.title}>{localized('Total')}</Text>
          <Text style={styles.price}>
            $
            {cartItems
              .reduce((prev, next) => prev + next.price * next.quantity, 0)
              .toFixed(2)}
          </Text>
        </View>
      </View>
    )
  }

  const onItemPress = (pressedItem, pressedId) => {
    setId(pressedId)
    setItem(pressedItem)
    setIsVisible(true)
  }

  const onPress = () => {
    navigation.navigate('AddAddress')
  }

  const renderItem = ({ item: singleCartItem }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => onItemPress(singleCartItem)}
        style={styles.container}>
        <View style={styles.rowContainer} key={singleCartItem.id}>
          <Text style={styles.count}>{singleCartItem.quantity}</Text>
          <Text style={styles.title}>{singleCartItem.name}</Text>
          <Text style={styles.price}>${singleCartItem.price}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  return (
    <View style={styles.container}>
      <EditCartModal
        item={item}
        id={id}
        style={styles}
        close={() => setIsVisible(false)}
        deleteCart={() => {
          setIsVisible(false)
          dispatch(removeFromCart(item))
        }}
        updateCart={(newCartItem, newCartid) =>
          dispatch(updateCart(newCartItem, newCartid))
        }
        isVisible={isVisible}
        onModalHide={async () => storeCartToDisk(cartItems, cartVendor)}
      />
      {cartItems.length > 0 && (
        <FlatList
          style={styles.flat}
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={singleCartItem => `${singleCartItem.id}`}
          ListFooterComponent={renderFooter}
        />
      )}
      {cartItems.length === 0 && (
        <View style={styles.emptyViewContainer}>
          <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
        </View>
      )}
      {cartItems.length > 0 && (
        <Button
          containerStyle={styles.actionButtonContainer}
          style={styles.actionButtonText}
          onPress={() => onPress()}>
          {localized('CHECKOUT')}
        </Button>
      )}
    </View>
  )
}

CartScreen.propTypes = {
  cartItems: PropTypes.array,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
}
export default CartScreen
