import { connect } from "../../../../../../lib/db";
import Reply from "../../../../../../lib/models/replyModel/reply";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "POST"){
        await connect();
        const {commentId,content} = req.body;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const reply = await Reply.create({commentId,createdBy:session.userId,content});
        return res.status(201).json({msg:"addedd successfuly"});
    }
}