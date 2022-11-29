import styles from "../../../styles/components/PostCardModal.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import usePostData from "../../../lib/usePostData";
import Comment from "./Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Comments({post}){
    const observer = useRef();
    const {addComment:addCommentStatus,removeComment:removeCommentStatus,socketComments} = useSelector((state)=> state.postComments);
    const {postComments,fetchPostComments,spinner} = usePostData(post);
    const [commentsLimit,setCommentsLimit] = useState(4);

    const lastCommentElement = useCallback((node)=>{
        if(observer.current){
            observer.current.disconnect();
          }
          observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting){
                setCommentsLimit((commentsLimit)=>{
                    return commentsLimit * 2;
                })
            }
          })
          if(node){
            observer.current.observe(node)
          }
    },[])

    useEffect(()=>{
        fetchPostComments(commentsLimit);
    },[post._id,addCommentStatus,removeCommentStatus,commentsLimit])

    useEffect(()=>{
        if(socketComments && (post._id === socketComments.postId)) fetchPostComments(commentsLimit);
    },[socketComments])

    return <>
        <div className={styles.comments}>
            {spinner ? 
            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
            :
            postComments.length > 0 ? postComments.map((comment,index)=>{
                if(postComments.length === index + 1){
                    return <div key={index} ref={lastCommentElement}>
                        <Comment key={index} comment={comment} post={post} />
                    </div>
                }
                return <Comment key={index} comment={comment} post={post} />
            })
            :
            <div className={styles.emptyComments}>
                <h2>No comments yet. <br/>
                <pre>Start the conversation.</pre>
                </h2>
            </div>}
        </div>
    </>


}