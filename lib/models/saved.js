import mongoose from "mongoose";

const savedSchema = new mongoose.Schema({
    post_id:{
        type:mongoose.Types.ObjectId,
        ref:"post"
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true})

const Saved = mongoose.models.saved || mongoose.model("saved",savedSchema);
export default Saved;