import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowing } from "../../features/user/follower";
import Layout from "./peopleModal/Layout";

export default function Following({profileId}){

    const dispatch = useDispatch();
    const [followingPeople,setFollowingPeople] = useState([]);
    const {follow:followStatus,unfollow:unfollowStatus} = useSelector((state)=> state.userFollowers);

    const fetchFollowingPeople = ()=>{
        dispatch(getFollowing({user_id:profileId})).then(res=> {
            setFollowingPeople(res.payload)
        })
    }

    useEffect(()=>{
        fetchFollowingPeople();
    },[followStatus,unfollowStatus])

    return <Layout
        title="Following"
        people={followingPeople}
        type="followingPeople"
    />
}