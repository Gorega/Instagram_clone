import styles from "../../styles/components/messenger/PeopleSec.module.css";
import { useContext, useEffect, useState } from "react";
import { setConversation, members, setShowConversationChat, setSocketConversation, setNewMessageNotification, setShowConversationDetails } from "../../features/messengerSlice";
import { useDispatch, useSelector } from "react-redux";
import {format} from "timeago.js";
import axios from "axios";
import { server } from "../../lib/server";
import { AppContext } from "../../contextApi";

export default function Conversation({conversation,senderId}){

        const dispatch = useDispatch();
        const [person,setPerson] = useState([]); 
        const [chat,setChat] = useState([]);
        const {socket} = useContext(AppContext);
        const [activeConversation,setActiveConversation] = useState(false);
        const {socketConversation} = useSelector((state)=> state.messenger);
        
        const fetchConversationMessages = async ()=>{
            const response = await axios.get(`${server}/api/messenger/${conversation._id}`,{withCredentials:true});
            const data = await response.data;
            setChat(data)
        }
        
        const fetchUserData = async ()=>{
            dispatch(members({senderId})).then(res => {
                setPerson(res.payload[0])
            });
        }

        useEffect(()=>{
            fetchConversationMessages();
        },[conversation])
        
        useEffect(()=>{
            fetchUserData();
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
        },[socketConversation])

    return <div className={`${styles.person} ${activeConversation && styles.active}`}
                onClick={()=> {
                history.pushState(`${[...conversation.members].join("")}`,null,`/direct/${[...conversation.members].join("")}`)
                dispatch(setShowConversationDetails(false));
                dispatch(setShowConversationChat(true));
                dispatch(setConversation({
                    id:[...conversation.members].join(""),
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