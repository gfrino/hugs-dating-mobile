const SET_CHANNELS = 'SET_CHANNELS'
const SET_CHANNELS_SUBCRIBED = 'SET_CHANNELS_SUBCRIBED'


export const setChannels = data => ({
  type: SET_CHANNELS,
  data,
})

export const setChannelsSubcribed = data => ({
  type: SET_CHANNELS_SUBCRIBED,
  data,
})

// export const storeToken = (data ) => ({
//   type : "Token_store",
//   data,
// })

const initialState = {
  channels: null,
  areChannelsSubcribed: false,
  // storeToken : null
}

export const chat = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHANNELS_SUBCRIBED:
      return {
        ...state,
        areChannelsSubcribed: action.data,
      }
    case SET_CHANNELS:
      return {
        ...state,
        channels: [...action.data],
      }
      // case "Token_store": {
      //   console.log("coming from reducer token: " , action.data);
      //   return { storeToken : action.data};
      // }
    case 'LOG_OUT':
      return initialState
    default:
      return state
  }
}
