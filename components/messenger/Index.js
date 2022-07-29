import styles from "../../styles/components/messenger/Index.module.css";
import ConversationsSection from "./ConversationsSection";
import ChatSection from "./ChatSection";
import PostModal from "../PostModal";
import { useSelector } from "react-redux";

export default function Main(){
    const {showPostModal} = useSelector((state)=> state.modal);

    return <div className="container">
        <div className={styles.main}>
            <ConversationsSection />
            <ChatSection />
            {showPostModal && <PostModal />}
        </div>
    </div>
}