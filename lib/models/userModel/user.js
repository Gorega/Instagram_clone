import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:String,
    name:String,
    image:{
        type:String,
        default:"https://firebasestorage.googleapis.com/v0/b/instagram-clone-a6598.appspot.com/o/profile%2Fdefault.jpeg?alt=media&token=58a03f2d-ebc8-4194-b036-3329eaa12d0e"
    },
    username:String,
    password:String,
    bio:String,
    website:String,
    phone:String,
    gender:String
})

let User = mongoose.models.user || mongoose.model("user",userSchema);

export default User;