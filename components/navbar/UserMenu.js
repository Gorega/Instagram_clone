import styles from "../../styles/components/navbar/UserMenu.module.css";
import { faBookmark, faGear, faRepeat, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";

export default function UserMenu(){
    
    const {data:user} = useSession();
    
    return <div className={styles.menu}>
        <ul>
            <Link href={`/${user.userId}`}><li><FontAwesomeIcon icon={faUser} /> Profile</li></Link>
            <Link href={`/${user.userId}/saved`}><li><FontAwesomeIcon icon={faBookmark} /> Saved</li></Link>
            <Link href="/accounts/edit/"><li><FontAwesomeIcon icon={faGear} /> Settings</li></Link>
            <li><FontAwesomeIcon icon={faRepeat} /> Switch Accounts</li>
            <li onClick={()=> signOut()}>Log Out</li>
        </ul>
    </div>

}