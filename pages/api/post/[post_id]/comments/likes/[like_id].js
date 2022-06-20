import { connect } from "../../../../../../lib/db";
import mongoose from "mongoose";
import Like from "../../../../../../lib/models/postModel/comment/like";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "DELETE"){
        await connect();
        const {like_id} = req.query;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const like = await Like.findOneAndDelete({_id:like_id});
        return res.status(201).json({msg:"Unliked"});
    }
    if(req.method === "GET"){
        await connect();
        let {like_id} = req.query;
        like_id = mongoose.Types.ObjectId(like_id)
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const like = await Like.find({commentId:like_id});
        return res.status(200).json(like);
    }
}