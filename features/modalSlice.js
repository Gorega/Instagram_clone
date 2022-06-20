import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showPostModal:false,
  showAddPostModal:false,
  showPostOptionsModal:false,
  customPostOptions:{type:null,content:null},
  unfollowModal:{status:false,payload:null},
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setShowPostModal:(state,action)=>{
        state.showPostModal = action.payload
    },
    setShowPostOptionsModal:(state,action)=>{
      state.showPostOptionsModal = action.payload
    },
    setShowAddPostModal:(state,action)=>{
      state.showAddPostModal = action.payload
    },
    setCustomPostOptions:(state,action)=>{
      state.customPostOptions = action.payload;
    },
    setUnfollowModal:(state,action)=>{
      state.unfollowModal = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setShowPostModal,setShowPostOptionsModal,setShowAddPostModal,setCustomPostOptions,setUnfollowModal} = modalSlice.actions

export default modalSlice.reducer