import { connect } from "../../../../../lib/db";
import Likes from "../../../../../lib/models/postModel/like";
import {getSession} from "next-auth/react";
import mongoose from "mongoose";

export default async function handler(req,res){
    if(req.method === "GET"){
        await connect();
        const session = await getSession({req})
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        let {post_id} = req.query;
        const total = await Likes.countDocuments({postId:mongoose.Types.ObjectId(post_id)});
        return res.status(200).json({total:total})
    }
}