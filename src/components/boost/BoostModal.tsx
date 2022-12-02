import React, { useEffect, useState } from 'react'
import CurrentBoostModal from './CurrentBoostModal'
import StartBoostModal from './StartBoostModal'
import { useCurrentUser } from '../../Core/onboarding'
import { runOnUI, useSharedValue } from 'react-native-reanimated'
import { boostConfig } from '../../Core/boost'

interface Props {
  onClose: () => void
  isVisible: boolean
}

const BoostModal: React.FC<Props> = ({ onClose, isVisible }) => {
  const { activeBoost, lastBoostExpirationUnixTime } =
    useCurrentUser().boost || {}
  const progress = useSharedValue(0)

  const setProgress = () => {
    progress.value = 0
  }

  useEffect(() => {
    runOnUI(setProgress)()
  }, [activeBoost])

  if (activeBoost) {
    return (
      <CurrentBoostModal
        isVisible={isVisible}
        onClose={onClose}
        lastBoostExpirationUnixTime={lastBoostExpirationUnixTime}
        progress={progress}
      />
    )
  } else {
    return <StartBoostModal isVisible={isVisible} onClose={onClose} />
  }
}

export default React.memo(BoostModal)
