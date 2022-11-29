import { connect } from "../../../../../../lib/db";
import Likes from "../../../../../../lib/models/postModel/comment/like";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "GET"){
        await connect();
        const session = await getSession({req})
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const {post_id} = req.query;
        const results = await Likes.find({postId:post_id});
        return res.status(200).json(results)
    }
}