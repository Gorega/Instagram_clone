import styles from "../../styles/components/UserSide.module.css";
import axios from "axios";
import {server} from "../../lib/server";
import {useSession} from "next-auth/react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import User from "./User";

export default function UserSide(){
    const {data:user,status} = useSession();
    const [suggestedUsers,setSuggestedUsers] = useState([]);
    const spinnerArray = [...Array(3)];

    const fetchSuggestedUser = async ()=>{
            const response = await axios.get(`${server}/api/user/${user.userId}/suggested`,{withCredentials:true});
            const data = await response.data.results
            setSuggestedUsers(data);
    }

    useEffect(()=>{
        if(status === "authenticated"){
            fetchSuggestedUser();
        }
    },[user])


    return <div className={styles.main}>
            <div className={styles.user}>
                <Link href={`/${user?.userId}`}><img src={user?.image} alt="" /></Link>
                <div className={styles.info}>
                    <Link href={`/${user?.userId}`}><h3>{user?.username}</h3></Link>
                    <p>{user?.user.name}</p>
                </div>
                <span onClick={()=> signOut()}>Switch</span>
            </div>
            <div className={styles.more}>
                <div className={styles.head}>
                    <h3>Suggestions For You</h3>
                    <Link href="/explore/people/"><span>See All</span></Link>
                </div>

                <div className={styles.users}>
                    {suggestedUsers.length > 0 ? suggestedUsers.map((user,index)=>{
                        return <User key={index} styles={styles} person={user} />
                    })
                    :
                    spinnerArray.map((_,index)=>{
                        return <div key={index} className={styles.spinner}> 
                        <div className={styles.image}></div>
                        <div className={styles.info}>
                            <h2></h2>
                            <p></p>
                        </div>
                        </div>
                    })}
            </div>

            <div className={styles.footer}>
                <ul>
                    <li>About .</li>
                    <li>Help .</li>
                    <li>Press .</li>
                    <li>API .</li>
                    <li>Jobs .</li>
                    <li>Privacy .</li>
                    <li>Teams .</li>
                    <li>Locations .</li>
                    <li>Top Awwards .</li>
                    <li>Headings .</li>
                    <li>Language</li>
                </ul>
                <span>@ 2022 INSTAGRAM CLONE FORM GOREGA</span>
            </div>
        </div>
    </div>

}