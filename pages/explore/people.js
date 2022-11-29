import styles from "../../styles/pages/explore/people.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import auth from "../api/auth/auth";
import Navbar from "../../components/navbar/Main";
import Footer from "../../components/profile/Foot";
import User from "../../components/sideInterface/User";
import UnfollowModal from "../../components/sideInterface/UnfollowModal";

export default function People(){
    const {data:user,status} = useSession();
    const {unfollowModal} = useSelector((state)=>state.modal);
    const [people,setPeople] = useState([]);
    const spinnerArray = [...Array(10)]

    const fetchSuggestedUsers = async ()=>{
        const response = await axios.get(`${server}/api/user/${user.userId}/suggested`,{withCredentials:true});
        const data = await response.data.results;
        setPeople(data);
    }

    useEffect(()=>{
        if(status === "authenticated"){
            fetchSuggestedUsers();
        }
    },[user])

    return <div className={styles.people}>
        <Navbar />
        <div className={styles.users}>
            <div className="container">
                <div className={styles.card}>
                    {people.length > 0 ? people.map((person,index)=>{
                        return <User key={index} people={true} person={person} />
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
            </div>
        </div>
        <div className={styles.footer}>
            <Footer />
        </div>
        
        {unfollowModal.status && <UnfollowModal person={unfollowModal.payload} /> }
    </div>

}


export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});