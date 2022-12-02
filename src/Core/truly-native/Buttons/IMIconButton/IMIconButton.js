import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

function IMIconButton(props) {
  const { tintColor, onPress, source, marginRight, width, height, disabled } = props
  return (
    <TouchableOpacity disabled={disabled} style={{ marginRight: marginRight }} onPress={onPress}>
      <Image
        style={{ width: width, height: height, tintColor: disabled ? "#dae3d7" : tintColor }}
        source={source}
      />
    </TouchableOpacity>
  )
}

export default IMIconButton
