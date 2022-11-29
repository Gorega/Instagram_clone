import mongoose from "mongoose";

export const connect = async ()=>{
    const connection = await mongoose.connect(process.env.DB_CONNECTION_STRING);
    return connection;
}