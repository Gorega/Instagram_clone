import styles from "../../styles/pages/p/index.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { setShowPostModal } from "../../features/modalSlice";

export default function usePosts({post}){
    const dispatch = useDispatch();
    const [postLikes,setPostLikes] = useState(null);
    const [postComments,setPostComments] = useState(null);

    const openPostModalHnadler = (post_id)=>{
        history.pushState(post_id,null,`/p/${post_id}`)
        dispatch(setShowPostModal(true))
    }

    const fetchPostTotalLikes = async ()=>{
        const response = await axios.get(`${server}/api/post/${post._id}/likes/total_counts`,{withCredentials:true});
        const data = await response.data.total;
        setPostLikes(data);
    }

    const fetchPostTotalComments = async ()=>{
        const response = await axios.get(`${server}/api/post/${post._id}/comments`,{withCredentials:true});
        const data = await response.data.results.length;
        setPostComments(data);
    }

    useEffect(()=>{
        fetchPostTotalLikes();
        fetchPostTotalComments();
    },[])

    return <div className={styles.post} onClick={()=> openPostModalHnadler(post._id)}>
        {post.posters[0].contentType.includes("image") && <img src={post?.posters[0].backdrop} alt="" />}
        {post.posters[0].contentType.includes("video") && <video src={post?.posters[0].backdrop} alt="" />}
        <div className={styles.patch}>
            <ul>
                <li><FontAwesomeIcon icon={faHeart} /> <span>{postLikes}</span></li>
                <li><FontAwesomeIcon icon={faComment} /> <span>{postComments}</span></li>
            </ul>
        </div>
    </div>
}