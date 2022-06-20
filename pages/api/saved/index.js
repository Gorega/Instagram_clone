import Saved from "../../../lib/models/saved";
import {connect} from "../../../lib/db";
import {getSession} from "next-auth/react";
import mongoose from "mongoose";

export default async function handler(req,res){
    if(req.method === "GET"){
        await connect();
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const saved = await Saved.aggregate([
            {$lookup:{
                from:"posts",
                localField:"post_id",
                foreignField:"_id",
                as:"post"
            }},
            {$match:{createdBy:mongoose.Types.ObjectId(session.userId)}},
            {$project:{
                "post.caption":0,"post.location":0,"post.createdBy":0
            }}
        ])
        return res.status(200).json({results:saved});
    }
}