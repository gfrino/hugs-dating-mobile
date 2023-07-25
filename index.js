/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

// For Android
AppRegistry.registerComponent(appName, () => App)

// For Ios
// AppRegistry.registerComponent('main', () => App)
