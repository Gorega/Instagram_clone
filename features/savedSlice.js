import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import {server} from "../lib/server";

const initialState = {
    savedList:()=>{},
    saveToList:()=>{},
    removeFromSaved:()=>{},
}

export const savedList = createAsyncThunk(
  "saved/savedList",
  async()=>{
    const response = await axios.get(`${server}/api/saved`,{withCredentials:true});
    const data = await response.data.results;
    return data;
  }
)

export const saveToList = createAsyncThunk(
    "saved/addToList",
    async(payload)=>{
      return await axios.post(`${server}/api/saved/add`,{post_id:payload},{withCredentials:true});
    }
  )

  export const removeFromSaved = createAsyncThunk(
    "saved/removeFromList",
    async(payload)=>{
      return await axios.delete(`${server}/api/saved/${payload}`,{withCredentials:true});
    }
  )

export const savedSlice = createSlice({
  name: 'saved',
  initialState,
  extraReducers:{
      [savedList.pending]:(state)=>{
          state.savedList = "pending"
      },
      [savedList.fulfilled]:(state)=>{
          state.savedList = "done"
      },
      [savedList.rejected]:(state)=>{
            state.savedList = "rejected"
      },
      [saveToList.pending]:(state)=>{
          state.saveToList = "pending"
      },
      [saveToList.fulfilled]:(state)=>{
          state.saveToList = "done"
      },
      [saveToList.rejected]:(state)=>{
            state.saveToList = "rejected"
      },
      [removeFromSaved.pending]:(state)=>{
        state.removeFromSaved = "pending"
      },
      [removeFromSaved.fulfilled]:(state)=>{
          state.removeFromSaved = "done"
      },
      [removeFromSaved.rejected]:(state)=>{
          state.removeFromSaved = "rejected"
      }
  }
})

export default savedSlice.reducer