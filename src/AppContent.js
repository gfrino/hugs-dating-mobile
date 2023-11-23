import React from 'react'
import { StatusBar } from 'react-native'
import { OnboardingConfigProvider } from './Core/onboarding/hooks/useOnboardingConfig'
import IAPManagerWrapped from './Core/inAppPurchase/IAPManagerWrapped'
import { IAPConfigProvider } from './Core/inAppPurchase/hooks/useIAPConfig'
import { AppNavigator } from './navigations/AppNavigation'
import { useConfig } from './config'
// VIDEO_CALL_FLAG_ENABLED_BEGIN
import { IMAVAppCallWrapper } from './Core/avchat'
// VIDEO_CALL_FLAG_ENABLED_END
import { ProfileConfigProvider } from './Core/profile/hooks/useProfileConfig'
import { useTheme } from 'dopenative'

const MainNavigator =
  // VIDEO_CALL_FLAG_ENABLED_BEGIN
  IMAVAppCallWrapper(
    // VIDEO_CALL_FLAG_ENABLED_END
    AppNavigator,
    // VIDEO_CALL_FLAG_ENABLED_BEGIN
  )
// VIDEO_CALL_FLAG_ENABLED_END

export default AppContent = () => {
  const config = useConfig()

  const { theme, appearance } = useTheme()

  return (
    <ProfileConfigProvider config={config}>
      <OnboardingConfigProvider config={config}>
        <IAPConfigProvider config={config}>
          <IAPManagerWrapped>
          {/* translucent={true} */}
            <StatusBar backgroundColor={"#eb5a6d"} />
            <MainNavigator />
          </IAPManagerWrapped>
        </IAPConfigProvider>
      </OnboardingConfigProvider>
    </ProfileConfigProvider>
  )
}
