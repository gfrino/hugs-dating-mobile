import io from 'socket.io-client'
import AsyncStorage from '@react-native-community/async-storage'

// const baseAPIURL = 'https://codebaze.herokuapp.com/api/';
const baseAPIURL = 'http://localhost:3000/api/'

export default class AVAPIManager {
  // Readers and listeners from the signaling server
  constructor() {
    this.activeCallDataUpdateCallback = null
    this.callConnectionDataCallback = null

    // const socketRoot = 'https://codebaze.herokuapp.com';
    const socketRoot = 'http://localhost:3000'
    this.socket = io.connect(socketRoot, {
      transports: ['websocket'],
      jsonp: false,
    })

    this.socket.on('watchActiveAVCall', activeCallData => {
      this.activeCallDataUpdateCallback &&
        this.activeCallDataUpdateCallback(activeCallData)
    })
    this.socket.on('watchCallConnectionData', connectionData => {
      this.callConnectionDataCallback &&
        this.callConnectionDataCallback(connectionData)
    })
  }

  subscribeToAVCallStatuses = (userID, callback) => {
    this.activeCallDataUpdateCallback = callback
    this.socket.on('connect', () => {
      this.socket.emit('subscriptionToActiveCallData', {
        userID: userID,
      })
    })
  }

  startCall = async (
    callID,
    callTitle,
    callType,
    currentUser,
    callParticipants,
  ) => {
    try {
      AsyncStorage.getItem('jwt_token', async (_error, token) => {
        const body = {
          userID: currentUser?.id,
          callID,
          callTitle,
          callType,
          callParticipants,
        }
        await fetch(baseAPIURL + 'avchat/start', {
          method: 'post',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        // no callback
      })
    } catch (error) {
      console.log(error)
    }
  }

  acceptCall = async (callID, userID) => {
    try {
      AsyncStorage.getItem('jwt_token', async (_error, token) => {
        await fetch(baseAPIURL + 'avchat/accept', {
          method: 'post',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userID,
            callID: callID,
          }),
        })
        // no callback
      })
    } catch (error) {
      console.log(error)
    }
  }

  rejectCallByCallID = async (callID, userID) => {
    try {
      AsyncStorage.getItem('jwt_token', async (_error, token) => {
        await fetch(baseAPIURL + 'avchat/reject', {
          method: 'post',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userID,
            callID: callID,
          }),
        })
        // no callback
      })
    } catch (error) {
      console.log(error)
    }
  }

  removeUserFromCall = async (callID, userID) => {
    try {
      AsyncStorage.getItem('jwt_token', async (_error, token) => {
        await fetch(baseAPIURL + 'avchat/exit', {
          method: 'post',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userID,
            callID: callID,
          }),
        })
        // no callback
      })
    } catch (error) {
      console.log(error)
    }
  }

  removeCallData = async (callID, userID) => {
    this.rejectCallByCallID(callID, userID)
  }

  // Signaling - connection data (the signals while in a call)

  subscribeToCallConnectionData = (callID, userID, callback) => {
    this.callConnectionDataCallback = callback
    this.socket.on('connect', () => {
      this.socket.emit('subscriptionToCallConnectionData', {
        userID: userID,
        callID: callID,
      })
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

    try {
      AsyncStorage.getItem('jwt_token', async (_error, token) => {
        await fetch(baseAPIURL + 'avchat/callconnectiondata/add', {
          method: 'post',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        // no callback
      })
    } catch (error) {
      console.log(error)
    }
  }
}
