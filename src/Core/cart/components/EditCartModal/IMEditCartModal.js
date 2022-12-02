import React, { useState } from 'react'
import { View, Text } from 'react-native'
import Modal from 'react-native-modal'
import Button from 'react-native-button'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'

export default function EditCartModal({
  id,
  close,
  item,
  updateCart,
  deleteCart,
  isVisible,
  onModalHide,
}) {
  const [quantity, setQuantity] = useState(0)

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <Modal
      style={styles.modalContainer}
      swipeDirection="down"
      isVisible={isVisible}
      onModalShow={() => setQuantity(item.quantity)}
      onModalHide={onModalHide}
      onSwipeComplete={close}>
      <View style={styles.container}>
        <Text style={styles.price}>{item.name}</Text>
        <View style={styles.buttonSet}>
          <Button
            containerStyle={styles.buttonContainer}
            style={styles.buttonText}
            onPress={() => {
              if (quantity !== 1) {
                setQuantity(quantity - 1)
              }
            }}>
            -
          </Button>
          <Text style={styles.quantityLabel}>{quantity}</Text>
          <Button
            containerStyle={styles.buttonContainer}
            style={styles.buttonText}
            onPress={() => setQuantity(quantity + 1)}>
            +
          </Button>
        </View>
        <View style={styles.actionContainer}>
          <Button
            containerStyle={styles.actionButtonContainer}
            style={styles.actionButtonText}
            onPress={() => {
              item.quantity = quantity
              updateCart(item, id)
              close()
            }}>
            {localized('Update Cart')}
          </Button>
        </View>
        <Button style={styles.deleteItem} onPress={deleteCart}>
          {localized('Remove from Cart')}
        </Button>
      </View>
    </Modal>
  )
}
