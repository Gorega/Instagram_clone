import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import {server} from "../../lib/server";

const initialState = {
    getTotalPosts:()=>{},
    postId:null,
    updatePosts:null,
}

export const getTotalPosts = createAsyncThunk(
  "post/getTotalPosts",
  async(payload)=>{
      const {profile_id} = payload;
      const response = await axios.get(`${server}/api/user/${profile_id}/posts`,{withCredentials:true});
      const data = await response.data;
      return data;
  }
)

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers:{
    setUpdatePosts:(state,action)=>{
      state.updatePosts = action.payload;
    },
    setPostId:(state,action)=>{
      state.postId = action.payload;
    }
  }
})

export const { setUpdatePosts,setPostId} = postSlice.actions

export default postSlice.reducer