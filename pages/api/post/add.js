import Post from "../../../lib/models/postModel/post";
import {connect} from "../../../lib/db";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "POST"){
        await connect();
        const {poster,caption,location} = req.body;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unathorized"});
        }
        const post = await Post.create({posters:[...poster],caption,location,createdBy:session.userId});
        return res.status(201).json(post)
    }
}