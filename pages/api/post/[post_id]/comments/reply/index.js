import { connect } from "../../../../../../lib/db";
import Reply from "../../../../../../lib/models/replyModel/reply";
import {getSession} from "next-auth/react";
import mongoose from "mongoose";

export default async function handler(req,res){
    if(req.method === "GET"){
        await connect();
        const session = await getSession({req})
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        let {reply_id} = req.query;
        reply_id = mongoose.Types.ObjectId(reply_id)
        const results = await Reply.aggregate([
            {$match:{replyId:reply_id}},
            {$lookup:{
                from:"users",
                localField:"createdBy",
                foreignField:"_id",
                as:"creator"
            }},
            {$project:{
                "creator.password":0,"creator.email":0
            }}
        ]);
        return res.status(200).json(results)
    }
}