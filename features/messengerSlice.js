import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { server } from '../lib/server'


const initialState = {
  pending:false,
  socketConversation:null,
  showConversationChat:false,
  showConversationDetails:false,
  conversation:null,
  peopleModal:false,
  newMessageNotification:false,
}

export const members = createAsyncThunk(
  "messenger/members",
  async(payload)=>{
    const {senderId} = payload;
    const response = await axios.get(`${server}/api/user/${senderId}`,{withCredentials:true});
    const data = await response.data;
    return data;
  }
)

export const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    setShowConversationChat:(state,action)=>{
      state.showConversationChat = action.payload;
    },
    setConversation:(state,action)=>{
      state.conversation = action.payload
    },
    setPeopleModal:(state,action)=>{
      state.peopleModal = action.payload
    },
    setPending:(state,action)=>{
      state.pending = action.payload
    },
    setNewMessageNotification:(state,action)=>{
      state.newMessageNotification = action.payload;
    },
    setSocketConversation:(state,action)=>{
      state.socketConversation = action.payload;
    },
    setShowConversationDetails:(state,action)=>{
      state.showConversationDetails = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setShowConversationDetails,setSocketConversation,setShowConversationChat,setConversation,setPeopleModal,setPending,setNewMessageNotification } = messengerSlice.actions

export default messengerSlice.reducer