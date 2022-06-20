import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    doneUpload:false,
    uploadedFile:null,
}

export const addPostSlice = createSlice({
  name: 'addPost',
  initialState,
  reducers: {
    setDoneUpload:(state,action)=>{
        state.doneUpload = action.payload
    },
    setUploadedFile:(state,action)=>{
      state.uploadedFile = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setDoneUpload,setUploadedFile } = addPostSlice.actions

export default addPostSlice.reducer