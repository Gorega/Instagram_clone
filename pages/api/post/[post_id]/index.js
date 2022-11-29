import { connect } from "../../../../lib/db";
import Post from "../../../../lib/models/postModel/post";
import Saved from "../../../../lib/models/saved";
import {getSession} from "next-auth/react";
import mongoose from "mongoose"

export default async function handler(req,res){
        await connect();
        const session = await getSession({req});
        // if(!session){
        //     return res.status(401).json({msg:"Unathorized"});
        // }

    if(req.method === "GET"){
        let {post_id} = req.query;
        post_id = mongoose.Types.ObjectId(post_id)
        const post = await Post.aggregate([
            {$lookup:{
                from:"users",
                localField:"createdBy",
                foreignField:"_id",
                as:"creator"
            }},
            {$match:{_id:post_id}},
            {$project:{
                "creator.password":0,"creator.email":0
            }}
        ]);
        return res.status(200).json(post);
    }
    if(req.method === "PATCH"){
        const {post_id} = req.query;
        const {poster,caption,location} = req.body;
        await Post.findOneAndUpdate({_id:mongoose.Types.ObjectId(post_id)},{posters:[...poster],caption,location});
        return res.status(200).json({msg:"Post updated successfuly"});
    }
    if(req.method === "DELETE"){
        const {post_id} = req.query;
        await Post.findOneAndDelete({_id:mongoose.Types.ObjectId(post_id)});
        await Saved.findOneAndDelete({post_id});
        return res.status(200).json({msg:"Post deleted successfuly"});
    }
}