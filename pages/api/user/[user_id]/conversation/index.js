import Conversation from "../../../../../lib/models/messengerModel/conversation";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {user_id} = req.query;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const conversations = await Conversation.find({members:{$in:[user_id]}}).sort({"updatedAt":-1})
        return res.status(200).json(conversations);
    }
    
    if(req.method === "POST"){
        const {userId,senderId,updatedAt} = req.body;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }

        const existConversation = await Conversation.findOne({members:{$all:[userId,senderId]},seenBy:{$in:[userId]}})
        if(existConversation){
            await Conversation.findOneAndUpdate({members:{$all:[userId,senderId]}},{$push:{seenBy:senderId}});
            return res.status(200).json({msg:"updated ..."})
        }
        
        const newConversation = await Conversation.create({
            members:[userId,senderId],
            seenBy:[userId,senderId],
        })
        return res.status(201).json(newConversation);
    }
    
}