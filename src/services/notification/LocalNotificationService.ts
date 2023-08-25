//@ts-ignore
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';


class LocalNotificationService {
    configure = (onOpenNotification: any) => {
        PushNotification.configure({
            onRegister: function (token: any) {
                console.log('@@@ FCM LOCAL NOTIFICATION SERVICE onRegister ===========', token);
            },
            onNotification: function (notification: any) {
                console.log('@@@ FCM LOCAL NOTIFICATION SERVICE onNotification ===========', notification);
                if (!notification.data) {
                    return;
                }
                notification.userInteraction = true;
                onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification);

                if (Platform.OS === 'ios') {
                    // (required) Called when a remote is received or opened, or local notification is opened
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },
            // Android only
            senderID: "937098546397",
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });


    }

    unregister = () => {
        PushNotification.unregister();
    }



    cancelAllLocalNotifications = () => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    }

    removeDeliveredNotificationByID = (notificationId: any) => {
        console.log('@@@ FCM LOCAL NOTIFICATION SERVICE Remove Delivered Notification ID ============', notificationId);
        PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
    }
}

export const localNotificationService = new LocalNotificationService();