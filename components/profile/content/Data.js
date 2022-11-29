import styles from "../../../styles/components/profile/Content.module.css";
import {faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react"
import { getTotalLikes } from "../../../features/post/likeSlice";
import { useDispatch, useSelector } from "react-redux";
import {setShowPostModal} from "../../../features/modalSlice";
import { getPostComments } from "../../../features/post/commentSlice";

export default function Data(props){
    const dispatch = useDispatch();
    const {spinner} = useSelector((state)=> state.navigatorList);
    const [postLikes,setPostLikes] = useState(null);
    const [postComments,setPostComments] = useState(null)

    const openPostModalHnadler = (postId)=>{
        history.pushState(postId,null,`/p/${postId}`)
        dispatch(setShowPostModal(true))
    }

    useEffect(()=>{
        dispatch(getTotalLikes({post_id:props.post_id || props._id})).then(res => setPostLikes(res.payload))
        dispatch(getPostComments({post_id:props.post_id || props._id,limit:1000})).then(res=> setPostComments(res.payload.length))
    },[])

    return <>
        {spinner || <div className={styles.post} onClick={()=> openPostModalHnadler(props.post_id || props._id)}>
            {(props.posters && props.posters[0].contentType.includes("image") || props.post && props.post[0].posters[0].contentType.includes("image")) && <img src={(props.post && props.post[0].posters[0].backdrop) || props.posters[0].backdrop} alt="" />}
            {(props.posters && props.posters[0].contentType.includes("video") || props.post && props.post[0].posters[0].contentType.includes("video")) && <video src={(props.post && props.post[0].posters[0].backdrop) || props.posters[0].backdrop} alt="" />}
            <div className={styles.patch}>
                <ul>
                    <li><FontAwesomeIcon icon={faHeart} /> {postLikes}</li>
                    <li><FontAwesomeIcon icon={faComment} /> {postComments}</li>
                </ul>
            </div>
        </div>}
    </>

}