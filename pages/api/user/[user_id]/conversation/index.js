import Conversation from "../../../../../lib/models/messengerModel/conversation";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
    if(req.method === "GET"){
        const {user_id} = req.query;
        const conversations = await Conversation.find({seenBy:{$in:[user_id]}}).sort({"updatedAt":-1})
        return res.status(200).json(conversations);
    }
    
    if(req.method === "POST"){
        const {userId,senderId} = req.body;
        const existConversation = await Conversation.findOne({members:{$all:[userId,senderId]}})
        if(existConversation){
            await Conversation.findOneAndUpdate({members:{$all:[userId,senderId]}},{$addToSet:{seenBy:userId}});
            return res.status(200).json({msg:"updated ..."})
        }
        
        const newConversation = await Conversation.create({
            members:[userId,senderId],
            seenBy:[userId,senderId]
        
        })
        return res.status(201).json(newConversation);
    }
    
}