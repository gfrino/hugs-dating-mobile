import React from 'react'
import { View } from 'react-native'
import IMAVCallContainerView from './IMAVCallContainerView/IMAVCallContainerView'

const IMAVAppCallWrapper = MainComponent => {
  const Component = props => {
    return (
      <View style={{ flex: 1 }}>
        <MainComponent {...props} />
        <IMAVCallContainerView />
      </View>
    )
  }
  return Component
}

export default IMAVAppCallWrapper
