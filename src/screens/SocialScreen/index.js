import { useTranslations } from 'dopenative'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useWindowDimensions, Appearance, View } from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'
import { LeavesBackground } from '~/components/LeavesBackground'
import InstamobileTheme from '../../theme'
import NearYouScreen from './NearYouScreen'
import WhoLikesMeScreen from './WhoLikesMeScreen'

const isDarkMode = Appearance.getColorScheme() === 'dark'

const theme = isDarkMode
  ? InstamobileTheme.colors.dark
  : InstamobileTheme.colors.light

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: theme.primaryForeground }}
    style={{ backgroundColor: theme.primaryBackground }}
    activeColor={theme.primaryForeground}
    inactiveColor={isDarkMode ? '#bcbcbc' : '#969696'}
  />
)

const SocialScreen = () => {
  const layout = useWindowDimensions()

  const { localized } = useTranslations()

  const [index, setIndex] = useState(0)
  const [numLikesMe, setNumLikesMe] = useState(0)
  const [routes, setRoutes] = useState([
    { key: 'first', title: localized('Likes') },
    { key: 'second', title: localized('Near you') },
  ])

  useEffect(() => {
    setRoutes(prev => {
      const newRoutes = [...prev]
      newRoutes[0].title = `${localized('Likes')} ${
        numLikesMe ? `(${numLikesMe})` : ''
      }`
      return newRoutes
    })
  }, [numLikesMe])

  const renderScene = useCallback(({ route }) => {
    switch (route.key) {
      case 'first':
        return <WhoLikesMeScreen setNumLikesMe={setNumLikesMe} />
      case 'second':
        return <NearYouScreen />
      default:
        return null
    }
  }, [])
  
  return (
    <View style={{ flex: 1 }}>
      <LeavesBackground />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
      />
    </View>
  )
}

export default SocialScreen
