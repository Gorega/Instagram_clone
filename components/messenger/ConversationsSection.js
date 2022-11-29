import styles from "../../styles/components/messenger/ConversationsSection.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSelector,useDispatch } from "react-redux";
import { setPeopleModal, setSocketConversation } from "../../features/messengerSlice";
import { AppContext } from "../../contextApi";
import Conversation from "./Conversation";
import PeopleModal from "./PeopleModal";

export default function ConversationsSection(){
    const {data:user,status} = useSession();
    const dispatch = useDispatch();
    const {socket} = useContext(AppContext);
    const {socketConversation,peopleModal,pending} = useSelector((state)=> state.messenger)
    const [conversations,setConversations] = useState([]);
    const peopleSpinner = [...new Array(8)];

    const fetchConversations = async ()=>{
            const response = await axios.get(`${server}/api/user/${user.userId}/conversation`,{withCredentials:true});
            const data = await response.data;
            setConversations(data);
    }

    useEffect(()=>{
        if(status === "authenticated"){
            fetchConversations();
        }
    },[user,socketConversation,pending])

    useEffect(()=>{
        socket?.current?.on("getConversation",(data)=>{
            dispatch(setSocketConversation({
                sender:data.sender,
                receiverId:data.receiverId
            }))
        })
    },[socket.current])

    return <>
        <div className={styles.peopleSec}>
            <div className={styles.head}>
                <h2>{user?.username}</h2>
                <div className={styles.send} onClick={()=> dispatch(setPeopleModal(true))}>
                    <svg ariaLabel="New Message" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.202 3.203H5.25a3 3 0 00-3 3V18.75a3 3 0 003 3h12.547a3 3 0 003-3v-6.952" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 012.004 0l1.224 1.225a1.417 1.417 0 010 2.004z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.848" x2="20.076" y1="3.924" y2="7.153"></line></svg>
                </div>
            </div>
            <div className={styles.people}>
                {conversations.length > 0
                ? 
                conversations?.map((conversation,index)=>{
                    const senderId = conversation.members?.find((member)=> member !== user.userId);
                    return <Conversation key={index} conversation={conversation} senderId={senderId && senderId} />
                })
                :
                peopleSpinner.map((_,index)=>{
                    return <div key={index} className={styles.spinner}>
                    <div className={styles.img}></div>
                    <div className={styles.info}>
                        <h2></h2>
                        <p></p>
                    </div>
                    </div>
                })}
            </div>
        </div>
        {peopleModal && <PeopleModal type="message" />}
    </>

}