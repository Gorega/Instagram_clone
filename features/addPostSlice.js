import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    doneUpload:false,
    uploadedFile:null,
    currentFile:0,
    showPostersPreview:false,
    captionValue:null
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
    },
    setCurrentFile:(state,action)=>{
      state.currentFile = action.payload
    },
    setShowPostersPreview:(state,action)=>{
      state.showPostersPreview = action.payload;
    },
    setCaptionValue:(state,action)=>{
      state.captionValue = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setShowPostersPreview,setCurrentFile,setDoneUpload,setUploadedFile,setCaptionValue } = addPostSlice.actions

export default addPostSlice.reducer