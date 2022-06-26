import { connect } from "../../../lib/db";
import {hash} from "bcrypt"
import User from "../../../lib/models/userModel/user";

export default async function handler(req,res){
    if(req.method === "POST"){
        await connect();
        let {email,name,username,password} = req.body;
        const user = await User.findOne({email}) || await User.findOne({username});
        if(user){
            return res.status(422).json({msg:"duplicate data"})
        }
        if(!email){
            return res.status(422).json({msg:"Please provide a valid email address"});
        }
        if(!name || name.length < 3){
            return res.status(422).json({msg:"Please provide a real name"})
        }
        if(!username){
            return res.status(422).json({msg:"Username should not be empty"})
        }
        if(!password || password.length < 8){
            return res.status(422).json({msg:"Please provide a valid password"})
        }
        const hashPassowrd = await hash(password,10);
        password = hashPassowrd;
        await User.create({email,name,username,password});
        return res.status(200).json({msg:"success"});
    }
}