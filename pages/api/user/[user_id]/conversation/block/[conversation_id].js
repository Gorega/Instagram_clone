import { getSession } from "next-auth/react";
import Conversation from "../../../../../../lib/models/messengerModel/conversation";

export default async function handler(req,res){
    if(req.method === "PATCH"){
        const session = await getSession({req});
        const {conversation_id} = req.query;
        await Conversation.findOneAndUpdate({conversationId:conversation_id},{$push:{blockedBy:session.userId}});
        return res.status(200).json({msg:"blocked successfuly"});
    }
}