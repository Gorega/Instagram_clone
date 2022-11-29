import { connect } from "../../../../../lib/db";
import Comment from "../../../../../lib/models/postModel/comment";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "POST"){
        await connect();
        const {postId,content} = req.body;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const comment = await Comment.create({postId,createdBy:session.userId,content});
        return res.status(201).json({msg:"liked"});
    }
}