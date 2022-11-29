import styles from "../../styles/components/messenger/Index.module.css";
import { useSelector } from "react-redux";
import ConversationsSection from "./ConversationsSection";
import ChatSection from "./ChatSection";
import PostCardModal from "../postCardModal/Index";

export default function Main(){

    const {showPostModal} = useSelector((state)=> state.modal);

    return <div className="container">
        <div className={styles.main}>
            <ConversationsSection />
            <ChatSection />
            {showPostModal && <PostCardModal />}
        </div>
    </div>
}