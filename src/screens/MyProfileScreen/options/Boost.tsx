import React, { useState } from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { useTranslations, useTheme } from 'dopenative'
import { BoostIcon } from '../../../components/SVG/Boost'
import BoostModal from '../../../components/boost/BoostModal'

const BoostOption = () => {
  const { localized } = useTranslations() as { localized: any }
  const { theme, appearance } = useTheme() as {
    theme: any
    appearance: 'dark' | 'light'
  }
  const colorSet = theme.colors[appearance]
  const styles = dynamicStyles(colorSet)
  //Boost modal state
  const [boostModalOpen, setBoostModalOpen] = useState(false)
  const onBoostModalClose = () => setBoostModalOpen(false)
  const onBoostModalOpen = () => setBoostModalOpen(true)

  return (
    <>
      <BoostModal onClose={onBoostModalClose} isVisible={boostModalOpen} />
      <TouchableOpacity style={styles.optionView} onPress={onBoostModalOpen}>
        <View style={styles.iconView}>
          <BoostIcon size={24} />
        </View>
        <View style={styles.textView}>
          <Text style={styles.textLabel}>{localized('Get a boost')}</Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default React.memo(BoostOption)

const dynamicStyles = colorSet =>
  StyleSheet.create({
    optionView: {
      width: '100%',
      marginVertical: 9,
      paddingHorizontal: 12,
      flexDirection: 'row',
    },
    iconView: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textView: {
      flex: 0.8,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    textLabel: {
      fontSize: 16,
      color: colorSet.primaryText,
    },
  })
