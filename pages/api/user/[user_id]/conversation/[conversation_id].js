import { getSession } from "next-auth/react";
import Conversation from "../../../../../lib/models/messengerModel/conversation";
import Message from "../../../../../lib/models/messengerModel/message";

export default async function handler(req,res){
    if(req.method === "PATCH"){
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const {conversation_id} = req.query;
        await Conversation.findOneAndUpdate({_id:conversation_id},{$pull:{seenBy:{$in:[session.userId]}}});
        await Message.updateMany({conversationId:conversation_id},{$pull:{seenBy:{$in:[session.userId]}}})
        return res.status(200).json({msg:"Conversation deleted succesffuly"});
    }
}