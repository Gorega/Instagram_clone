import { getSession } from "next-auth/react";
import Conversation from "../../../../../../lib/models/messengerModel/conversation";
import Message from "../../../../../../lib/models/messengerModel/message";

export default async function handler(req,res){
    const session = await getSession({req});
    const {conversation_id} = req.query;
    if(!session){
        return res.status(401).json({msg:"Unauthorized"});
    }
    
    if(req.method === "PATCH"){
        const {next_user_id} = req.body;
        await Conversation.updateOne({_id:conversation_id},{$addToSet:{seenBy:next_user_id}});
        return res.status(200).json({msg:"Updated successfully"});
    }

    if(req.method === "DELETE"){
        await Conversation.findOneAndUpdate({_id:conversation_id},{$pull:{seenBy:{$in:[session.userId]}}});
        await Message.updateMany({conversationId:conversation_id},{$pull:{seenBy:{$in:[session.userId]}}});
        return res.status(200).json({msg:"Conversation deleted successfully"});
    }
}