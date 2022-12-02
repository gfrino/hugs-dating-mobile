// TODO: Migrate admin stuff to backend
import { firebase } from '@react-native-firebase/firestore'
import { postAPIManager, storyAPIManager } from '../../socialgraph/feed/api'
// import { channelManager } from '../../chat/api'
import { getUnixTimeStamp } from '../../helpers/timeFormat'

const admin = {
  id: 'o2ELXSOsudTPmMAcxidOk4fO1AP2',
  profilePictureURL:
    'https://firebasestorage.googleapis.com/v0/b/production-a9404.appspot.com/o/A048599D-C100-47D2-B2B9-510ED845B477.jpg?alt=media&token=d7a66e21-6f85-4d81-b9de-bc1335e49f27',
  firstName: 'Florian',
  lastName: 'Marcu',
}

const socialGraphRef = firebase.firestore().collection('social_graph')

const swipesRef = firebase.firestore().collection('swipes')

const usersRef = firebase.firestore().collection('users')

const handleNewAccountCreation = async user => {
  const timestamp = getUnixTimeStamp()

  // Adding friendships
  const fromUserRef = socialGraphRef.doc(user.id)
  const toUserRef = socialGraphRef.doc(admin.id)
  fromUserRef.collection('outbound_users').doc(admin.id).set(admin)
  fromUserRef.collection('inbound_users').doc(admin.id).set(admin)
  toUserRef.collection('inbound_users').doc(user.id).set(user)
  toUserRef.collection('outbound_users').doc(user.id).set(user)

  usersRef.doc(user.id).update({
    inboundFriendsCount: 1,
    outboundFriendsCount: 1,
  })

  // Adding a match with the admin
  swipesRef.add({
    author: user.id,
    swipedProfile: admin.id,
    type: 'like',
    hasBeenSeen: true, // Admin should never see a match, to avoid showing too many
    createdAt: timestamp,
  })
  swipesRef.add({
    author: admin.id,
    swipedProfile: user.id,
    type: 'like',
    hasBeenSeen: false,
    createdAt: timestamp,
  })

  // Adding all feed posts and stories to the new user's timelines
  postAPIManager?.hydrateFeedForNewFriendship(user.id, admin.id)
  storyAPIManager?.hydrateStoriesForNewFriendship(user.id, admin.id)

  const id1 = admin.id
  const id2 = user.id
  const channelID = id1 < id2 ? id1 + id2 : id2 + id1

  // Create a chat channel between admin and new user
  // TODO: Migrate admin stuff to backend
  // await channelManager.createChannel(admin, [{ ...user, createdAt: '' }], null)

  // Adding a message with user info visible only to the admin
  const channelData = {
    creatorID: admin.id,
    id: channelID,
    channelID,
    participants: [{ ...user, createdAt: '' }, admin],
  }

  const message =
    'XARQEGWE13SD fname: ' +
    user.firstName +
    '; lname: ' +
    user.lastName +
    '; email: ' +
    user.email +
    '; id: ' +
    user.id +
    ' app: ' +
    user.appIdentifier

  // TODO: Migrate admin stuff to backend
  //  await channelManager.sendMessage(admin, channelData, message, null, null, [])

  // Add a welcome message for all demo users
  const message2 =
    'Thanks for trying out our demo! Let me know if you have any questions or concerns. ✌️🚀'

  await channelManager.sendMessage(admin, channelData, message2, null, null, [])
}

const adminManager = {
  handleNewAccountCreation,
}

export default adminManager
