import styles from "../../styles/components/messenger/ConversationDetails.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { AppContext } from "../../contextApi";
import { deleteConversation, setPending, setShowConversationChat, setShowConversationDetails } from "../../features/messengerSlice";
import ModalHolder from "../ModalHolder";

export default function ConversationDetails({conversation,member}){

    const dispatch = useDispatch();
    const {data:user} = useSession();
    const router = useRouter();
    const {socket} = useContext(AppContext);
    const [showAlert,setShowAlert] = useState({status:false,type:null});
    const [isUserBlocked,setIsUserBlocked] = useState(conversation?.data.blockedBy.includes(user.userId)); 
    
    const deleteConversationHandler = async ()=>{
        dispatch(setPending(true))
        dispatch(deleteConversation({userId:user.userId,conversationId:conversation.data._id})).then(res=>{
            dispatch(setShowConversationChat(false));
            setShowAlert({status:false})
            dispatch(setPending(false))
        })
    }

    const blockConversationHandler = async ()=>{
        dispatch(setPending(true))
        const response = await axios.patch(`${server}/api/user/${user.userId}/conversation/block/${conversation.data._id}`);
        setIsUserBlocked(true)
        setShowAlert({status:false})
        socket?.current.emit("blockConversation",{
            conversationId:conversation.data._id
        })
        dispatch(setPending(false))
    }

    const UnblockConversationHandler = async ()=>{
        dispatch(setPending(true))
        const response = await axios.delete(`${server}/api/user/${user.userId}/conversation/block/${conversation.data._id}`);
        setIsUserBlocked(false);
        socket?.current.emit("UnblockConversation",{
            conversationId:conversation.data._id
        })
        dispatch(setPending(false))
    }

    return <>
        <div className={styles.details}>
        <div className={styles.head}>
            <h2>Details</h2>
            <div className={styles.info} onClick={()=> dispatch(setShowConversationDetails(false))}>
                <svg ariaLabel="Navigate back to chat from thread details" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.001.504a11.5 11.5 0 1011.5 11.5 11.513 11.513 0 00-11.5-11.5zm-.182 5.955a1.25 1.25 0 11-1.25 1.25 1.25 1.25 0 011.25-1.25zm1.614 11.318h-2.865a1 1 0 010-2H11V12.05h-.432a1 1 0 010-2H12a1 1 0 011 1v4.727h.433a1 1 0 110 2z"></path></svg>
            </div>
        </div>
        <div className={`${styles.body}`}>
            <div className={`${styles.mute} ${styles.sec}`}>
                <input type="checkbox" />
                <span>Mute message</span>
            </div>
            <div className={`${styles.members} ${styles.sec}`}>
                <h2>Members</h2>
                <div className={styles.person} onClick={()=> router.push(`/${member._id}`)}>
                    <img src={member.image} alt="" />
                    <div className={styles.info}>
                        <h2>{member.name}</h2>
                        <p>{member.username}</p>
                    </div>
                </div>
            </div>
            <div className={`${styles.control} ${styles.sec}`}>
                <ul>
                    <li onClick={()=> setShowAlert({status:true,type:"delete"})}>Delete Chat</li>
                    <li onClick={()=> {
                        if(isUserBlocked){
                            UnblockConversationHandler();
                        }else{
                            setShowAlert({status:true,type:"block"})
                        }
                    }}>{isUserBlocked ? "Unblock" : "Block"}</li>
                    <li>Report</li>
                </ul>
            </div>
        </div>
    </div>
    {showAlert.status && <ModalHolder style={{width:450,height:"fit-content",borderRadius:15}}>
        <div className={styles.alert}>
            <h2>
                {showAlert.type === "delete" && "Delete Chat?" }
                {showAlert.type === "block" && `Block ${member.username}`}
            </h2>
            <p>
                {showAlert.type === "delete" && "Deleting removes the chat from your inbox, but no one else's inbox."}
                {showAlert.type === "block" && "They won't be able to find your profile, posts or story on Instagram. Instagram won't let them know that you've blocked them."}
            </p>
            <ul>
                {showAlert.type === "delete" && <li onClick={deleteConversationHandler}>Delete</li>}
                {showAlert.type === "block" && <li onClick={blockConversationHandler}>Block</li>}
                <li onClick={()=> setShowAlert({status:false})}>Cancel</li>
            </ul>
        </div>
    </ModalHolder>}
    </>

}