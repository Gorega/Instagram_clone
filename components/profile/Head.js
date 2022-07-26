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
import { setSpinner } from "../../features/navigatorListSlice";

export default function Head(){
    const dispatch = useDispatch();
    const router = useRouter();
    const {data:user,status} = useSession();
    const [profile,setProfile] = useState([]);
    const [totalPosts,setTotalPosts] = useState([]);
    const {spinner} = useSelector((state)=> state.navigatorList);
    const {showPostOptionsModal,customPostOptions} = useSelector((state)=> state.modal);
    const {follow:followStatus,unfollow:unfollowStatus} = useSelector((state)=> state.userFollowers);
    const [followersTotal,setFollowersTotal] = useState([]);
    const [activeUserFollowersTotal,setActiveUserFollowersTotal] = useState([]);
    const {profile_id} = router.query;
    const [followed,setFollowed] = useState(null);
    const userData = axios.get(`${server}/api/user/${profile_id}`);
    const getFollowStatus = axios.get(`${server}/api/user/${user?.userId}/following/${profile_id}`);

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

    const retrieveData = async ()=>{
        await Promise.all([userData,getFollowStatus]).then((values)=>{
            setProfile(values[0].data[0]);
            dispatch(getTotalUserPosts({profile_id})).then(res=>setTotalPosts(res.payload))
            dispatch(getTotalFollowers({user_id:profile_id})).then(res => setFollowersTotal(res.payload))
            dispatch(getTotalFollowing({user_id:profile_id})).then(res => setActiveUserFollowersTotal(res.payload))
            if(values[1].data !== ""){
                setFollowed(true);
            }else{
                setFollowed(false);
            }
            dispatch(setSpinner(false));
        })
    }

    useEffect(()=>{
        if(status === "authenticated"){
            retrieveData();
        }
    },[user,router,followStatus,unfollowStatus,spinner])

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
            </> : <FontAwesomeIcon icon={faSpinner} style={{fontSize:25,marginTop:25}} className="fa-spin" />}
        </div>
        {showPostOptionsModal && customPostOptions.content}
        </>

}