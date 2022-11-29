import Message from "../../../lib/models/messengerModel/message";
import Conversation from "../../../lib/models/messengerModel/conversation";
import {getSession} from "next-auth/react";
import { connect } from "../../../lib/db";

export default async function handler(req,res){
    await connect();
    const session = await getSession({req});
    if(!session){
        return res.status(401).json({msg:"Unathorized"});
    }

    if(req.method === "GET"){
        const {conversation_id} = req.query;
        const messages = await Message.find({conversationId:conversation_id,seenBy:{$in:[session.userId]}});
        return res.status(200).json(messages);
    }

    if(req.method === "POST"){
        const {conversation_id} = req.query;
        const {sender,text,members,postId} = req.body;

        const conversation = await Conversation.findOne({_id:conversation_id});
        const next_user_id = conversation.members.find((member)=> member !== session.userId)
        if(conversation.blockedBy.includes(next_user_id)){
            return res.status(422).json({})
        }

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