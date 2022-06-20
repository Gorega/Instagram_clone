import { connect } from "../../../lib/db";
import User from "../../../lib/models/userModel/user";
import { getSession } from "next-auth/react"

export default async function handler(req,res){
    const session = await getSession({req})
    if(!session){
        return res.status(401).json({msg:"Unauthorized"});
    }
        await connect();
        const {username} = req.query;
        if(username){
            const user = await User.find({username:{$regex:username,$options:"i"}});
            return res.status(200).json(user);
        }
        return res.status(200).json({});;
}