import styles from "../../styles/components/messenger/Index.module.css";
import PeopleSec from "./PeopleSec";
import MessageSec from "./MessageSec";
import PostModal from "../PostModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setNewMessageNotification } from "../../features/messengerSlice";

export default function Main(){
    const dispatch = useDispatch();
    const {showPostModal} = useSelector((state)=> state.modal);
    
    useEffect(()=>{
        dispatch(setNewMessageNotification(false));
    },[])

    return <div className="container">
        <div className={styles.main}>
            <PeopleSec />
            <MessageSec />
            {showPostModal && <PostModal />}
        </div>
    </div>
}