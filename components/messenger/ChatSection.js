import styles from "../../styles/components/messenger/ChatSection.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useSession } from "next-auth/react";
import { useEffect, useState, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../../contextApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {deleteConversation,setPending, setPeopleModal, setShowConversationChat,setShowConversationDetails} from "../../features/messengerSlice";
import ConversationDetails from "./ConversationDetails";
import SingleMessage from "./SingleMessage";
import dynamic from "next/dynamic";
const Picker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
});

export default function ChatSection(){

    const messageBoxInputRef = useRef();
    const emojiPickerBoxRef = useRef();
    const dispatch = useDispatch();
    const {data:user} = useSession();
    const {showConversationDetails,showConversationChat,conversation,recieverData} = useSelector((state)=> state.messenger);
    const {socket} = useContext(AppContext);
    const [socketMessage,setSocketMessage] = useState("");
    const [messageText,setMessageText] = useState("");
    const [chat,setChat] = useState([]);
    const [showEmojiPicker,setShowEmojiPicker] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [chatSpinner,setChatSpinner] = useState(null);
    const [isUserBlocked,setIsUserBlocked] = useState(conversation?.data.blockedBy.includes(receiverId));
    const receiverId = conversation?.data.members.find((member)=> member !== user.userId);
    
    const postNewMessageHandler = async (e)=>{
            e.preventDefault();
            socket?.current.emit("sendMessage",{
                conversationId:conversation.data._id,
                sender:user.userId,
                text:messageText
            })

            // show conversation to next_user when sending message for the first time
            socket?.current.emit("addConversation",{
                sender:user.userId,
                receiverId:receiverId,
            })

            // update conversation wathcers
            axios.put(`${server}/api/user/${user.userId}/conversation/update/watcher/${conversation.data._id}`,{next_user_id:receiverId})
            axios.patch(`${server}/api/user/${user.userId}/conversation/update/watcher/${conversation.data._id}`);

            // show message to next_user
            axios.patch(`${server}/api/user/${user.userId}/conversation/update/${conversation.data._id}`,{next_user_id:receiverId})

            // show messsenger patch on Navbar
            socket?.current.emit("addMessengerPatch",{
                receiverId:receiverId,
            })

            // send userId to socket server (emit)
            socket?.current.emit("addUser",user.userId);
            // get connected users from socket server (on)
            socket?.current.on("getUsers",(users)=>{
            })

        try{
            setMessageText("");
            const response = await axios.post(`${server}/api/messenger/${conversation.data._id}`,{sender:user.userId,text:messageText,members:conversation.data.members});
            const data = await response.data;
            setChat([...chat,data]);

        }catch(err){
            setIsUserBlocked(true)
        }
    }

    const fetchConversationMessages = async ()=>{
        setChatSpinner("pending")
        const response = await axios.get(`${server}/api/messenger/${conversation.data._id}`,{withCredentials:true});
        const data = await response.data;
        setChat(data)
        setChatSpinner("fulfilled")
    }

    const onEmojiClick = (event, emojiObject) => {
        messageBoxInputRef.current.focus();
        setMessageText(messageText => messageText.concat(emojiObject.emoji))
        setChosenEmoji(emojiObject);
      };

    useEffect(()=>{
        dispatch(setShowConversationChat(false))
    },[])

    useEffect(()=>{
        if(conversation){
            messageBoxInputRef?.current?.focus();
            fetchConversationMessages();
            setMessageText("");
            setIsUserBlocked(conversation?.data.blockedBy.includes(receiverId));
        }
    },[conversation])

    useEffect(()=>{
        socket?.current?.on("getMessage",(data)=>{
            setSocketMessage({
                conversationId:data.conversationId,
                sender:data.sender,
                text:data.text,
                createdAt:Date.now()
            })
        })
    },[socket.current])

    // get socket blocking status
    useEffect(()=>{
        socket?.current?.on("getUnblockedConversation",(data)=>{
            if(data.conversationId === conversation?.data._id){
                setIsUserBlocked(false)
            }
        })
        socket?.current?.on("getBlockedConversation",(data)=>{
            if(data.conversationId === conversation?.data._id){
                setIsUserBlocked(true)
            }
        })
    },[socket.current,isUserBlocked])

    useEffect(()=>{
        if(socketMessage && conversation?.data._id === socketMessage.conversationId && conversation.data.members.includes(socketMessage.sender)){
            setChat(prev=> [...prev,socketMessage])
        }
    },[socketMessage])

    useEffect(()=>{
        const closeEmojiPickerBox = (e)=>{
            if(emojiPickerBoxRef.current && !emojiPickerBoxRef.current.contains(e.target)){
                setShowEmojiPicker(false)
            }
        }
        document.addEventListener("mouseup",closeEmojiPickerBox);
        return()=>{
        document.removeEventListener("mouseup",closeEmojiPickerBox)
        }
    },[])

    return <>
        <div className={styles.messageSec}>
        {showConversationChat
        ? 
        showConversationDetails
        ? <ConversationDetails
                conversation={conversation}
                member={conversation.sender}
                />
        :
        <div className={styles.messageHolder}>
            <>
                <div className={styles.head}>
                    <div className={styles.sender}>
                        <img src={conversation.sender.image} alt="" />
                        <h2>{conversation.sender.name}</h2>
                    </div>
                    <div className={styles.info} onClick={()=> dispatch(setShowConversationDetails(true))}>
                        <svg ariaLabel="View Thread Details" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><circle cx="11.819" cy="7.709" r="1.25"></circle><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="10.569" x2="13.432" y1="16.777" y2="16.777"></line><polyline fill="none" points="10.569 11.05 12 11.05 12 16.777" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline></svg>
                    </div>
                </div>

                <div className={styles.body}>
                    {chatSpinner === "pending" ? <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> : chat.map((message,index)=>{
                        return <SingleMessage key={index} message={message} chat={chat} />
                    })}
                </div>

                {conversation?.data.blockedBy.includes(user.userId) ?
                <div className={styles.band}>You blocked {recieverData?.name}. <span onClick={()=> {
                    dispatch(setPending(true))
                    dispatch(deleteConversation({userId:user.userId,conversationId:conversation.data._id})).then(res=>{
                        dispatch(setPending(false))
                        dispatch(setShowConversationChat(false));
                    })
                }}>Delete chat</span></div>
                :
                <form className={`${styles.sendBox} ${isUserBlocked && styles.disabledBox}`} onSubmit={postNewMessageHandler}>
                    <div className={styles.face} onClick={()=> setShowEmojiPicker(!showEmojiPicker)}>
                        <svg ariaLabel="Emoji" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path></svg>
                    </div>
                    <input type="text" disabled={isUserBlocked && true} placeholder={isUserBlocked ? `You can't send messages to ${recieverData?.name} anymore :)` : "Message..."} value={messageText} onChange={(e)=> setMessageText(e.target.value)} ref={messageBoxInputRef} />
                    <div className={styles.upload}>
                        <svg ariaLabel="Add Photo or Video" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M6.549 5.013A1.557 1.557 0 108.106 6.57a1.557 1.557 0 00-1.557-1.557z" fillRule="evenodd"></path><path d="M2 18.605l3.901-3.9a.908.908 0 011.284 0l2.807 2.806a.908.908 0 001.283 0l5.534-5.534a.908.908 0 011.283 0l3.905 3.905" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path><path d="M18.44 2.004A3.56 3.56 0 0122 5.564h0v12.873a3.56 3.56 0 01-3.56 3.56H5.568a3.56 3.56 0 01-3.56-3.56V5.563a3.56 3.56 0 013.56-3.56z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </div>
                    <div className={styles.emojiPickerBox} ref={emojiPickerBoxRef}>
                        {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
                    </div>
                </form>
                }
            </>
        </div>
        : 
        <div className={styles.placeholder}>
            <div className={styles.content}>
                <svg ariaLabel="Direct" color="#262626" fill="#262626" height="96" role="img" viewBox="0 0 96 96" width="96"><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="69.286" x2="41.447" y1="33.21" y2="48.804"></line><polygon fill="none" points="47.254 73.123 71.376 31.998 24.546 32.002 41.448 48.805 47.254 73.123" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                <h1>Your Messages</h1>
                <p>Send private photos and messages to a friend or group.</p>
                <button onClick={()=> dispatch(setPeopleModal(true))}>Send Message</button>
            </div>
        </div>}

     </div>
    </>

}