import mongoose from "mongoose";

export const connect = async ()=>{
    const connection = await mongoose.connect("mongodb+srv://Alawael:1777@cluster0.zmdfp.mongodb.net/InstagramClone?retryWrites=true&w=majority");
    return connection;
}