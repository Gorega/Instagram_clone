import styles from "../../styles/components/messenger/ConversationsSection.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { setConversation, members, setShowConversationChat, setShowConversationDetails,setRecieverData, setMessengerPatch } from "../../features/messengerSlice";
import { useDispatch, useSelector } from "react-redux";
import {format} from "timeago.js";

export default function Conversation({conversation,senderId}){

    const dispatch = useDispatch();
        const {data:user} = useSession();
        const {conversation:conversationState} = useSelector((state)=> state.messenger);
        const [person,setPerson] = useState([]); 
        const [chat,setChat] = useState([]);
        const [isConversationViewed,setIsConversationViewed] = useState(conversation?.readBy.includes(user.userId));
        const [historyState,setHistoryState] = useState(history.state);
        
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

        const fetchRecieverData = async ()=>{
            dispatch(members({senderId:conversation?.members.find(member => member !== user.userId)})).then(res => {
                dispatch(setRecieverData(res.payload[0]))
            });
        }

        const updateConversationWatchers = async ()=>{
            await axios.patch(`${server}/api/user/${user.userId}/conversation/update/watcher/${conversation._id}`);
            setIsConversationViewed(true);
            dispatch(setMessengerPatch(false));
        }

        useEffect(()=>{
            fetchConversationMessages();
            setIsConversationViewed(conversation?.readBy.includes(user.userId));
            setHistoryState([...conversation.members].join(""))
        },[conversation])
        
        useEffect(()=>{
            fetchUserData();
        },[conversation])
        

    return <div className={`${styles.person} ${conversationState?.id === historyState && styles.active}`}
                onClick={()=> {
                history.pushState(`${[...conversation.members].join("")}`,null,`/direct/${[...conversation.members].join("")}`)
                setHistoryState([...conversation.members].join(""));
                dispatch(setShowConversationDetails(false));
                dispatch(setShowConversationChat(true));
                dispatch(setConversation({
                    id:[...conversation.members].join(""),
                    data:conversation,
                    sender:person
                }))
                fetchRecieverData();
                updateConversationWatchers();
                }}>
            <img src={person.image} alt="" />
            <div className={styles.info}>
            <h2>{person.name}</h2>
            <p>
                {chat[chat.length - 1]?.hasOwnProperty("postId") ? "Sent you a message" : chat[chat.length - 1]?.text.substring(0,20)} - {format(chat[chat.length -1]?.createdAt).includes("seconds") ? "Now" : format(chat[chat.length -1]?.createdAt)}
            </p>
            </div>
            {isConversationViewed || <div className={styles.patch}></div>}
        </div>
}