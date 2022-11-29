import styles from "../../styles/components/CustomModal.module.css";
import { setCustomModal } from "../../features/modalSlice";
import { useDispatch } from "react-redux";
import { useContext } from "react";
import { AppContext } from "../../contextApi";
import { removeComment } from "../../features/post/commentSlice";

export default function CommentOptionsList({id,creatorId,postId}){
    
    const dispatch = useDispatch();
    const {socket} = useContext(AppContext);

    return  <div className={styles.list}>
                <ul>
                    {user.userId === creatorId || <li style={{color:"red"}}>Report</li>}
                    {user.userId === creatorId && <li style={{color:"red"}} onClick={()=> {
                        dispatch(removeComment({post_id:postId,comment_id:id})).then(_=>{
                            socket?.current.emit("comments",{
                                postId:postId,
                                userId:creatorId,
                            })
                            dispatch(setCustomModal({type:null}));
                        })
                    }
                    }>Delete</li>}
                    <li onClick={()=> dispatch(setCustomModal({type:null}))}>Cancel</li>
                </ul>
            </div>
}