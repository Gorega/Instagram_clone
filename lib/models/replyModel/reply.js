import mongoose from "mongoose";

const replySchema = mongoose.Schema({
    commentId:{
        type:mongoose.Types.ObjectId,
        ref:"comment",
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    content:String,
},{timestamps:true})

let Reply = mongoose.models.reply || mongoose.model("reply",replySchema);

export default Reply;