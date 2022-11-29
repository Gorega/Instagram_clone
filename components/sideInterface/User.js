import styles from "../../styles/components/UserSide.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { follow } from "../../features/user/follower";
import { setUnfollowModal } from "../../features/modalSlice";
import Link from "next/link";

export default function User({people,person}){

    const dispatch = useDispatch();
    const {data:user} = useSession();
    const [followedUser,setFollowedUser] = useState(false);
    const {unfollow:unfollowStatus,follow:followStatus} = useSelector((state)=> state.userFollowers);

    const followHandler = (next_user_id)=>{
        setFollowedUser(true);
        dispatch(follow({user_id:user.userId,next_user_id}))
    }

    const getFollowing = async ()=>{
        const FollowedResponse = await axios.get(`${server}/api/user/${user.userId}/following/${person._id}`,{withCredentials:true});
        const followedData = await FollowedResponse.data;
        if(followedData !== ""){
            setFollowedUser(true);
        }else{
            setFollowedUser(false)
        }
    }

    useEffect(()=>{
        getFollowing();
    },[unfollowStatus,followStatus])

    return <>
        <div className={`${styles.user} ${people && styles.people}`}>
            <Link href={`/${person._id}`}><img src={person.image} alt="" /></Link>
            <div className={styles.info}>
                <Link href={`/${person._id}`}><h3>{person.username}</h3></Link>
                <p>{person.name}</p>
            </div>
            {followedUser ? <span className={styles.inactive} onClick={()=> dispatch(setUnfollowModal({status:true,payload:person}))}>Following</span> : <span onClick={()=>{
                followHandler(person._id)
            }}>Follow</span>}
        </div>
    </>
}