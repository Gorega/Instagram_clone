import styles from "../../styles/components/messenger/SingleMessage.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react"
import { format } from "timeago.js";
import axios from "axios";
import { server } from "../../lib/server";
import { useRouter } from "next/router";
import { setShowPostModal } from "../../features/modalSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignleMessage({message,chat}){
    const dispatch = useDispatch();
    const lastMessage = useRef();
    const {data:user} = useSession();
    // const {errorMsg} = useSelector((state)=> state.messenger);
    const router = useRouter();
    const [sahredPost,setSharedPost] = useState();
    const {recieverData} = useSelector((state)=> state.messenger);

    const fetchSharedPostData = async ()=>{
        const response = await axios.get(`${server}/api/post/${message.postId}`,{withCredentials:true})
        const data = response.data[0];
        setSharedPost(data);
    }

    useEffect(()=>{
        lastMessage.current?.scrollIntoView({behavior:"smooth"});
    },[chat])

    useEffect(()=>{
        if(message.hasOwnProperty("postId")){
            fetchSharedPostData();
        }
    },[message])
    
    return <div ref={lastMessage} className={`${styles.message} ${message.sender !== user.userId && styles.own}`}>
        <div className={styles.date}>
            {format(message.createdAt)}
        </div>
        <div className={`${styles.text}`}>
            {message.sender !== user.userId && <img src={recieverData?.image} alt="" />}
            {message.hasOwnProperty("postId") ? 
            <div className={styles.postPlaceholder}>
                <head onClick={()=> router.push(`/${sahredPost?.creator[0]._id}`)}>
                    <img src={sahredPost?.creator[0].image} alt="" />
                    <h2>{sahredPost?.creator[0].name}</h2>
                </head> 
                <img onClick={()=> {
                    history.pushState(message.postId,null,`/p/${message.postId}`);
                    dispatch(setShowPostModal(true))
                }} src={sahredPost?.posters[0].backdrop}  alt="" />
                <div className={styles.info}>
                    <span>{sahredPost?.creator[0].name}</span>
                    {sahredPost?.caption && `${sahredPost?.caption?.substring(0,150)} ...`}
                </div>
                {message.text && <p><span>{message.text}</span></p>}
            </div>
            :
            <p className={message.blockedBy?.includes(user.userId) && styles.error}>{message.text}</p>}
        </div>
    </div>
}