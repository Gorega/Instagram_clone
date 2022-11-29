import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // list:[],
  // profileListUrl:null,
  userPosts:[],
  activeProfileList:0,
  activeSettingsList:0,
  spinner:true,
}

export const navigatorListSlice = createSlice({
  name: 'navigatorList',
  initialState,
  reducers: {
    // setList:(state,action)=>{
    //   state.list = action.payload;
    // },
    setUserPosts:(state,action)=>{
      state.userPosts = action.payload
    },
    setActiveProfileList:(state,action)=>{
        state.activeProfileList = action.payload
    },
    setActiveSettingsList:(state,action)=>{
      state.activeSettingsList = action.payload
    },
    // setProfileListUrl:(state,action)=>{
    //   state.profileListUrl = action.payload
    // },
    setSpinner:(state,action)=>{
      state.spinner = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserPosts,setActiveProfileList,setActiveSettingsList,setSpinner } = navigatorListSlice.actions

export default navigatorListSlice.reducer