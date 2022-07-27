import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Types.ObjectId,
        ref:"conversation"
    },
    members:{
        type:Array
    },
    seenBy:{
        type:Array
    },
    sender:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    text:{
        type:String,
    },
    postId:{
        type:mongoose.Types.ObjectId,
        ref:"post",
    },
},{timestamps:true})

let Message = mongoose.models.message || mongoose.model("message",messageSchema);

export default Message;