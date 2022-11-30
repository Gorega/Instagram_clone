import styles from "../../styles/components/CustomModal.module.css";
import axios from "axios";
import {server} from "../../lib/server";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setCustomModal, setEditPostModal, setShowPostModal, setUnfollowModal } from "../../features/modalSlice";
import { setCaptionValue, setShowPostersPreview, setUploadedFiles } from "../../features/createModalSlice";
import {setPeopleModal} from "../../features/messengerSlice";
import { setPostId, setUpdatePosts } from "../../features/post";
import { removeFromSaved } from "../../features/savedSlice";

export default function PostOptionsList({creator,postCreatorId,postId,isFollowed}){

    const dispatch = useDispatch();
    const router = useRouter();
    const {data:user} = useSession();

    return  <div className={styles.list}>
            <ul>
                {user.userId === postCreatorId
                &&
                <li style={{color:"red"}} onClick={()=>{
                    dispatch(setUpdatePosts("pending"))
                    axios.delete(`${server}/api/post/${postId}`)
                    .then(_ => {
                        dispatch(removeFromSaved(postId))
                        dispatch(setCaptionValue(""))
                        dispatch(setCustomModal({status:false,type:null}))
                        dispatch(setUpdatePosts("done"))
                    })
                }}>
                Delete
                </li>
                }

                {user.userId === postCreatorId && <li onClick={()=>{
                    axios.get(`${server}/api/post/${postId}`)
                    .then(res=>{
                        dispatch(setShowPostersPreview(false));
                        res.data[0].posters?.map((poster)=>{
                            dispatch(setUploadedFiles({backdrop:poster.backdrop,contentType:poster.contentType,name:poster.name}))
                        });
                        dispatch(setCaptionValue(res.data[0]?.caption));
                        dispatch(setEditPostModal({status:true,postId:postId,content:{poster:{backdrop:res.data[0].posters[0]?.backdrop,type:res.data[0].posters[0]?.contentType,name:res.data[0].posters[0]?.name}}}));
                    })
                    dispatch(setCustomModal({type:null}));
                }}>
                Edit
                </li>
                }

                {user.userId === postCreatorId
                ||
                <li style={{color:"red"}}>
                Report
                </li>
                }
                
                {isFollowed && <li style={{color:"red"}} onClick={()=>{
                    dispatch(setCustomModal({type:null}))
                    dispatch(setUnfollowModal({status:true,payload:creator[0]}));
                }}>
                Unfollow
                </li>
                }

                <li onClick={()=> {
                    router.push(`/p/${postId}`);
                    dispatch(setShowPostModal(false))
                    dispatch(setCustomModal({type:null}))
                }}>
                Go to post
                </li>

                <li onClick={()=> {
                    dispatch(setCustomModal({type:null}));
                    dispatch(setPeopleModal(true))
                    dispatch(setPostId(postId));
                }}>
                Share to...
                </li>

                <li onClick={()=>{
                    navigator.clipboard.writeText(`${server}/p/${postId}`).then(()=>{
                        dispatch(setCustomModal({type:null}))
                    })
                }}>
                Copy Link
                </li>

                <li onClick={()=> dispatch(setCustomModal({status:false}))}>
                Cancel
                </li>
            </ul>
        </div>
}