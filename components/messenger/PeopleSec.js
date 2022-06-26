import styles from "../../styles/components/messenger/PeopleSec.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../lib/server";
import { useSession } from "next-auth/react";
import Conversation from "./Conversation";
import { useSelector,useDispatch } from "react-redux";
import { setPeopleModal } from "../../features/messengerSlice";
import PeopleModal from "./PeopleModal";

export default function People(){
    const {data:user,status} = useSession();
    const dispatch = useDispatch();
    const {socketConversation,peopleModal} = useSelector((state)=> state.messenger)
    const [conversations,setConversations] = useState([]);
    const peopleSpinner = [...new Array(8)]

    const fetchConversations = async ()=>{
            const response = await axios.get(`${server}/api/user/${user.userId}/conversation`,{withCredentials:true});
            const data = await response.data;
            setConversations(data);
    }

    useEffect(()=>{
        if(status === "authenticated"){
            fetchConversations();
        }
    },[status,socketConversation,conversations])

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
                conversations.map((conversation,index)=>{
                    const senderId = conversation.seenBy.find((member)=> member !== user.userId);
                    if(senderId){
                        return <Conversation key={index} conversation={conversation} senderId={senderId} />
                    }
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