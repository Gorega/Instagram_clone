import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "../../../lib/db";
import {compare} from "bcrypt";
import User from "../../../lib/models/userModel/user";

export default NextAuth({
    providers:[
        CredentialsProvider({
            name:"credentials",
            async authorize(credentials){
                await connect();
                const {email,username,password} = credentials;
                const user = await User.findOne({email}) || await User.findOne({username});
                if(!user){
                    throw new Error("Incorrect username or password")
                }
                const comparedPassword = await compare(password,user.password)
                if(!comparedPassword){
                    throw new Error("Incorrect username or password")
                }
                return {name:user.name,image:user.image,email:user.email}
            }
        })
    ],
    callbacks:{
        async session({session}){
            await connect();
            const user = await User.findOne({email:session.user.email})
            session.userId = user._id;
            session.username = user.username;
            session.bio = user.bio;
            session.gender = user.gender;
            session.website = user.website;
            session.phone = user.phone;
            session.image = user.image;
            return session;
        }
    }
})