import styles from "../../styles/components/profile/Head.module.css";
import { faGear, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useSession} from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { setCustomPostOptions, setShowPostOptionsModal } from "../../features/modalSlice";
import PostOptionsModal from "../optionsModal/Index";
import { useDispatch,useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../lib/server";
import { getTotalUserPosts } from "../../features/user/posts";
import {follow, getTotalFollowers, getTotalFollowing, unfollow } from "../../features/user/follower";

export default function Head({}){
    const dispatch = useDispatch();
    const {data:user,status} = useSession();
    const [profile,setProfile] = useState([]);
    const [totalPosts,setTotalPosts] = useState([]);
    const {showPostOptionsModal,customPostOptions} = useSelector((state)=> state.modal);
    const router = useRouter();
    const {follow:followStatus,unfollow:unfollowStatus} = useSelector((state)=> state.userFollowers);
    const [followersTotal,setFollowersTotal] = useState([]);
    const [activeUserFollowersTotal,setActiveUserFollowersTotal] = useState([]);
    const {profile_id} = router.query;
    const [followed,setFollowed] = useState(false);

    const fetchUserData = async ()=>{
        const response = await axios.get(`${server}/api/user/${profile_id}`,{withCredentials:true});
        const data = await response.data[0];
        setProfile(data);
    }

    const fetchFollowStatus = async ()=>{
        const FollowedResponse = await axios.get(`${server}/api/user/${user.userId}/following/${profile_id}`,{withCredentials:true});
        const followedData = await FollowedResponse.data;
        dispatch(getTotalUserPosts({profile_id})).then(res=>setTotalPosts(res.payload))
        dispatch(getTotalFollowers({user_id:profile_id})).then(res => setFollowersTotal(res.payload))
        dispatch(getTotalFollowing({user_id:profile_id})).then(res => setActiveUserFollowersTotal(res.payload))
        if(followedData !== ""){
            setFollowed(true);
        }else{
            setFollowed(false);
        }
    }

    const showFollowerHandler = ()=>{
        dispatch(setShowPostOptionsModal(true))
        dispatch(setCustomPostOptions({type:"followersPeople",content:<PostOptionsModal profile_id={profile_id} />}))
    }

    const showFollowingHandler = ()=>{
        dispatch(setShowPostOptionsModal(true))
        dispatch(setCustomPostOptions({type:"followingPeople",content:<PostOptionsModal profile_id={profile_id} />}))
    }

    const followHandler = ()=>{
        dispatch(follow({user_id:user.userId,next_user_id:profile_id}))
    }

    const unfollowHandler = ()=>{
        dispatch(unfollow({user_id:user.userId,next_user_id:profile_id}))
    }

    useEffect(()=>{
        if(status === "authenticated"){
            fetchFollowStatus();
        }
    },[user,router,followStatus,unfollowStatus])

    useEffect(()=>{
        if(status === "authenticated"){
            fetchUserData();
        }
    },[user,router])

    return <>
        <div className={styles.head}>
            <img src={profile.image} alt="" />
            <div className={styles.info}>
                <div className={styles.user}>
                    <h2>{profile.username}</h2>
                    {user?.userId === profile_id && <button onClick={()=> router.push("/accounts")}>Edit Profile</button>}
                    {user?.userId !== profile_id &&
                    ((unfollowStatus === "pending" || followStatus === "pending") ? <button><FontAwesomeIcon className="fa-spin" icon={faSpinner} /></button>
                    :
                    followed ? <button onClick={unfollowHandler}>Unfollow</button> : <button style={{backgroundColor:"#0295F6",color:"#ffffff"}} onClick={followHandler}>Follow</button>) 
                    }
                    {user?.userId === profile_id &&  <FontAwesomeIcon icon={faGear} onClick={()=> router.push("/accounts")} />}
                </div>
                <div className={styles.more}>
                    <ul>
                        <li>{totalPosts} Posts</li>
                        <li onClick={showFollowerHandler}>{followersTotal} Followers</li>
                        <li onClick={showFollowingHandler}>{activeUserFollowersTotal} Following</li>
                    </ul>
                </div>
                <h3>{profile.name}</h3>
            </div>
        </div>
        {showPostOptionsModal && customPostOptions.content}
        </>

}