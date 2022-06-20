import { connect } from "../../../../../lib/db";
import Likes from "../../../../../lib/models/postModel/like";
import {getSession} from "next-auth/react";
import mongoose from "mongoose";

export default async function handler(req,res){
    if(req.method === "GET"){
        await connect();
        const session = await getSession({req})
        // if(!session){
        //     return res.status(401).json({msg:"Unauthorized"});
        // }
        let {post_id} = req.query;
        post_id = mongoose.Types.ObjectId(post_id);
        const results = await Likes.aggregate([
            {$match:{postId:post_id}},
            {$lookup:{
                from:"users",
                localField:"createdBy",
                foreignField:"_id",
                as:"creator"
            }},
            {$project:{"creator.password":0,"creator.email":0}}
        ])
        return res.status(200).json(results)
    }
}