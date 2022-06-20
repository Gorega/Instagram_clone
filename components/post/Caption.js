import styles from "../../styles/components/post/Caption.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceGrin, faLocation } from "@fortawesome/free-solid-svg-icons";
import {useSession} from "next-auth/react";

export default function Caption(props){
    const {data:user} = useSession();
    return <div className={styles.main}>
        <div className={styles.head}>
            <img src={user.user.image} alt="" />
            <h2>{user.username}</h2>
        </div>
        <div className={styles.caption}>
            <textarea placeholder="Write a caption..." value={props.caption} onChange={props.setCaption}></textarea>
            <div className={styles.counter}>
                {props.caption.length}/2,200
            </div>
            <div className={styles.smile}>
                <FontAwesomeIcon icon={faFaceGrin} />
            </div>
        </div>
        <div className={styles.options}>
            <ul>
                <li>
                    <input type="text" placeholder="Add Location" value={props.location} onChange={props.setLocation} />
                    <FontAwesomeIcon icon={faLocation} />
                </li>
            </ul>
        </div>
    </div>
}