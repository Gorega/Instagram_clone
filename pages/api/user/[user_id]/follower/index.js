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
        const follower = await Follower.aggregate([
            {$match:{user_id:mongoose.Types.ObjectId(user_id)}},
            {$lookup:{
                from:"users",
                localField:"createdBy",
                foreignField:"_id",
                as:"creator"  
            }}
        ])
        return res.status(200).json(follower)
    }

    if(req.method === "POST"){
        const {user_id} = req.body;
        const follower = await Follower.create({createdBy:session.userId,user_id:user_id});
        return res.status(201).json({msg:"success"});
    }

}