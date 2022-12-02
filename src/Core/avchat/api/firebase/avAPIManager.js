import { firebase } from '@react-native-firebase/firestore'

// Readers and listeners from the signaling server

export default class AVAPIManager {
  subscribeToAVCallStatuses = (userID, callback) => {
    const ref = firebase
      .firestore()
      .collection('avCallStatuses')
      .doc(userID)
      .collection('calls')
    return ref.onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
      const activeCalls = []
      querySnapshot?.forEach(doc => {
        const activeCall = doc.data()
        activeCalls.push(activeCall)
      })
      callback(activeCalls)
    })
  }

  retrieveCallChannel = async callID => {
    const avCallChannelRef = firebase
      .firestore()
      .collection('avCalls')
      .doc(callID)
    const res = await avCallChannelRef.get()
    return res ? res.data() : null
  }

  retrieveUserData = async userID => {
    const ref = firebase.firestore().collection('users').doc(userID)
    const res = await ref.get()
    return res ? res.data() : null
  }

  // Writers to the signaling server
  startCall = async (
    callID,
    callTitle,
    callType,
    currentUser,
    callParticipants,
  ) => {
    /* When a call is started, we write to two Firebase collections:
    1. avCalls - for each call, keep track of the call session metadata (for each call ID, we keep track of the current status of the call)
    2. avCallStatuses - for each user, add an entry of this call ID to track the list of the active call sessions this user is involved in (for each user ID we have a list of calls)
  
    We always need to make sure these two collections are in sync, since they are replicating data such as activeParticipants array.
  */
    const initiatedTimestamp = Math.round(new Date().getTime() / 1000)
    const db = firebase.firestore()

    const avCallsRef = db.collection('avCalls').doc(callID)
    await avCallsRef.set({
      callType: callType,
      callID: callID,
      channelName: callTitle ?? '',
      allChannelParticipants: callParticipants,
      activeParticipants: [currentUser],
      status: 'initiated',
      initiatedTimestamp,
    })

    const batch = db.batch()

    callParticipants.forEach(user => {
      const ref = db
        .collection('avCallStatuses')
        .doc(user.id)
        .collection('calls')
        .doc(callID)
      batch.set(ref, {
        status: user.id == currentUser.id ? 'outgoing' : 'incoming',
        callType: callType,
        callID: callID,
        allChannelParticipants: callParticipants,
        activeParticipants: [currentUser],
        initiatedTimestamp,
      })
    })

    await batch.commit()
  }

  acceptCall = async (callID, userID) => {
    const callChannel = await this.retrieveCallChannel(callID)
    const userData = await this.retrieveUserData(userID)
    if (!callChannel) {
      return
    }
    const activeParticipants = callChannel.activeParticipants
    const otherActiveParticipants = activeParticipants?.filter(
      participant => participant.id !== userID,
    ) // all active participants, but not the current user

    const inctiveParticipants = callChannel.allChannelParticipants?.filter(
      participant =>
        activeParticipants?.filter(a => a.id == participant.id).length == 0,
    ) // all inactive participants

    const allActiveParticipants = [userData].concat(otherActiveParticipants)
    if (allActiveParticipants?.length >= 2) {
      // We have at least 2 active participants, so the call can start

      // Everyone active in the call is signaled to be active (status changes to "active")
      const db = firebase.firestore()
      let batch = db.batch()
      allActiveParticipants.forEach(user => {
        const ref = firebase
          .firestore()
          .collection('avCallStatuses')
          .doc(user.id)
          .collection('calls')
          .doc(callID)

        batch.set(
          ref,
          {
            status: 'active',
            activeParticipants: allActiveParticipants,
          },
          {
            merge: true,
          },
        )
      })

      // Everyone *inactive* in the group gets updated with the new list of active participants
      inctiveParticipants.forEach(user => {
        const ref = firebase
          .firestore()
          .collection('avCallStatuses')
          .doc(user.id)
          .collection('calls')
          .doc(callID)
        batch.set(
          ref,
          {
            activeParticipants: allActiveParticipants,
          },
          {
            merge: true,
          },
        )
      })

      // Then, the call channel status changes to started
      // And we make the current user active in the call
      const ref = firebase.firestore().collection('avCalls').doc(callID)
      batch.set(
        ref,
        {
          activeParticipants: allActiveParticipants,
          status: 'started',
        },
        {
          merge: true,
        },
      )

      // If the call just started, we set its start date
      if (!callChannel.callStartTimestamp) {
        const callStartTimestamp = Math.round(new Date().getTime() / 1000)
        const ref = firebase.firestore().collection('avCalls').doc(callID)
        batch.set(
          ref,
          {
            callStartTimestamp: callStartTimestamp,
          },
          {
            merge: true,
          },
        )
      }

      batch.commit()
      return
    }

    // Current user accepted the call, but there are no other active participants (so everyone in the call already left, including the initiator)
    // In this case, we remove the entire call channel, since it's an invalid state
    alert('No one else is in the call.')
    this.removeCallData(callID)
  }

  rejectCallByCallID = async (callID, userID) => {
    const callChannel = await this.retrieveCallChannel(callID)
    if (!callChannel) {
      return
    }

    // if one to one chat, remove the whole call session
    if (callChannel?.allChannelParticipants?.length == 2) {
      this.removeCallData(callID)
      return
    }

    // if there's a group chat, and one user rejects the call, we keep the call alive, but we remove the current user from it
    this.removeUserFromCall(callID, userID)
  }

  removeCallData = async (callID, userID) => {
    const callData = await this.retrieveCallChannel(callID)

    const db = firebase.firestore()
    let batch = db.batch()

    // We remove the entry from avCalls table
    const avCallChannelRef = firebase
      .firestore()
      .collection('avCalls')
      .doc(callID)
    batch.delete(avCallChannelRef)

    // We remove all entries from all the avCallStatuses subcollections (for each participant)
    callData?.allChannelParticipants?.forEach(user => {
      const ref = firebase
        .firestore()
        .collection('avCallStatuses')
        .doc(user.id)
        .collection('calls')
        .doc(callID)
      batch.delete(ref)
    })
    batch.commit()

    // We remove the entire avCallConnectionData for this channel
    this.removeCallConnectionData(callID)
  }

  removeUserFromCall = async (callID, userID) => {
    // We remove the call channel entry from avCallStatuses for the user
    firebase
      .firestore()
      .collection('avCallStatuses')
      .doc(userID)
      .collection('calls')
      .doc(callID)
      .set({ status: 'rejected' }, { merge: true })

    // We remove the user from the activeParticipants list of the call channel
    const callChannel = await this.retrieveCallChannel(callID)
    const newActiveParticipants = callChannel?.activeParticipants?.filter(
      participant => participant.id !== userID,
    )
    if (newActiveParticipants <= 0) {
      // if there's no one left in the call, we simply remove the call entirely
      this.removeCallData(callID)
      return
    }
    if (
      callChannel.allChannelParticipants?.length > 2 &&
      callChannel.status !== 'initiated' &&
      newActiveParticipants?.length <= 1
    ) {
      // if we are in a group chat, the call already took place, and there's only a single participant, we remove the call entirely
      this.removeCallData(callID)
      return
    }

    // if we still have other users in the call, we update the call participant data to exclude the current user
    firebase
      .firestore()
      .collection('avCalls')
      .doc(callID)
      .set({ activeParticipants: newActiveParticipants }, { merge: true })

    // We also propagate the activeParticipants field changes into all the corresponding avCallStatuses
    const batch = firebase.firestore().batch()
    callChannel.allChannelParticipants.forEach(user => {
      const ref = firebase
        .firestore()
        .collection('avCallStatuses')
        .doc(user.id)
        .collection('calls')
        .doc(callID)
      batch.set(
        ref,
        {
          activeParticipants: newActiveParticipants,
        },
        { merge: true },
      )
    })

    await batch.commit()
  }

  // Signaling - connection data (the signals while in a call)

  subscribeToCallConnectionData = (callID, userID, callback) => {
    const callConnectionDataRef = firebase
      .firestore()
      .collection('avCallConnectionData')
      .doc(callID)
      .collection('connectionData')
      .where('recipientID', '==', userID)

    return callConnectionDataRef.onSnapshot(querySnapshot => {
      const data = []
      querySnapshot?.docs.forEach(doc => {
        const connectionData = doc.data()
        connectionData.dataID = doc.id
        connectionData.id = doc.id
        data.push(connectionData)
      })
      callback(data)
    })
  }

  addCallConnectionData = async (callID, data) => {
    /* data fields:
      senderID,
      recipientID,
      callType,
      callID,
      message
  */
    const callConnectionDataRef = firebase
      .firestore()
      .collection('avCallConnectionData')
      .doc(callID)
      .collection('connectionData')

    try {
      callConnectionDataRef.add(data)
    } catch (error) {
      console.log(error)
    }
  }

  removeCallConnectionData = async callID => {
    console.log('removeCallConnectionData')
    firebase
      .firestore()
      .collection('avCallConnectionData')
      .doc(callID)
      .collection('connectionData')
      .onSnapshot(querySnapshot => {
        const db = firebase.firestore()
        const batch = db.batch()
        querySnapshot?.forEach(doc => {
          batch.delete(doc.ref)
        })
        batch.commit()
      })
  }
}
