import Follower from "../../../../../lib/models/userModel/follower";
import {getSession} from "next-auth/react";
import { connect } from "../../../../../lib/db";

export default async function handler(req,res){
    const session = await getSession({req});
    await connect()
    if(!session){
        return res.status(401).json({msg:"Unauthorized"});
    }
    if(req.method === "DELETE"){
        const {next_user_id} = req.query;
        const follower = await Follower.findOneAndDelete({user_id:next_user_id});
        return res.status(200).json({msg:"Deleted",data:follower});
    }
}