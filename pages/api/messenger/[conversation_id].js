import Message from "../../../lib/models/messengerModel/message";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "GET"){
        const {conversation_id} = req.query;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unathorized"});
        }
        const messages = await Message.find({conversationId:conversation_id,seenBy:{$in:[session.userId]}});
        return res.status(200).json(messages);
    }

    if(req.method === "POST"){
        const {conversation_id} = req.query;
        const {sender,text,members,postId} = req.body;
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unathorized"});
        }

        // const conversation = await Conversation.findOne({conversationId:conversation_id});
        // if(!conversation.blockedBy.includes(sender)){
        //     return res.status(422).json({})
        // }

        const message = await Message.create({
            conversationId:conversation_id,
            seenBy:members,
            members:members,
            postId,
            sender,
            text,
        })
        return res.status(201).json(message);
    }
}