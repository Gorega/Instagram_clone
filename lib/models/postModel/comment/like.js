import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
    commentId:{
        type:mongoose.Types.ObjectId,
        ref:"comment",
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})

let Like = mongoose.models.comments_like || mongoose.model("comments_like",likeSchema);

export default Like;