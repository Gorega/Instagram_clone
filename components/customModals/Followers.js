import { useEffect, useState } from "react";
import { useDispatch,useSelector} from "react-redux";
import { getFollowers } from "../../features/user/follower";
import Layout from "./peopleModal/Layout";

export default function Followers({profileId}){
    const dispatch = useDispatch();
    const [followersPeople,setFollowersPeople] = useState([]);
    const {follow:followStatus,unfollow:unfollowStatus} = useSelector((state)=> state.userFollowers);

    const fetchFollowersPeople = ()=>{
        dispatch(getFollowers({user_id:profileId})).then(res => {
            setFollowersPeople(res.payload)
        })
    }

    useEffect(()=>{
        fetchFollowersPeople();
    },[followStatus,unfollowStatus])

    return <Layout
        title="Followers"
        people={followersPeople}
        type="followersPeople"
    />
}