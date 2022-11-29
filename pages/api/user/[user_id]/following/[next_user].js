import Follower from "../../../../../lib/models/userModel/follower";
import {getSession} from "next-auth/react";
import { connect } from "../../../../../lib/db";
import mongoose from "mongoose";

export default async function handler(req,res){
    const {user_id,next_user} = req.query;
    const session = await getSession({req});
    await connect()
    // if(!session){
    //     return res.status(401).json({msg:"Unauthorized"});
    // }
    if(req.method === "GET"){
        const follower = await Follower.findOne({createdBy:mongoose.Types.ObjectId(user_id),user_id:mongoose.Types.ObjectId(next_user)});
        return res.status(200).json(follower)
    }
}