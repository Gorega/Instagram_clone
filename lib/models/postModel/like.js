import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
    postId:{
        type:mongoose.Types.ObjectId,
        ref:"post",
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})

let Like = mongoose.models.like || mongoose.model("like",likeSchema);

export default Like;