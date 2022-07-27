import { getSession } from "next-auth/react";
import Conversation from "../../../../../../lib/models/messengerModel/conversation";

export default async function handler(req,res){
    const session = await getSession({req});
    const {conversation_id} = req.query;
    if(!session){
        return res.status(401).json({msg:"Unauthorized"});
    }

    if(req.method === "PATCH"){
        await Conversation.findOneAndUpdate({conversationId:conversation_id},{$addToSet:{blockedBy:session.userId}});
        return res.status(200).json({msg:"Blocked successfuly"});
    }

    if(req.method === "DELETE"){
        await Conversation.findOneAndUpdate({conversationId:conversation_id},{$pull:{blockedBy:session.userId}});
        return res.status(200).json({msg:"Unblocked successfuly"});
    }

}