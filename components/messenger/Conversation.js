import styles from "../../styles/components/messenger/PeopleSec.module.css";
import { useContext, useEffect, useState } from "react";
import { setConversation, members, setShowConversationChat, setSocketConversation, setNewMessageNotification } from "../../features/messengerSlice";
import { useDispatch, useSelector } from "react-redux";
import {format} from "timeago.js";
import axios from "axios";
import { server } from "../../lib/server";
import { AppContext } from "../../contextApi";
import { useSession } from "next-auth/react";

export default function Conversation({conversation,senderId}){

        const dispatch = useDispatch();
        const {data:user,status} = useSession();
        const [person,setPerson] = useState([]); 
        const [chat,setChat] = useState([]);
        const {socket} = useContext(AppContext);
        const {socketConversation} = useSelector((state)=> state.messenger);

        const fetchUserData = async ()=>{
            dispatch(members({senderId})).then(res => setPerson(res.payload[0]));
        }

        const fetchConversationMessages = async ()=>{
            const response = await axios.get(`${server}/api/messenger/${conversation._id}`,{withCredentials:true});
            const data = await response.data;
            setChat(data)
        }

        useEffect(()=>{
            fetchUserData();
        },[conversation])

        useEffect(()=>{
            fetchConversationMessages();
        },[conversation])

        useEffect(()=>{
            socket?.current.on("getConversation",(data)=>{
                dispatch(setSocketConversation({
                    sender:data.sender,
                    receiverId:data.receiverId
                }))
            })
        },[])

        useEffect(()=>{
            if(socketConversation && conversation.members.every((member)=> member.includes(members))){
                setChat(prev=> [...prev,socketConversation])
            }
        },[socketConversation,conversation])

    return <div className={styles.person}
                onClick={()=> {
                history.pushState(`${conversation.members[0]}${senderId}`,null,`/direct/${conversation.members[0]}${senderId}`)
                dispatch(setShowConversationChat(true))
                dispatch(setConversation({
                    id:`${conversation.members[0]}${senderId}`,
                    data:conversation,
                    sender:person
                }))
                }}>
            <img src={person.image} alt="" />
            <div className={styles.info}>
            <h2>{person.name}</h2>
            <p>
                {chat[chat.length - 1]?.hasOwnProperty("postId") ? "Sent you a message" : chat[chat.length - 1]?.text} - {format(chat[chat.length -1]?.createdAt).includes("seconds") ? "Now" : format(chat[chat.length -1]?.createdAt)}
            </p>
            </div>
        </div>
}