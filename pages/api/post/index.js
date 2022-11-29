import Post from "../../../lib/models/postModel/post";
import {connect} from "../../../lib/db";

export default async function handler(req,res){
    if(req.method === "GET"){
        let limit;
        let {page} = req.query;
        if(page){
            page = page;
        }else{
            page = 1;
        }
        limit = page * 4;
        await connect();
        const posts = await Post.aggregate([
            {$sort:{"createdAt":-1}},
            {$lookup:{
                from:"users",
                localField:"createdBy",
                foreignField:"_id",
                as:"creator"
            }},
            {$project:{
                "creator.password":0,"creator.email":0
            }},
            {$limit:limit},
        ])
        return res.status(200).json({results:posts,page:page});
    }
}