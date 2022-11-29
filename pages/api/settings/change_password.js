import {connect} from "../../../lib/db";
import User from "../../../lib/models/userModel/user";
import {getSession} from "next-auth/react";
import {hash,compare} from "bcrypt";

export default async function handler(req,res){
    if(req.method === "PATCH"){
        await connect();
        const session = await getSession({req});
        let {oldPassword,newPassword,confirmNewPassword} = req.body;
        const user = await User.findOne({_id:session.userId});
        const comparePassword = await compare(oldPassword,user.password);
        if(!comparePassword){
            return res.status(422).json({msg:"Incorrect Password"});
        }
        if(newPassword !== confirmNewPassword){
            return res.status(422).json({msg:"Password don't match"});
        }
        const hashNewPassword = await hash(newPassword,10);
        newPassword = hashNewPassword;
        await User.findOneAndUpdate({_id:session.userId},{password:newPassword});
        return res.status(200).json({msg:"Updated successfuly"});
    }
}