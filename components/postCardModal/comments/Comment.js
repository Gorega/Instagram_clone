import styles from "../../../styles/components/PostCardModal.module.css";
import axios from "axios";
import { server } from "../../../lib/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHeart } from "@fortawesome/free-solid-svg-icons";
import { useState,useEffect, useRef } from "react";
import {useSession} from "next-auth/react";
import { setCustomModal } from "../../../features/modalSlice";
import { useDispatch } from "react-redux";
import { format } from "timeago.js";
import CustomModalLayout from "../../customModals/Index";

export default function Comment({comment,post}){
    const dispatch = useDispatch();
    const {data:user} = useSession();
    const likeButtonRef = useRef();
    const [commentLikes,setCommentLikes] = useState([]);
    const [commentLikesStatus,setCommentLikesStatus] = useState(null);
    const activeLike = commentLikes.find((like)=> like.createdBy === user.userId && like);

    const getCommentLikes = async ()=>{
        const response = await axios.get(`${server}/api/post/${post._id}/comments/likes/${comment._id}`,{withCredentials:true});
        const data = await response.data;
        setCommentLikes(data);
    }

    const addLikeHanlder = async (commentId)=>{
        if(activeLike){
            const response = await axios.delete(`${server}/api/post/${post._id}/comments/likes/${activeLike._id}`,{withCredentials:true});
            setCommentLikesStatus("deleted")
        }else{
            const response = await axios.post(`${server}/api/post/${post._id}/comments/likes/addLike`,{commentId},{withCredentials:true});
            setCommentLikesStatus("added")
        }
    }

    useEffect(()=>{
        getCommentLikes();
    },[commentLikesStatus])

    return <>
        <div className={styles.comment}>
                <div className={styles.box}>
                    <img src={comment.creator[0].image} alt="" />
                    <p><h3>{comment.creator[0].name}</h3> {comment.content}</p>
                </div>
                <div className={styles.more}>
                    <ul>
                        <li>{format(comment.createdAt)}</li>
                        {commentLikes.length > 0 && <li>{commentLikes.length} Likes</li>}
                        <li>Reply</li>
                        <li onClick={()=> {
                            dispatch(setCustomModal({status:true,type:"commentOptionsList",content:<CustomModalLayout commentId={comment._id} commentCreatorId={comment.createdBy} postId={post._id} />}))
                        }}>...</li>
                    </ul>
                </div>
                <span ref={likeButtonRef} onClick={()=>{
                    likeButtonRef.current.classList.toggle(styles.active)
                    addLikeHanlder(comment._id)
                }} className={activeLike && styles.active}><FontAwesomeIcon icon={faHeart} />
                </span>
        </div>
    </>
}