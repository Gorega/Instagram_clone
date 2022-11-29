import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import {server} from "../../lib/server";

const initialState = {
    getFollowers:()=>{},
    getFollowing:()=>{},
    follow:()=>{},
    unfollow:()=>{},
    pending:false,
    
}

export const getFollowers = createAsyncThunk(
  "user/getFollowers",
  async(payload)=>{
        const {user_id} = payload;
      const response = await axios.get(`${server}/api/user/${user_id}/follower`,{withCredentials:true});
      const data = await response.data;
      return data;
  }
)

export const getTotalFollowers = createAsyncThunk(
  "user/getTotalFollowers",
  async(payload)=>{
        const {user_id} = payload;
      const response = await axios.get(`${server}/api/user/${user_id}/follower/total_counts`,{withCredentials:true});
      const data = await response.data.total;
      return data;
  }
)


export const getFollowing = createAsyncThunk(
  "user/getFollowing",
  async(payload)=>{
        const {user_id} = payload;
      const response = await axios.get(`${server}/api/user/${user_id}/following`,{withCredentials:true});
      const data = await response.data;
      return data;
  }
)

export const getTotalFollowing = createAsyncThunk(
  "user/getTotalFollowing",
  async(payload)=>{
        const {user_id} = payload;
      const response = await axios.get(`${server}/api/user/${user_id}/following/total_counts`,{withCredentials:true});
      const data = await response.data.total;
      return data;
  }
)

export const follow = createAsyncThunk(
    "user/follow",
    async(payload)=>{
          const {user_id,next_user_id} = payload;
        return await axios.post(`${server}/api/user/${user_id}/follower`,{user_id:next_user_id},{withCredentials:true});
    }
  )

  export const unfollow = createAsyncThunk(
    "user/unfollow",
    async(payload)=>{
          const {user_id,next_user_id} = payload;
        return await axios.delete(`${server}/api/user/${user_id}/follower/${next_user_id}`,{withCredentials:true});
    }
  )

export const followerSlice = createSlice({
  name: 'follower',
  initialState,
  reducers:{
   setPending:(state,action)=>{
     state.pending = action.payload;
   }
  },
  extraReducers:{
      [follow.pending]:(state)=>{
        state.follow = "pending"
      },
      [follow.fulfilled]:(state)=>{
          state.follow = "done"
      },
      [follow.rejected]:(state)=>{
          state.follow = "rejected"
      },
      [unfollow.pending]:(state)=>{
        state.unfollow = "pending"
      },
      [unfollow.fulfilled]:(state)=>{
          state.unfollow = "done"
      },
      [unfollow.rejected]:(state)=>{
          state.unfollow = "rejected"
      }
  }
})

export const { setPending } = followerSlice.actions

export default followerSlice.reducer