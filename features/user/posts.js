import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import {server} from "../../lib/server";

const initialState = {
    userPosts:[],
    getUserPosts:()=>{},
}

export const getUserPosts = createAsyncThunk(
  "user/getUserPosts",
  async(payload)=>{
      const {profile_id} = payload;
      const response = await axios.get(`${server}/api/user/${profile_id}/posts`,{withCredentials:true});
      const data = await response.data.results;
      return data;
  }
)

export const getTotalUserPosts = createAsyncThunk(
  "user/getTotalUserPosts",
  async(payload)=>{
      const {profile_id} = payload;
      const response = await axios.get(`${server}/api/user/${profile_id}/total_posts_counts`,{withCredentials:true});
      const data = await response.data.total;
      return data;
  }
)


export const followerSlice = createSlice({
  name: 'follower',
  initialState,
  extraReducers:{
      
  }
})

export default followerSlice.reducer