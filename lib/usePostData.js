import { useContext, useState } from "react";
import {useSession} from "next-auth/react"
import { useDispatch } from "react-redux";
import { AppContext } from "../contextApi";
import {getPostLikes,addLike,removeLike} from "../features/post/likeSlice";
import {getPostComments,addComment,removeComment} from "../features/post/commentSlice";
import {saveToList,removeFromSaved} from "../features/savedSlice";

export default function usePostData(props){
    const dispatch = useDispatch();
    const {data:user} = useSession();
    const {saved,socket} = useContext(AppContext);
    const [postLikes,setPostLikes] = useState([]);
    const [postComments,setPostComments] = useState([]);
    const [spinner,setSpinner] = useState(true);
    const savedPosts = saved?.find((post)=> post.post_id == props._id);
    const liked = postLikes?.find((like)=> user && (like.createdBy === user.userId));

    const likesHandler = ()=>{
        socket?.current.emit("likes",{
            postId:props._id,
            userId:props.createdBy,
        })
        if(liked){
            dispatch(removeLike({post_id:props._id,like_id:liked._id}))
            
        }else{
            dispatch(addLike({post_id:props._id}))
        }
    }

    const bookmarkHandler = ()=>{
        if(savedPosts){
            dispatch(removeFromSaved(props._id))
        }else{
            dispatch(saveToList(props._id))
        }
    }

    const fetchPostLikes = async ()=>{
        if(props._id){
            dispatch(getPostLikes({post_id:props._id})).then(res => {
                setSpinner(false)
                setPostLikes(res.payload)
            })
        }
    }

    const fetchPostComments = (limit)=>{
        if(props._id){
            dispatch(getPostComments({post_id:props._id,limit:limit})).then(res => {
                setSpinner(false)
                setPostComments(res.payload)
            });
        }
    }

    return{ fetchPostLikes,
            fetchPostComments,
            postComments,
            liked,
            postLikes,
            spinner,
            setSpinner,
            likesHandler,
            bookmarkHandler,
            addComment,
            removeComment,
            savedPosts
        }

}