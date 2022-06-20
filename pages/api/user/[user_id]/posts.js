import { connect } from "../../../../lib/db";
import Post from "../../../../lib/models/postModel/post";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "GET"){
        await connect();
        const {user_id} = req.query;
        const session = await getSession({req})
        // if(!session){
        //     return res.status(401).json({msg:"Unauthorized"});
        // }
        const results = await Post.find({createdBy:user_id});
        return res.status(200).json({results:results});
    }
}