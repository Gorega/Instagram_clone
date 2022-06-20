import styles from "../../styles/components/messenger/Index.module.css";
import PeopleSec from "./PeopleSec";
import MessageSec from "./MessageSec";
import PostModal from "../PostModal";
import { useSelector } from "react-redux";

export default function Main(){
    const {showPostModal} = useSelector((state)=> state.modal);

    return <div className="container">
        <div className={styles.main}>
        <PeopleSec />
        <MessageSec />
        {showPostModal && <PostModal />}
        </div>
    </div>
}