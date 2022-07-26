import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import {server} from "../../lib/server";

const initialState = {
    getTotalLikes:()=>{},
    getPostLikes:()=>{},
    addLike:()=>{},
    removeLike:()=>{},
    socketLikes:null
}

export const getTotalLikes = createAsyncThunk(
  "post/getTotalLikes",
  async(payload)=>{
      const {post_id} = payload;
      const response = await axios.get(`${server}/api/post/${post_id}/likes/total_counts`,{withCredentials:true});
      const data = await response.data.total;
      return data;
  }
)

export const getPostLikes = createAsyncThunk(
  "post/getPostLikes",
  async(payload)=>{
      const {post_id} = payload;
    const response = await axios.get(`${server}/api/post/${post_id}/likes`,{withCredentials:true});
    const data = await response.data;
    return data;
  }
)

export const addLike = createAsyncThunk(
    "post/addLike",
    async(payload)=>{
        const {post_id} = payload;
      return await axios.post(`${server}/api/post/${post_id}/likes/addLike`,{postId:post_id},{withCredentials:true})
    }
  )

  export const removeLike = createAsyncThunk(
    "post/removeLike",
    async(payload)=>{
        const {post_id,like_id} = payload;
      return await axios.delete(`${server}/api/post/${post_id}/likes/${like_id}`,{withCredentials:true})
    }
  )

export const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers:{
    setSocketLikes:(state,action)=>{
      state.socketLikes = action.payload;
    }
  },
  extraReducers:{
      [getPostLikes.pending]:(state)=>{
        state.getPostLikes = "pending"
      },
      [getPostLikes.fulfilled]:(state)=>{
          state.getPostLikes = "done"
      },
      [getPostLikes.rejected]:(state)=>{
          state.getPostLikes = "rejected"
      },
      [addLike.pending]:(state)=>{
          state.addLike = "pending"
      },
      [addLike.fulfilled]:(state)=>{
          state.addLike = "done"
      },
      [addLike.rejected]:(state)=>{
            state.addLike = "rejected"
      },
      [removeLike.pending]:(state)=>{
        state.removeLike = "pending"
      },
      [removeLike.fulfilled]:(state)=>{
          state.removeLike = "done"
      },
      [removeLike.rejected]:(state)=>{
          state.removeLike = "rejected"
      }
  }
})

export const { setSocketLikes} = likeSlice.actions

export default likeSlice.reducer