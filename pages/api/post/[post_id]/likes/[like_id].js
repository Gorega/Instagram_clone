import { connect } from "../../../../../lib/db";
import Like from "../../../../../lib/models/postModel/like";
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
}