import React from 'react'
import Modal from 'react-native-modal'
import { Text, View, Image } from 'react-native'
import PropTypes from 'prop-types'
import { useTheme, useTranslations } from 'dopenative'
import Tick from '../../../assets/icons/tick.png'
import * as Progress from 'react-native-progress'
import dynamicStyles from './styles'

export function IMPlacingOrderModal(props) {
  const { isVisible, onCancel, cartItems, user, shippingAddress } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  function undo() {
    onCancel()
  }

  function renderCartItems(item) {
    return (
      <View style={styles.orderPane}>
        <Text style={[styles.productItem, styles.number]}>{item.quantity}</Text>
        <Text style={[styles.productItem]}>{item.name}</Text>
      </View>
    )
  }

  return (
    <Modal
      onModalShow={() => {}}
      onModalHide={() => clearTimeout(countDown())}
      isVisible={isVisible}
      style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>{localized('Placing Order...')}</Text>
        <View style={styles.progress}>
          <Progress.Circle
            animated
            color="blue"
            indeterminate
            indeterminateAnimationDuration={6000}
            size={24}
            borderWidth={3}
          />
        </View>
        <View style={styles.addressPane}>
          <Image style={styles.tick} source={Tick} />
          <View>
            <Text style={styles.text}>{`${shippingAddress.line1 || ''} ${
              shippingAddress.line2 || ''
            } ${shippingAddress.postalCode || ''} ${
              shippingAddress.city || ''
            }`}</Text>
            <Text style={styles.description}>Deliver to door</Text>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.addressPane}>
          <Image style={styles.tick} source={Tick} />
          <View>
            <Text style={styles.text}>
              {localized('Your order')}, {user.firstName}
            </Text>
          </View>
        </View>
        {cartItems.map(item => renderCartItems(item))}
        <Text style={styles.undo} onPress={() => undo()}>
          {localized('Undo')}
        </Text>
      </View>
    </Modal>
  )
}

IMPlacingOrderModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onFinish: PropTypes.func,
  cartItems: PropTypes.array,
  user: PropTypes.object,
}
