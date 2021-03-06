import styles from "../../styles/components/PostOptionsModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setCustomPostOptions, setEditPostModal, setShowPostModal, setShowPostOptionsModal, setUnfollowModal } from "../../features/modalSlice";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contextApi";
import { getFollowers, getFollowing, unfollow } from "../../features/user/follower";
import { useSession } from "next-auth/react";
import { removeComment } from "../../features/post/commentSlice";
import {setPeopleModal} from "../../features/messengerSlice";
import {setUpdatePosts} from "../../features/post/index";
import {useRouter} from "next/router";
import {server} from "../../lib/server";
import axios from "axios";
import LikesPeople from "./LikesPeople";
import { setCaptionValue, setDoneUpload, setShowPostersPreview } from "../../features/addPostSlice";

export default function Content(props){
    const dispatch = useDispatch();
    const {data:user,status} = useSession();
    const router = useRouter();
    const {socket,setPostId,setUploadedFiles} = useContext(AppContext);
    const [followersPeople,setFollowersPeople] = useState([]);
    const [followingPeople,setFollowingPeople] = useState([]);
    const {follow:followStatus,unfollow:unfollowStatus} = useSelector((state)=> state.userFollowers);
    const {customPostOptions} = useSelector((state)=> state.modal);

    useEffect(()=>{
        if(status === "authenticated"){
            if(customPostOptions.type === "followingPeople"){
                dispatch(getFollowing({user_id:props.profile_id})).then(res=> {
                    setFollowingPeople(res.payload)
                })
            }
            if(customPostOptions.type === "followersPeople"){
                dispatch(getFollowers({user_id:props.profile_id})).then(res => {
                    setFollowersPeople(res.payload)
                })
            }
        }
    },[user,followStatus,unfollowStatus,customPostOptions])

    if(customPostOptions.type === "followersPeople"){
        return <div className={styles.people}>
            <div className={styles.head}>
                <h2>Followers</h2>
                <FontAwesomeIcon icon={faTimes} onClick={()=> dispatch(setShowPostOptionsModal(false))} />
            </div>
            <div className={styles.content}>
                {followersPeople?.map((person,index)=>{
                    return  <div key={index} className={styles.person}>
                                <img src={person.creator[0].image} alt="" />
                                <h3>{person.creator[0].username}</h3>
                                <button style={{backgroundColor:"white",color:"black",border:"1px solid #d9d9d9"}}
                                     onClick={()=>dispatch(unfollow({user_id:user.userId,next_user_id:person.user_id}))}>
                                    Remove
                                </button>
                            </div>
                })}
            </div>
        </div>
    }

    if(customPostOptions.type === "followingPeople"){
        return <div className={styles.people}>
            <div className={styles.head}>
                <h2>Following</h2>
                <FontAwesomeIcon icon={faTimes} onClick={()=> dispatch(setShowPostOptionsModal(false))} />
            </div>
            <div className={styles.content}>
                {followingPeople?.map((person,index)=>{
                    return  <div key={index} className={styles.person}>
                                <img src={person.creator[0].image} alt="" />
                                <h3>{person.creator[0].username}</h3>
                                <button style={{backgroundColor:"white",color:"black",border:"1px solid #d9d9d9"}}
                                     onClick={()=>dispatch(unfollow({user_id:user.userId,next_user_id:person.user_id}))}>
                                    Remove
                                </button>
                            </div>
                })}
            </div>
        </div>
    }

    if(customPostOptions.type === "likesPeople"){
        return <div className={styles.people}>
            <div className={styles.head}>
                <h2>Likes</h2>
                <FontAwesomeIcon icon={faTimes} onClick={()=> dispatch(setShowPostOptionsModal(false))} />
            </div>
            <div className={styles.content}>
                {props.likesPeople?.map((person,index)=>{
                    return <LikesPeople key={index} person={person} />
                })}
            </div>   
        </div>
    }

    if(customPostOptions.type === "postList"){
        return <div className={styles.list}>
            <ul>
                    {user.userId === props.postCreatorId && <li style={{color:"red"}} onClick={()=>{
                        dispatch(setUpdatePosts("pending"))
                        axios.delete(`${server}/api/post/${props.post_id}`)
                        .then(res => {
                            dispatch(setCustomPostOptions({type:null}))
                            dispatch(setUpdatePosts("done"))
                        })
                    }}>Delete</li>}
                    {user.userId === props.postCreatorId && <li onClick={()=>{
                        axios.get(`${server}/api/post/${props.post_id}`)
                        .then(res=>{
                            dispatch(setShowPostersPreview(false));
                            res.data[0].posters?.map((poster)=>{
                                setUploadedFiles(prevState => [...prevState,{backdrop:poster.backdrop,contentType:poster.contentType,name:poster.name}])
                            });
                            dispatch(setCaptionValue(res.data[0]?.caption));
                            dispatch(setEditPostModal({status:true,postId:props.post_id,content:{poster:{backdrop:res.data[0].posters[0]?.backdrop,type:res.data[0].posters[0]?.contentType}}}));
                        })
                        dispatch(setCustomPostOptions({type:null}));
                        dispatch(setDoneUpload(true));
                    }}>Edit</li>}
                    {user.userId === props.postCreatorId || <li style={{color:"red"}}>Report</li>}
                    {props.followed && <li style={{color:"red"}} onClick={()=>{
                        dispatch(setCustomPostOptions({type:null}))
                        dispatch(setUnfollowModal({status:true,payload:props.creator[0]}));
                    }}>Unfollow</li>}
                    <li onClick={()=> {
                        router.push(`/p/${props.post_id}`);
                        dispatch(setShowPostModal(false))
                        dispatch(setCustomPostOptions({type:null}))
                    }}>Go to post</li>
                    <li onClick={()=> {
                        dispatch(setCustomPostOptions({type:null}));
                        setPostId(props.post_id)
                        dispatch(setPeopleModal(true))
                    }}>Share to...</li>
                    <li onClick={()=>{
                        navigator.clipboard.writeText(`${server}/p/${props.post_id}`).then(()=>{
                            dispatch(setCustomPostOptions({type:null}))
                        })
                    }}>Copy Link</li>
                    <li onClick={()=> dispatch(setShowPostOptionsModal(false))}>Cancel</li>
            </ul>
        </div>
    }

    if(customPostOptions.type === "commentList"){
        return <div className={styles.list}>
            <ul>
                    {user.userId === props.commentCreatorId || <li style={{color:"red"}}>Report</li>}
                    {user.userId === props.commentCreatorId && <li style={{color:"red"}} onClick={()=> {
                        dispatch(removeComment({post_id:props.post_id,comment_id:props.comment_id})).then(res=>{
                            socket?.current.emit("comments",{
                                postId:props.post_id,
                                userId:props.createdBy,
                            })
                            dispatch(setShowPostOptionsModal(false));
                        })
                    }
                    }>Delete</li>}
                    <li onClick={()=> dispatch(setShowPostOptionsModal(false))}>Cancel</li>
            </ul>
        </div>
    }
}