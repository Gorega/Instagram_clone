import {connect} from "../../../lib/db";
import User from "../../../lib/models/userModel/user";
import {getSession} from "next-auth/react";

export default async function handler(req,res){
    if(req.method === "PATCH"){
        await connect();
        const session = await getSession({req});
        if(!session){
            return res.status(401).json({msg:"Unauthorized"});
        }
        const {name,username,website,bio,email,phone,gender,image} = req.body;
        const user = await User.findOneAndUpdate({_id:session.userId},{name,username,website,bio,email,phone,gender,image});
        return res.status(200).json({msg:"Updated successfuly"});
    }
}