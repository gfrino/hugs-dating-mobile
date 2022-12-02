import React from 'react'
import { AdMobBanner } from 'expo-ads-admob'
import { View } from 'react-native'
import styles from './styles'
import { useAdsConfig } from '../../hooks/useAdsConfig'

export default function IMAdMobBanner({ onAdLoaded, onAdFailedToLoad }) {
  const { config } = useAdsConfig()
  return (
    <View style={styles.adContainer}>
      <AdMobBanner
        bannerSize={config.adMobConfig.adBannerSize}
        adUnitID={config.adMobConfig.adUnitID}
        onDidFailToReceiveAdWithError={onAdFailedToLoad}
        onAdLoaded={onAdLoaded}
      />
    </View>
  )
}
