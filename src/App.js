import 'react-native-reanimated'
import React, { useEffect } from 'react'
import { AppRegistry, LogBox } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { Provider } from 'react-redux'
import { extendTheme, DNProvider, TranslationProvider } from 'dopenative'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import AppReducer from './redux'
import AppContent from './AppContent'
import translations from './translations/'
import { ConfigProvider } from './config'
import { AuthProvider } from './Core/onboarding/hooks/useAuth'
import { ProfileAuthProvider } from './Core/profile/hooks/useProfileAuth'
import { authManager } from './Core/onboarding/api'
import InstamobileTheme from './theme'

const store = createStore(AppReducer, applyMiddleware(thunk))

const App = () => {
  const theme = extendTheme(InstamobileTheme)

  useEffect(() => {
    SplashScreen.hide()
    LogBox.ignoreAllLogs(true)
    LogBox.ignoreLogs(['EventEmitter.removeListener'])
  }, [])

  return (
    <Provider store={store}>
      <TranslationProvider translations={translations}>
        <DNProvider theme={theme}>
          <ConfigProvider>
            <AuthProvider authManager={authManager}>
              <ProfileAuthProvider authManager={authManager}>
                <AppContent />
              </ProfileAuthProvider>
            </AuthProvider>
          </ConfigProvider>
        </DNProvider>
      </TranslationProvider>
    </Provider>
  )
}

App.propTypes = {}

App.defaultProps = {}

// AppRegistry.registerComponent('App', () => App)

export default App
