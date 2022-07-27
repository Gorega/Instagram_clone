import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema({
    members:{
        type:Array
    },
    blockedBy:{
        type:Array
    },
    seenBy:{
        type:Array
    },
    readBy:{
        type:Array
    }
},{timestamps:true})

let Conversation = mongoose.models.conversation || mongoose.model("conversation",conversationSchema);

export default Conversation;