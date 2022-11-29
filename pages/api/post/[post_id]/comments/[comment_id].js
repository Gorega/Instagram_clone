import { connect } from "../../../../../lib/db";
import Comment from "../../../../../lib/models/postModel/comment";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "DELETE"){
        await connect();
        const {comment_id} = req.query;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const comment = await Comment.findOneAndDelete({_id:comment_id});
        return res.status(200).json({msg:"Comment deleted successfuly"});
    }
}