import styles from "../../../styles/components/CustomModal.module.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { follow, getFollowing, unfollow } from "../../../features/user/follower";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Person({person,type}){

    const dispatch = useDispatch();
    const {data:user} = useSession();
    const [spinner,setSpinner] = useState(false);
    const [followingPeople,setFollowingPeople] = useState([]);
    const isFollowed = followingPeople.find((follower)=> follower.user_id === person.createdBy);

    const FollowerHandler = async (next_user_id)=>{
        setSpinner(true)
        if(isFollowed){
            dispatch(unfollow({user_id:user.userId,next_user_id})).then(_=> {
                setSpinner(false)
            });
        }else{
            dispatch(follow({user_id:user.userId,next_user_id})).then(_=> {
                setSpinner(false)
            })
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
        {type === "peopleLikes" ?
        <button style={{backgroundColor:isFollowed && "#B2DFFB"}} onClick={()=> FollowerHandler(person.createdBy)}>
            {spinner ? <FontAwesomeIcon className="fa-spin" icon={faSpinner} /> : isFollowed ? "Unfollow" : "Follow"}
        </button>
        :
        <button style={{backgroundColor:"white",color:"black",border:"1px solid #d9d9d9"}}
            onClick={()=>dispatch(unfollow({user_id:user.userId,next_user_id:person.user_id}))}>
            Remove
        </button>}
    </div>
}