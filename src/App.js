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
// import messaging from '@react-native-firebase/messaging';
// import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localNotificationService } from './services/notification/LocalNotificationService'
import { fcmService } from './services/notification/FCMService'
// import { Toast } from "react-native-toast-message/lib/src/Toast";
// import { Box, useToast } from "native-base";

const store = createStore(AppReducer, applyMiddleware(thunk))

const App = () => {
  const theme = extendTheme(InstamobileTheme)
  // const toast = useToast();

  useEffect(() => {
    SplashScreen.hide()
    LogBox.ignoreAllLogs(true)
    LogBox.ignoreLogs(['EventEmitter.removeListener'])
  }, [])


  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //   //   toast.show({
  //   //     title: remoteMessage.notification?.title,
  //   //     description: remoteMessage.notification?.body,
  //   //  });
  //   //   Toast.show({
  //   //     type: 'success', // 'success', 'error', 'info'
  //   //     text1: remoteMessage.notification?.title,
  //   //     text2: remoteMessage.notification?.body,
  //   //     position: 'top', // 'top' or 'bottom'
  //   //     visibilityTime: 5000, // Duration in milliseconds
  //   //     autoHide: true, // Auto-hide the toast after duration
  //   //   });
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe;
  // }, []);

  //   useEffect(() => {
  //     notificationListenr()
  //     requestUserPermission()
  //   }, []);

  //   const requestUserPermission = async() => {
  //     const authStatus = await messaging().requestPermission();
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //       const token = await getToken()
  //       console.log("token" , token);
  //       // await sendFCMToken(token)
  //     }
  //   }

  //   const notificationListenr = () => {
  //     // Assume a message-notification contains a "type" property in the data payload of the screen to open
  //     messaging().onNotificationOpenedApp(remoteMessage => {
  //       console.log(
  //         'Notification caused app to open from background state:',
  //         remoteMessage.notification,
  //       );
  //     });
  
  //     // Check whether an initial notification is available
  //     messaging()
  //       .getInitialNotification()
  //       .then(remoteMessage => {
  //         if (remoteMessage) {
  //           console.log(
  //             'Notification caused app to open from quit state:',
  //             remoteMessage.notification,
  //           );
  //         }
  //       });
  //   }

  //   const getToken = async() => {
  //     await messaging().registerDeviceForRemoteMessages();
  //     let token = await AsyncStorage.getItem("notification_Token")
  //     console.log("old Token generated : " , token);

  //     if (!token) {
  //       try {
  //         const fcmtoken = await messaging().getToken();
  //         if (!!fcmtoken) {
  //            console.log("Fcm Token generated : " , fcmtoken);
  //           await AsyncStorage.setItem("notification_Token" , fcmtoken)
  //           return fcmtoken
  //         }
  //       } catch (error) {
  //         console.log("error in fcmToken : " , error);
  //       }
  //     }
  //     return token
    
  //   }

    //   const getToken = async() => {
    //   await messaging().registerDeviceForRemoteMessages();
    //   const token = await messaging().getToken();
    //   AsyncStorage.setItem("notification_Token" , token)
    //   console.log("user Token : " , token);
    // }




    useEffect(() => {
      console.log("hellll.........................");
      
      setupNotification();
    },[])
  
      const setupNotification = async () => {
      // // let accessToken = await StorageProvider.get('USER_FCM_TOKEN');
      // let accessToken = await AsyncStorage.getItem("notification_Token")
  
      // if (!accessToken) {
        try {
          console.log("step 2");
          
          fcmService.register(
            (token) => onRegister(token),
            (notify) => onNotification(notify),
            (notify) => onOpenNotification(notify),
          );
          localNotificationService.configure((notify) => 
            onOpenNotification(notify),
          );
        } catch (error) { console.log("step 3");}
      // }
    };
  
    const onRegister = async (token) => {
      console.log("onRegister");
      let fcmToken = await AsyncStorage.getItem("notification_Token")
      console.log("onRegister....fcmToken" , fcmToken);
      
      // let userID = await StorageProvider.get("USER_ID");
      // setState({ userID: userID })
      // this.sendDeviceTokenApiCallId = await this.apiCall({
      //   contentType: configJSON.productApiContentType,
      //   method: configJSON.apiMethodTypePut,
      //   endPoint: configJSON.sendDeviceTokenAPiEndPoint,
      //   body: data,
      // });
      // Customizable Area Start
      // Customizable Area End
    };
    const onNotification = (notify) => {
      // if (1001 !== 1001)
      //   return;
      let uniquedNotifId = Math.floor(Math.random() * 1000 + 1);
      const options = {
        soundName: "default",
        playSound: true,
      };
      if (notify.title) {
        console.log("@@@ FCM Show Notification ==========,", notificationMessageId)
        let notifyMessageId = notify.messageId.replace('0:', '').split('%');
        notifyMessageId = notifyMessageId[0].substr(notifyMessageId[0].length - 3);
        console.log('@@@ FCM Show Notification ID =====', notifyMessageId, uniquedNotifId)
        if (Number(notificationMessageId) != Number(notifyMessageId)) {
          console.log('@@@ FCM Show Notification ID ===== 111', notifyMessageId, uniquedNotifId)
          notificationMessageId = Number(notifyMessageId);
          // localNotificationService.showNotification(Number(notifyMessageId), notify.title, notify.message, notify, options);
        }
      }
      // Customizable Area Start
      // Customizable Area End
    };
    const onOpenNotification = (notify) => { };

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

AppRegistry.registerComponent('HugsDating', () => App)

export default App
