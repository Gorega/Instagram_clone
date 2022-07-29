import React, { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savedList} from "./features/savedSlice";
import { useSession } from "next-auth/react";
import { getTotalFollowers, getTotalFollowing } from "./features/user/follower";
import {follow,unfollow} from "./features/user/follower";
import axios from "axios";
import { server } from "./lib/server";
import io from 'socket.io-client';

export const AppContext = React.createContext();

const AppProvider = (props)=>{
    
    const socket = useRef();
    const dispatch = useDispatch();
    const {data:user,status} = useSession();
    const {saveToList,removeFromSaved} = useSelector((state)=> state.saved);
    const {follow:followStatus,unfollow:unfollowStatus} = useSelector((state)=> state.userFollowers);
    const [saved,setSaved] = useState([]);
    const [posts,setPosts] = useState([]);
    const [userPosts,setUserPosts] = useState([]);
    const [followersTotal,setFollowersTotal] = useState([]);
    const [activeUserFollowersTotal,setActiveUserFollowersTotal] = useState([]);
    const {updatePosts} = useSelector((state)=> state.post);
    const [searchBarSpinner,setSearchBarSpinner] = useState(false);
    const [postId,setPostId] = useState(null);
    const [uploadedFiles,setUploadedFiles] = useState([]);

    const fetchPosts = async ()=>{
        const response = await axios.get(`${server}/api/post`,{withCredentials:true});
        const data = await response.data.results;
        setPosts(data);
    }

    const FollowerHandler = (follower,next_user_id)=>{
        if(follower){
            dispatch(unfollow({user_id:user.userId,next_user_id}))
        }else{
            dispatch(follow({user_id:user.userId,next_user_id}))
        }
    }

    useEffect(()=>{
        if(status === "authenticated"){
            dispatch(getTotalFollowers({user_id:user.userId})).then(res => setFollowersTotal(res.payload))
            dispatch(getTotalFollowing({user_id:user.userId})).then(res => setActiveUserFollowersTotal(res.payload))
        }
    },[user,followStatus,unfollowStatus])
    
    useEffect(()=>{
        if(status === "authenticated"){
            dispatch(savedList()).then(res => setSaved(res.payload));
        }
    },[saveToList,removeFromSaved,user])

    useEffect(()=>{
        if(status === "authenticated"){
            fetchPosts();
        }
    },[user,updatePosts])

    // socket connection
    const initSocket = async ()=>{
        axios.get(`${server}/api/socket`).then((res)=>{
            socket.current = io();
        })
    }

    useEffect(()=>{
        if(status === "authenticated"){
            initSocket();
        }
    },[user])

    return <AppContext.Provider value={{
        socket,
        saved,
        followersTotal,activeUserFollowersTotal,
        FollowerHandler,
        posts,setPosts,
        userPosts,setUserPosts,
        searchBarSpinner,setSearchBarSpinner,
        postId,setPostId,
        uploadedFiles,setUploadedFiles,
    }}>
        {props.children}
    </AppContext.Provider>
}

export default AppProvider;