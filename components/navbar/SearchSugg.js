import styles from "../../styles/components/navbar/SearchSugg.module.css";
import axios from "axios"
import {server} from "../../lib/server";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SearchSugg({setSearchBarSpinner,username}){
    const router = useRouter();
    const [foundUsers,setFoundUsers] = useState([]);
    const controller = new AbortController();

    const fetchSearchedUsers = async ()=>{
        try{
            setSearchBarSpinner(true)
            const response = await axios.get(`${server}/api/user?username=${username}`,{signal:controller.signal},{withCredentials:true});
            const data = await response.data;
            setSearchBarSpinner(false);
            setFoundUsers(data);
        }catch(err){
            if(controller.signal) return;
        }
    }

    useEffect(()=>{
        fetchSearchedUsers()
        return()=>{
            controller.abort();
        }
    },[username])

    return <div className={styles.search}>
            {foundUsers.length > 0 ? foundUsers.map((user,index)=>{
                return <div key={index} className={styles.sec} onClick={()=> router.push(`/${user._id}`)}>
                <img src={user.image} alt="" />
                <div className={styles.info}>
                    <h4>{user.username}</h4>
                    <p>{user.name} - Followed by ...</p>
                </div>
                </div>
            }) : "No results found."}
    </div>
}