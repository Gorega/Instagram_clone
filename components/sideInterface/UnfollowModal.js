import styles from "../../styles/components/UserSide.module.css"
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setUnfollowModal } from "../../features/modalSlice";
import { unfollow } from "../../features/user/follower";
import ModalHolder from "../ModalHolder";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function UnfollowModal({person}){
    
    const dispatch = useDispatch();
    const {data:user} = useSession();
    const [spinner,setSpinner] = useState(false);

    const unfollowHandler = (next_user_id)=>{
        setSpinner(true)
        dispatch(unfollow({user_id:user.userId,next_user_id})).then(_=> {
            setSpinner(false)
            dispatch(setUnfollowModal({status:false}));
        });
    }

    return <div className={`${styles.unfollowmodal}`}>
        <ModalHolder style={{width:450,height:"fit-content",borderRadius:15}}>
            <img src={person.image} alt="" />
            <h2>Unfollow @{person.username}</h2>
            <ul>
                <li onClick={()=> unfollowHandler(person._id)}>Unfollow {spinner && <FontAwesomeIcon className="fa-spin" icon={faSpinner} />} </li>
                <li onClick={()=> dispatch(setUnfollowModal({status:false}))}>Cancel</li>
            </ul>
        </ModalHolder>
    </div>
}