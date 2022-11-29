import { getSession } from "next-auth/react";
import Conversation from "../../../../../../../lib/models/messengerModel/conversation";

export default async function handler(req,res){
    const session = await getSession({req});

    if(!session){
        return res.status(401).json({msg:"Unauthorized"});
    }
    
    const {conversation_id} = req.query;
    if(req.method === "PATCH"){
        await Conversation.findOneAndUpdate({_id:conversation_id},{$addToSet:{readBy:session.userId}});
        return res.status(200).json({msg:"Watchers updated successfully"});
    }

    if(req.method === "PUT"){
        const {next_user_id} = req.body;
        await Conversation.findOneAndUpdate({_id:conversation_id},{$pull:{readBy:next_user_id}});
        return res.status(200).json({msg:"Watchers updated successfully"});
    }
}