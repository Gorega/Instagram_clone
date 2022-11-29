import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import { server } from "./lib/server";
import { useDispatch, useSelector } from "react-redux";
import { savedList} from "./features/savedSlice";
import { useSession } from "next-auth/react";
import io from 'socket.io-client';

export const AppContext = React.createContext();

const AppProvider = (props)=>{
    
    const socket = useRef();
    const dispatch = useDispatch();
    const {data:user,status} = useSession();
    const {saveToList,removeFromSaved} = useSelector((state)=> state.saved);
    const {updatePosts} = useSelector((state)=> state.post);
    const [saved,setSaved] = useState([]);
    const [posts,setPosts] = useState([]);

    const fetchPosts = async ()=>{
        const response = await axios.get(`${server}/api/post`,{withCredentials:true});
        const data = await response.data.results;
        setPosts(data);
    }
    
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
        posts,
        setPosts
    }}>
        {props.children}
    </AppContext.Provider>
}

export default AppProvider;