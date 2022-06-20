import { connect } from "../../../../../../lib/db";
import Like from "../../../../../../lib/models/postModel/comment/like";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "POST"){
        await connect();
        const {commentId} = req.body;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const existLike = await Like.findOne({commentId,createdBy:session.userId});
        if(existLike){
            return res.status(422).json({msg:"Already liked"});
        }
        const like = await Like.create({commentId,createdBy:session.userId});
        return res.status(201).json({msg:"liked"});
    }
}