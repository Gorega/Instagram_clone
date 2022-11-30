import styles from "../../styles/components/PostCardModal.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomModal } from "../../features/modalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEllipsis,faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import {format} from "timeago.js";
import { AppContext } from "../../contextApi";
import { setPeopleModal } from "../../features/messengerSlice";
import usePostData from "../../lib/usePostData";
import CustomModalLayout from "../customModals/Index";
import PeopleModal from "../messenger/PeopleModal";
import EditPostModal from "../createModal/Index";
import UnfollowModal from "../sideInterface/UnfollowModal";
import Comments from "./comments/Index";
import dynamic from "next/dynamic";
const Picker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

export default function Layout({post,customStyle}){
    const dispatch = useDispatch();
    const {data:user,status} = useSession();
    const {socket} = useContext(AppContext);
    const likeButtonRef = useRef();
    const commentInput = useRef();
    const emojiPickerBoxRef = useRef();
    const {fetchPostLikes,postLikes,spinner,liked,likesHandler,bookmarkHandler,addComment,savedPosts} = usePostData(post);
    const {addLike,removeLike,socketLikes} = useSelector((state)=> state.postLikes)
    const {peopleModal} = useSelector((state)=> state.messenger)
    const {unfollow:unfollowStatus,follow:followStatus} = useSelector((state)=> state.userFollowers);
    const {unfollowModal,editPostModal} = useSelector((state)=>state.modal);
    const {customModal} = useSelector((state)=> state.modal);
    const [commentValue,setCommentValue] = useState("");
    const [followed,setFollowed] = useState(null);
    const [currentLiked,setCurrentLiked] = useState(null);
    const [currentSaved,setCurrentSaved] = useState(null);
    const [currentPoster,setCurrentPoster] = useState(0);
    const [showEmojiPicker,setShowEmojiPicker] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);

    // post controls button icons
    const likeIcon = <svg ariaLabel="Like" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg>
    const likedIcon = <svg ariaLabel="Unlike" color="#ed4956" fill="#ed4956" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
    const saveIcon = <svg ariaLabel="Save" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>;
    const savedIcon = <svg ariaLabel="Remove" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20 22a.999.999 0 01-.687-.273L12 14.815l-7.313 6.912A1 1 0 013 21V3a1 1 0 011-1h16a1 1 0 011 1v18a1 1 0 01-1 1z"></path></svg>
    
    const showPeopleLikesHandler = ()=>{
        dispatch(setCustomModal({status:true,type:"peopleLikes",content:<CustomModalLayout peopleLikes={postLikes && postLikes} />}))
    }

    const getFollowing = async ()=>{
        const FollowedResponse = await axios.get(`${server}/api/user/${user.userId}/following/${post.createdBy}`,{withCredentials:true});
        const followedData = await FollowedResponse.data;
        if(followedData !== ""){
            setFollowed(true);
        }else{
            setFollowed(false)
        }
    }

    const onEmojiClick = (event, emojiObject) => {
        commentInput.current.focus();
        setCommentValue(commentValue => commentValue.concat(emojiObject.emoji))
        setChosenEmoji(emojiObject);
      };

    useEffect(()=>{
        const closeEmojiPickerBox = (e)=>{
            if(emojiPickerBoxRef.current && !emojiPickerBoxRef.current.contains(e.target)){
                setShowEmojiPicker(false)
            }
        }
        document.addEventListener("mouseup",closeEmojiPickerBox)
        return()=>{
        document.removeEventListener("mouseup",closeEmojiPickerBox)
        }
    },[])

    useEffect(()=>{
        if(customModal.type === "postOptionsList"){
            getFollowing();
        }
    },[user,followStatus,unfollowStatus,followed])

    useEffect(()=>{
        fetchPostLikes();
    },[post._id,removeLike,addLike])

    useEffect(()=>{
        setCurrentLiked(liked)
    },[liked])

    useEffect(()=>{
        setCurrentSaved(savedPosts)
    },[savedPosts])

    useEffect(()=>{
        if(socketLikes && (post._id === socketLikes.postId)) fetchPostLikes();
    },[socketLikes])

    return <div className={styles.post}>
            {spinner ?
                <div className={styles.spinner}>
                    <div style={customStyle} className={styles.poster}></div>
                    <div className={styles.content}>
                        <div className={styles.head}>
                            <div className={styles.profileImg}></div>
                            <h2></h2>
                        </div>
                    </div>
                </div>
                :
                <div className={styles.grid}>
                    <div className={styles.posters} style={customStyle}>
                        {post.posters[currentPoster]?.contentType.includes("image") && <img src={post.posters[currentPoster].backdrop} alt="" />} 
                        {post.posters[currentPoster]?.contentType.includes("video") && <video src={post.posters[currentPoster].backdrop} controls alt="" />} 
                        {post.posters.length > 1 && <div className={styles.controls}>
                            <div className={`${styles.left} ${currentPoster === 0 && styles.disabled}`} onClick={()=>setCurrentPoster(currentPoster => currentPoster-1)}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </div>
                            <div className={`${styles.right} ${currentPoster === post.posters.length-1 && styles.disabled}`} onClick={()=>setCurrentPoster(currentPoster => currentPoster+1)}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </div>
                        </div>}
                        {post.posters.length > 1 && <div className={styles.paginations}>
                            <ul>
                                {post.posters.map((_,index)=>{
                                    return <li key={index} className={currentPoster === index && styles.active} onClick={()=> setCurrentPoster(index)}></li>
                                })}
                            </ul>
                        </div>}
                    </div>

                    <div className={styles.content}>
                        <div className={styles.head}>
                            <img src={post.creator[0]?.image} alt="" />
                            <h2>{post.creator[0]?.name}</h2>
                            <div className={styles.options} onClick={()=> {
                                dispatch(setCustomModal({status:true,type:"postOptionsList",content:<CustomModalLayout postCreatorId={post.createdBy} creator={post.creator} postId={post._id} isFollowed={followed} />}))
                            }}>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </div>
                        </div>

                        <div className={styles.body}>
                                <div className={styles.in}>
                                    {post.caption?.length > 0 && <div className={styles.caption}>
                                        <img src={post.creator[0].image} alt="" />
                                        <div className={styles.info}>
                                            <h2>{post.creator[0].name}</h2>
                                            <p>{post.caption}</p>
                                        </div>
                                        <div className={styles.date}>{format(post.createdAt)}</div>
                                    </div>}
                                    <Comments post={post} />
                                </div>
            
                                <div className={styles.share}>
                                    <div className={styles.left}>
                                        <ul>
                                            <li ref={likeButtonRef} onClick={()=>{
                                                setCurrentLiked(!currentLiked);
                                                likesHandler();
                                                }}>
                                                {currentLiked ? likedIcon : likeIcon}
                                            </li>
                                            <li onClick={()=> commentInput.current.focus()}>
                                                <svg ariaLabel="Comment" color="#8e8e8e" fill="#8e8e8e" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                            </li>
                                            <li onClick={()=> dispatch(setPeopleModal(true))}>
                                                <svg ariaLabel="Share Post" color="#8e8e8e" fill="#8e8e8e" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={styles.right}>
                                        <ul>
                                            <li style={{color:savedPosts && "black"}} onClick={()=>{
                                                setCurrentSaved(!currentSaved);
                                                bookmarkHandler()
                                                }}>
                                                {currentSaved ? savedIcon : saveIcon}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={styles.info}>
                                    {postLikes?.length > 0 && <h4 onClick={showPeopleLikesHandler}>{postLikes.length} Likes</h4>}
                                    <div className={styles.date}>{format(post.createdAt)}</div>
                                </div>
                                <div className={styles.footer}>
                                    <div className={styles.face} onClick={()=>setShowEmojiPicker(!showEmojiPicker)}>
                                        <svg aria-label="Emoji" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path></svg>
                                    </div>
                                    <form onSubmit={(e)=>{
                                        e.preventDefault();
                                        setCommentValue("")
                                        dispatch(addComment({post_id:post._id,content:commentValue})).then(_=>{
                                            socket?.current.emit("comments",{
                                                postId:post._id,
                                                userId:post.createdBy,
                                            })
                                        })
                                    }}>
                                    <input type="text" placeholder="Add a comment..." value={commentValue} onChange={(e)=> setCommentValue(e.target.value)} ref={commentInput} />
                                    <button type="submit" className={commentValue <= 0 && styles.disabled}>Post</button>
                                    </form>
                                    <div className={styles.emojiPickerBox} ref={emojiPickerBoxRef}>
                                        {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
                                    </div>
                                </div>
                        </div>
                </div>
            </div>}
        {editPostModal.status && <EditPostModal editPost={true} backdrop={editPostModal.content?.poster.backdrop} caption={editPostModal.content?.caption} />}
        {peopleModal && <PeopleModal type="share" postId={post._id} />}
        {customModal.status && customModal.content}
        {unfollowModal.status && <UnfollowModal person={unfollowModal.payload} /> }
        </div>
}