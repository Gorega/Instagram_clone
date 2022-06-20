import mongoose from "mongoose";

const FollowerSchema = new mongoose.Schema({
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})

const Follower = mongoose.models.follower || mongoose.model("follower",FollowerSchema);

export default Follower;