import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    postId:{
        type:mongoose.Types.ObjectId,
        ref:"post",
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    content:String,
},{timestamps:true})

let Comment = mongoose.models.comment || mongoose.model("comment",commentSchema);

export default Comment;