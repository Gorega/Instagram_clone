import Follower from "../../../../../lib/models/userModel/follower";
import {getSession} from "next-auth/react";
import { connect } from "../../../../../lib/db";
import mongoose from "mongoose";

export default async function handler(req,res){
    const {user_id} = req.query;
    const session = await getSession({req});
    await connect()
    // if(!session){
    //     return res.status(401).json({msg:"Unauthorized"});
    // }
    if(req.method === "GET"){
        const total = await Follower.countDocuments({user_id:mongoose.Types.ObjectId(user_id)});
        return res.status(200).json({total:total})
    }

}