import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    uploadedFiles:[],
    currentIndex:0,
    showPostersPreview:false,
    captionValue:null
}

export const createModalSlice = createSlice({
  name: 'createModal',
  initialState,
  reducers: {
    setUploadedFiles:(state,action)=>{
      state.uploadedFiles = [...state.uploadedFiles,action.payload]
    },
    removeFromUploadedFiles:(state,action)=>{
      state.uploadedFiles = state.uploadedFiles.filter((file)=> file.backdrop !== action.payload)
    },
    clearUploadedFiles:(state,action)=>{
      state.uploadedFiles = action.payload;
    },
    setCurrentIndex:(state,action)=>{
      state.currentIndex = action.payload
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
export const { setShowPostersPreview,removeFromUploadedFiles,clearUploadedFiles,setCurrentIndex,setCaptionValue,setUploadedFiles } = createModalSlice.actions

export default createModalSlice.reducer