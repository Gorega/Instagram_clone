import styles from "../../styles/components/profile/Head.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { faGear, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useSession} from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setCustomModal } from "../../features/modalSlice";
import { getTotalUserPosts } from "../../features/user/posts";
import { setSpinner } from "../../features/navigatorListSlice";
import {follow, getTotalFollowers, getTotalFollowing, unfollow } from "../../features/user/follower";
import CustomModalLayout from "../customModals/Index";

export default function Head(){
    const dispatch = useDispatch();
    const router = useRouter();
    const {profile_id} = router.query;
    const {data:user,status} = useSession();
    const {spinner} = useSelector((state)=> state.navigatorList);
    const {customModal} = useSelector((state)=> state.modal);
    const {follow:followStatus,unfollow:unfollowStatus} = useSelector((state)=> state.userFollowers);
    const [profile,setProfile] = useState([]);
    const [totalPosts,setTotalPosts] = useState([]);
    const [followersTotal,setFollowersTotal] = useState([]);
    const [activeUserFollowersTotal,setActiveUserFollowersTotal] = useState([]);
    const [followed,setFollowed] = useState(null);
    const userData = axios.get(`${server}/api/user/${profile_id}`);
    const getFollowStatus = axios.get(`${server}/api/user/${user?.userId}/following/${profile_id}`);

    const showFollowerHandler = ()=>{
        dispatch(setCustomModal({status:true,type:"followersPeople",content:<CustomModalLayout profileId={profile_id} />}))
    }

    const showFollowingHandler = ()=>{
        dispatch(setCustomModal({status:true,type:"followingPeople",content:<CustomModalLayout profileId={profile_id} />}))
    }

    const followHandler = ()=>{
        setFollowed(true)
        dispatch(follow({user_id:user.userId,next_user_id:profile_id}))
    }

    const unfollowHandler = ()=>{
        setFollowed(false)
        dispatch(unfollow({user_id:user.userId,next_user_id:profile_id}))
    }

    const retrieveProfileInfo = ()=>{
        dispatch(getTotalUserPosts({profile_id})).then(res=>setTotalPosts(res.payload))
        dispatch(getTotalFollowers({user_id:profile_id})).then(res => setFollowersTotal(res.payload))
        dispatch(getTotalFollowing({user_id:profile_id})).then(res => setActiveUserFollowersTotal(res.payload))
    }

    const retrieveData = async ()=>{
        await Promise.all([userData,getFollowStatus]).then((values)=>{
            setProfile(values[0].data[0]);
            if(values[1].data !== ""){
                setFollowed(true);
            }else{
                setFollowed(false);
            }
            dispatch(setSpinner(false));
        })
    }

    useEffect(()=>{
        retrieveProfileInfo()
    },[user,router,followStatus,unfollowStatus])

    useEffect(()=>{
        if(status === "authenticated"){
            retrieveData();
        }
    },[user,router,spinner])

    useEffect(()=>{
        dispatch(setSpinner(true))
    },[router])

    return <>
        <div className={styles.head}>
            {!spinner ? <>
                <img src={profile.image} alt="" />
                <div className={styles.info}>
                    <div className={styles.user}>
                        <h2>{profile.username}</h2>
                        {user?.userId === profile_id && <button onClick={()=> router.push("/accounts")}>Edit Profile</button>}
                        {user?.userId !== profile_id &&
                        ((unfollowStatus === "pending" || followStatus === "pending") ? <button><FontAwesomeIcon className="fa-spin" icon={faSpinner} /></button>
                        :
                        followed ? <button style={{border:"1px solid #d9d9d9"}} onClick={unfollowHandler}>Unfollow</button> : <button style={{backgroundColor:"#0295F6",color:"#ffffff"}} onClick={followHandler}>Follow</button>) 
                        }
                        {user?.userId === profile_id && <FontAwesomeIcon icon={faGear} onClick={()=> router.push("/accounts")} />}
                    </div>
                    <div className={styles.more}>
                        <ul>
                            <li>{totalPosts} Posts</li>
                            <li onClick={showFollowerHandler}>{followersTotal} Followers</li>
                            <li onClick={showFollowingHandler}>{activeUserFollowersTotal} Following</li>
                        </ul>
                    </div>
                    {/* <h3>{profile.name}</h3> */}
                </div>
            </> : <FontAwesomeIcon icon={faSpinner} style={{fontSize:25,marginTop:25}} className="fa-spin" />}
        </div>
        {customModal.status && customModal.content}
        </>

}