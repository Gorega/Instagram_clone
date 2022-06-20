import styles from "../../styles/components/messenger/SingleMessage.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react"
import { format } from "timeago.js";
import axios from "axios";
import { server } from "../../lib/server";
import { useRouter } from "next/router";
import { setShowPostModal } from "../../features/modalSlice";
import { useDispatch } from "react-redux";

export default function SignleMessage({message,chat}){
    const dispatch = useDispatch();
    const lastMessage = useRef();
    const {data:user} = useSession();
    const router = useRouter();
    const [senderImage,setSenderImage] = useState(null);
    const [sahredPost,setSharedPost] = useState();

    const fetchSharedPostData = async ()=>{
        const response = await axios.get(`${server}/api/post/${message.postId}`,{withCredentials:true})
        const data = response.data[0];
        setSharedPost(data);
    }

    const fetchMessageSenderData = async ()=>{
        const response = await axios.get(`${server}/api/user/${message.sender}`,{withCredentials:true});
        const data = response.data[0];
        setSenderImage(data.image);
    }

    useEffect(()=>{
        lastMessage.current?.scrollIntoView({behavior:"smooth"});
    },[chat])

    useEffect(()=>{
        fetchSharedPostData();
        fetchMessageSenderData();
    },[message])

    return <div ref={lastMessage} className={`${styles.message} ${message.sender !== user.userId && styles.own}`}>
        <div className={styles.date}>
            {format(message.createdAt)}
        </div>
        <div className={`${styles.text}`}>
            {message.sender !== user.userId && <img src={senderImage} alt="" />}
            {message.hasOwnProperty("postId") ? 
            <div className={styles.postPlaceholder}>
                <head onClick={()=> router.push(`/${sahredPost?.creator[0]._id}`)}>
                    <img src={sahredPost?.creator[0].image} alt="" />
                    <h2>{sahredPost?.creator[0].name}</h2>
                </head> 
                <img onClick={()=> {
                    history.pushState(message.postId,null,`/p/${message.postId}`);
                    dispatch(setShowPostModal(true))
                }} src={sahredPost?.posters[0]}  alt="" />
                <div className={styles.info}>
                    <span>{sahredPost?.creator[0].name}</span>
                    {`${sahredPost?.caption.substring(0,150)} ...`}
                </div>
                {message.text && <p><span>{message.text}</span></p>}
            </div>
            :
            <p>{message.text}</p>}
        </div>
    </div>
}