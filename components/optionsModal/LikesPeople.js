import styles from "../../styles/components/PostOptionsModal.module.css";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../lib/server";
import { useDispatch } from "react-redux";
import { getFollowing } from "../../features/user/follower";


export default function LikesPeople({person}){
    const dispatch = useDispatch();
    const {data:user} = useSession();
    const [followingPeople,setFollowingPeople] = useState([]);
    const [spinner,setSpinner] = useState(false);
    const followed = followingPeople.find((follower)=> follower.user_id === person.createdBy);


    const FollowerHandler = async (next_user_id)=>{
        setSpinner(true)
        if(followed){
            await axios.delete(`${server}/api/user/${user.userId}/follower/${next_user_id}`);
            setSpinner(false)
        }else{
            await axios.post(`${server}/api/user/${user.userId}/follower`,{user_id:next_user_id});
            setSpinner(false)
        }
    }

    useEffect(()=>{
        dispatch(getFollowing({user_id:user.userId})).then(res=> {
            setFollowingPeople(res.payload)
        })
    },[spinner])

    return <div className={styles.person}>
                <img src={person.creator[0].image} alt="" />
                <h3>{person.creator[0].username}</h3>
                <button style={{backgroundColor:followed && "#B2DFFB"}} onClick={()=> FollowerHandler(person.createdBy)}>
                    {spinner ? <FontAwesomeIcon className="fa-spin" icon={faSpinner} /> : followed ? "Unfollow" : "Follow"}
                </button>
            </div>
}