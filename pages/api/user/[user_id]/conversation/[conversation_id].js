import { getSession } from "next-auth/react";
import Conversation from "../../../../../lib/models/messengerModel/conversation";
import Message from "../../../../../lib/models/messengerModel/message";

export default async function handler(req,res){
    if(req.method === "PATCH"){
        const session = await getSession({req});
        const {conversation_id} = req.query;
        const {senderId} = req.body;
        await Conversation.findOneAndUpdate({_id:conversation_id},{$pull:{seenBy:{$in:[senderId]}}});
        await Message.updateMany({conversationId:conversation_id},{$pull:{seenBy:{$in:[session.userId]}}})
        return res.status(200).json({msg:"Conversation deleted succesffuly"});
    }
}