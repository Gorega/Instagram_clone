import styles from "../../styles/components/profile/Content.module.css";
import {faComment, faHeart, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react"
import { getTotalLikes } from "../../features/post/likeSlice";
import { useDispatch } from "react-redux";
import {setShowPostModal} from "../../features/modalSlice";

export default function Data(props){
    const dispatch = useDispatch();
    const [postLikes,setPostLikes] = useState([]);

    const openPostModalHnadler = (post_id)=>{
        history.pushState(post_id,null,`/p/${post_id}`)
        dispatch(setShowPostModal(true))
    }

    useEffect(()=>{
        dispatch(getTotalLikes({post_id:props.post_id || props._id})).then(res => setPostLikes(res.payload))
    },[])

    return <>
        <div className={styles.post} onClick={()=> openPostModalHnadler(props.post_id || props._id)}>
            <img src={(props.post && props.post[0].posters[0]) || props.posters[0]} alt="" />
            <div className={styles.patch}>
                <ul>
                    {props.video && <li><FontAwesomeIcon icon={faPlay} /> 22</li>}
                    <li><FontAwesomeIcon icon={faHeart} /> {postLikes}</li>
                    <li><FontAwesomeIcon icon={faComment} /> 0</li>
                </ul>
            </div>
        </div>
    </>

}