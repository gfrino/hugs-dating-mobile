import { firebase } from '@react-native-firebase/firestore'
import { updateUser, getUserByID , getUsersByIDs } from '../../users'
import { getUnixTimeStamp } from '../../helpers/timeFormat'
import {inspect} from 'util'


const notificationsRef = firebase.firestore().collection('notifications')
const fcmURL = 'https://fcm.googleapis.com/fcm/send'
const firebaseServerKey =
  'Key=AAAATiZitNY:APA91bEQ0354nB0Zkmo1XZXhzRHv9VnTuEahZkCGl1BJUteYhpcyksIV4Y0PIcZvdIJykfZeD70rHdIdQgMdWwnQNyVvkfiG7pjDihMXyYub9SiJ3izateFFeFFZBTRfgBgHKMu3tlRy'

  
const handleUserBadgeCount = async userID => {
  const user = await getUserByID(userID)

  const newBadgeCount = (user?.badgeCount ?? 0) + 1
  updateUser(userID, { badgeCount: newBadgeCount })
  return newBadgeCount
}

const sendPushNotification = async (
  toUser,
  title,
  body,
  type,
  metadata = {},
) => {

  console.log("sent push notifications" , toUser?.id)
  const user = await getUserByID(toUser?.id)



  if (metadata && metadata.outBound && user.id == metadata.outBound.id) {

    return
  }
  if (user.settings && user.settings.push_notifications_enabled == false) {

    return
  }
  const recipientData = user; 
  if (!recipientData || !recipientData?.pushToken) {
    return
  }

  const notification = {
    toUserID: user.id,
    title,
    body,
    metadata,
    user,
    type,
    seen: false,
  }
  const ref = await notificationsRef.add({
    ...notification,
    createdAt: getUnixTimeStamp(),
  })
  console.log('ref' , ref.id);
  notificationsRef.doc(ref.id).update({ id: ref.id })

  const userBadgeCount = await handleUserBadgeCount(user.id || user.userID)

  const pushNotification = {
    to: recipientData.pushToken,
   
    direct_boot_ok : true,
    notification: {
      title: title,
      body: body,
      sound: 'default',
      badge: userBadgeCount,
    },
    data: { type, toUserID: user.id, ...metadata },
    priority: 'high',
  }
  console.log('pushNotifications.......' , pushNotification);

  const data = await fetch(fcmURL, {
    method: 'post',
    headers: new Headers({
      Authorization: firebaseServerKey,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(pushNotification),
  })
  console.log('data......' , data);
  const r = await data.json()
  console.log('notification status...' , r);
  console.log('sent push notifications ' + body + ' to ' + user.pushToken)

}

const sendCallNotification = async (sender, recipient, callType, callID) => {
  if (!recipient.id) {
    return
  }

  // first, we fetch the latest push token of the recipient
  const userData = await getUserByID(recipient.id)
  const recipientData = userData?.data
  if (!recipientData || !recipientData.pushToken) {
    return
  }

  const pushNotification = {
    to: recipientData.pushToken,
    priority: 'high',
    direct_boot_ok : true,
    data: {
      recipientID: recipient.id,
      senderID: sender.id,
      callType,
      callID,
      callerName: sender.firstName,
      priority: 'high',
      contentAvailable: true,
    },
  }

  try {
    const response = await fetch(fcmURL, {
      method: 'post',
      headers: new Headers({
        Authorization: 'key=' + firebaseServerKey,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(pushNotification),
    })
    console.log(JSON.stringify(response))
  } catch (error) {
    console.log(error)
  }
}

export const notificationManager = {
  sendPushNotification,
  sendCallNotification,
}
