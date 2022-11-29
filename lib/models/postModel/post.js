import mongoose from "mongoose"

const postSchema = mongoose.Schema({
    posters:Array,
    caption:String,
    location:String,
    like:{
        type:mongoose.Types.ObjectId,
        ref:"like",
    },
    comments:{
        type:mongoose.Types.ObjectId,
        ref:"comment"
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})

let Post = mongoose.models.post || mongoose.model("post",postSchema);

export default Post;