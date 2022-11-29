import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import {server} from "../../lib/server";

const initialState = {
    getPostComments:()=>{},
    addComment:()=>{},
    removeComment:()=>{},
    socketComments:null
}

export const getPostComments = createAsyncThunk(
  "post/getPostComments",
  async(payload)=>{
      const {post_id,limit} = payload;
      const response = await axios.get(`${server}/api/post/${post_id}/comments?limit=${limit}`,{withCredentials:true});
      const data = await response.data.results;
      return data
  }
)

export const addComment = createAsyncThunk(
    "post/addComment",
    async(payload)=>{
        const {post_id,content} = payload;
      return await axios.post(`${server}/api/post/${post_id}/comments/addComment`,{postId:post_id,content:content},{withCredentials:true})
    }
  )

  export const removeComment = createAsyncThunk(
    "post/removeComment",
    async(payload)=>{
        const {post_id,comment_id} = payload;
      return await axios.delete(`${server}/api/post/${post_id}/comments/${comment_id}`,{withCredentials:true})
    }
  )

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers:{
    setScoketComments:(state,action)=>{
      state.socketComments = action.payload;
    }
  },
  extraReducers:{
      [getPostComments.pending]:(state)=>{
          state.getPostComments = "pending"
      },
      [getPostComments.fulfilled]:(state)=>{
          state.getPostComments = "done"
      },
      [getPostComments.rejected]:(state)=>{
            state.getPostComments = "rejected"
      },
      [addComment.pending]:(state)=>{
          state.addComment = "pending"
      },
      [addComment.fulfilled]:(state)=>{
          state.addComment = "done"
      },
      [addComment.rejected]:(state)=>{
            state.addComment = "rejected"
      },
      [removeComment.pending]:(state)=>{
        state.removeComment = "pending"
        },
        [removeComment.fulfilled]:(state)=>{
            state.removeComment = "done"
        },
        [removeComment.rejected]:(state)=>{
            state.removeComment = "rejected"
        }
  }
})

export const { setScoketComments} = commentSlice.actions

export default commentSlice.reducer