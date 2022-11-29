import styles from "../../styles/components/messenger/PeopleModal.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {setPending,setPeopleModal} from "../../features/messengerSlice";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ModalHolder from "../ModalHolder";

export default function PeopleModal({type}){
    
    const dispatch = useDispatch();
    const {data:user} = useSession();
    const {pending} = useSelector((state)=> state.messenger)
    const {postId} = useSelector((state)=>state.post);
    const [username,setUsername] = useState(null);
    const [suggestedUsers,setSuggestedUsers] = useState([]);
    const [foundUsers,setFoundUsers] = useState([]);
    const [selectedPeopleToMessage,setSelectedPeopleToMessage] = useState([]);
    const [shareText,setShareText] = useState(null);
    const controller = new AbortController();

    const fetchSuggestedUsers = async ()=>{
        const response = await axios.get(`${server}/api/user/${user.userId}/suggested`,{withCredentials:true});
        const data = await response.data.results;
        setSuggestedUsers(data);
    }

    const fetchSearchedUsers = async ()=>{
        try{
            const response = await axios.get(`${server}/api/user?username=${username}`,{signal:controller.signal},{withCredentials:true});
            const data = await response.data;
            setFoundUsers(data);
        }catch(err){
            if(controller.signal) return;
        }
    }

    const addConversationHandler = async (senderId)=>{
        try{
            dispatch(setPending(true))
            await axios.post(`${server}/api/user/${user.userId}/conversation`,{userId:user.userId,senderId});
            dispatch(setPending(false))
            dispatch(setPeopleModal(false))
        }catch(err){
            // if(err.response.data.msg === "Already Exist"){
            //     dispatch(setPeopleModal(false))
            // }
        }
    }

    const share = async (conversationId,personId)=>{
        await axios.post(`${server}/api/messenger/${conversationId}`,{sender:personId,text:shareText,members:[user.userId,personId],postId});
        dispatch(setPeopleModal(false))
    }

    const sharePostHandler = async ()=>{
        selectedPeopleToMessage.map(async (person)=> {
            const conversationsReposnse = await axios.get(`${server}/api/user/${user.userId}/conversation`,{withCredentials:true});
            const conversationsData = await conversationsReposnse.data;
            const conversation = conversationsData.find((conversation)=> conversation.members.includes(person.userId));
            if(!conversation){
                const newConversationResponse = await axios.post(`${server}/api/user/${user.userId}/conversation`,{userId:user.userId,senderId:person.userId});
                const newConversationData = await newConversationResponse.data;
                share(newConversationData._id,person.userId)
            }else{
                share(conversation._id,person.userId)
            }
        })
    }

    useEffect(()=>{
        fetchSearchedUsers();
        fetchSuggestedUsers();
        return()=>{
            controller.abort();
        }
    },[username,pending])

    return <ModalHolder style={{width:"400px",height:"650px",borderRadius:"15px",padding:0}}>
    <div className={styles.peopleModal}>
        {type === "message" && <div className={styles.messageHead}>
            <div className={styles.close} onClick={()=> dispatch(setPeopleModal(false))}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
            <h2>New message</h2>
            <div className={`${styles.next} ${selectedPeopleToMessage.length > 0 && styles.active}`} onClick={()=>{
                selectedPeopleToMessage.map((person)=>{
                    addConversationHandler(person.userId)
                })
                }}>
                Next
            </div>
        </div>}

        {type === "share" && <div className={styles.shareHead}>
            <h2>Share</h2>
            <div className={styles.close} onClick={()=> dispatch(setPeopleModal(false))}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
        </div>}

        <div className={styles.searchBar}>
            <span>To:</span>
            <div className={styles.in}>
                <div className={styles.added}>
                    <ul>
                        {selectedPeopleToMessage.map((person,index)=>{
                            return <li key={index}>{person.username} <FontAwesomeIcon onClick={()=>{
                                setSelectedPeopleToMessage((selectedPeopleToMessage)=>{
                                    return selectedPeopleToMessage.filter((user)=> user.userId !== person.userId);
                                })
                            }} icon={faTimes} /></li>
                        })}
                    </ul>
                </div>
                <input type="text" placeholder="Search..." value={username} onChange={(e)=> setUsername(e.target.value)} />
            </div>
        </div>

        <div className={styles.body}>
            {!username && <h3>Suggested</h3>}
            <div className={styles.list}>
                    {(foundUsers.length > 0 ? foundUsers : suggestedUsers)?.map((user,index)=>{
                        const selectedUser = selectedPeopleToMessage.find((person)=> person.userId === user._id);
                        return  <div key={index} className={styles.person} onClick={(e)=>{
                            setSelectedPeopleToMessage(selectedPeopleToMessage => {
                                if(!selectedUser){
                                    return selectedPeopleToMessage = [...selectedPeopleToMessage,{username:user.username,userId:user._id}]
                                }else{
                                    return selectedPeopleToMessage.filter((person)=> person.userId !== user._id);
                                }
                            });
                            
                        }}>
                        <img src={user.image} alt="" />
                        <div className={styles.info}>
                            <h2>{user.username}</h2>
                            <p>{user.name}</p>
                        </div>
                        <div className={`${styles.choose} ${selectedUser && styles.active}`}></div>
                        </div>
                    })}
            </div>

            {type === "share" && <div className={styles.submit}>
                <input type="text" placeholder="Write a message .." className={selectedPeopleToMessage.length > 0 && styles.show} value={shareText} onChange={(e)=> setShareText(e.target.value)} />
                <button onClick={sharePostHandler} className={selectedPeopleToMessage.length <= 0 && styles.disabled}>Send</button>
            </div>}
        </div>

    </div>
</ModalHolder>
}