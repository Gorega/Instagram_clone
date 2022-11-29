import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showPostModal:false,
  addPostModal:{status:false,content:null},
  editPostModal:{status:false,postId:null,content:null},
  customModal:{status:false,type:null,content:null},
  unfollowModal:{status:false,payload:null},
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setShowPostModal:(state,action)=>{
        state.showPostModal = action.payload
    },
    setAddPostModal:(state,action)=>{
      state.addPostModal = action.payload
    },
    setEditPostModal:(state,action)=>{
      state.editPostModal = action.payload
    },
    setCustomModal:(state,action)=>{
      state.customModal = action.payload;
    },
    setUnfollowModal:(state,action)=>{
      state.unfollowModal = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setShowPostModal,setAddPostModal,setEditPostModal,setCustomModal,setUnfollowModal} = modalSlice.actions

export default modalSlice.reducer