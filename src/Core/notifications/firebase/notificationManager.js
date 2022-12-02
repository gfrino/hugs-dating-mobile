import { firebase } from '@react-native-firebase/firestore'
import { updateUser, getUserByID } from '../../users'
import { getUnixTimeStamp } from '../../helpers/timeFormat'

const notificationsRef = firebase.firestore().collection('notifications')

const fcmURL = 'https://fcm.googleapis.com/fcm/send'
const firebaseServerKey =
  'AAAATiZitNY:APA91bEQ0354nB0Zkmo1XZXhzRHv9VnTuEahZkCGl1BJUteYhpcyksIV4Y0PIcZvdIJykfZeD70rHdIdQgMdWwnQNyVvkfiG7pjDihMXyYub9SiJ3izateFFeFFZBTRfgBgHKMu3tlRy'

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

  if (metadata && metadata.outBound && toUser.id == metadata.outBound.id) {
    return
  }
  if (toUser.settings && toUser.settings.push_notifications_enabled == false) {
    return
  }
  const recipientData = toUser; 
  if (!recipientData || !recipientData?.pushToken) {
    return
  }

  const notification = {
    toUserID: toUser.id,
    title,
    body,
    metadata,
    toUser,
    type,
    seen: false,
  }
  const ref = await notificationsRef.add({
    ...notification,
    createdAt: getUnixTimeStamp(),
  })
  notificationsRef.doc(ref.id).update({ id: ref.id })

  const userBadgeCount = await handleUserBadgeCount(toUser.id || toUser.userID)

  const pushNotification = {
    to: recipientData.pushToken,
    direct_boot_ok : true,
    notification: {
      title: title,
      body: body,
      sound: 'default',
      badge: userBadgeCount,
    },
    data: { type, toUserID: toUser.id, ...metadata },
    priority: 'high',
  }

  fetch(fcmURL, {
    method: 'post',
    headers: new Headers({
      Authorization: 'key=' + firebaseServerKey,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(pushNotification),
  })
  console.log('sent push notifications ' + body + ' to ' + toUser.pushToken)
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
