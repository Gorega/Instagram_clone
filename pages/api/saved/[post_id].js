import Saved from "../../../lib/models/saved";
import {connect} from "../../../lib/db";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "DELETE"){
        await connect();
        const {post_id} = req.query;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const saved = await Saved.findOneAndDelete({post_id:post_id});
        return res.status(200).json({msg:"deleted successfully"});
    }
}