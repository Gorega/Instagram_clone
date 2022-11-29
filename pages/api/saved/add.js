import Saved from "../../../lib/models/saved";
import {connect} from "../../../lib/db";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "POST"){
        await connect();
        const {post_id} = req.body;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const saved = await Saved.create({createdBy:session.userId,post_id});
        return res.status(201).json({msg:"saved successfully"});
    }
}