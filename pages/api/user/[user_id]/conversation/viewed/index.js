import Conversation from "../../../../../../lib/models/messengerModel/conversation";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
    if(req.method === "GET"){
        const {user_id} = req.query;
        const viewedConversation = await Conversation.findOne({seenBy:{$in:[user_id]},readBy:{$in:[user_id]}});
        return res.status(200).json(viewedConversation);
    }
    
}