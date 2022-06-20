import { connect } from "../../../../lib/db";
import User from "../../../../lib/models/userModel/user";
import { getSession } from "next-auth/react"
import mongoose from "mongoose"

export default async function handler(req,res){
    if(req.method === "GET"){
        await connect();
        const session = await getSession({req})
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        let {user_id} = req.query;
        const results = await User.aggregate([
            {$match:{_id:{$ne:mongoose.Types.ObjectId(user_id)}}},
        ]);
        return res.status(200).json({results:results});
    }
}