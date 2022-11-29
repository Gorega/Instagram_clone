import { connect } from "../../../../../../lib/db";
import Reply from "../../../../../../lib/models/replyModel/reply";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "DELETE"){
        await connect();
        const {reply_id} = req.query;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const reply = await Reply.findOneAndDelete({_id:reply_id});
        return res.status(201).json({msg:"Reply deleted successfuly"});
    }
}