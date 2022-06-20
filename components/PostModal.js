import ModalHolder from "../components/ModalHolder";
import { useState,useEffect } from "react";
import axios from "axios";
import { server } from "../lib/server";
import Post from "./Post";

export default function PostModal(){
    const [post,setPost] = useState([]);

    const fetchPostData = async ()=>{
        const response = await axios.get(`${server}/api/post/${history.state}`,{withCredentials:true});
        const data = await response.data[0];
        setPost(data);
    }

    useEffect(()=>{
        fetchPostData();
    },[])

    return <ModalHolder style={{padding:"0"}} showCloseButton={true}>
        <Post post={post} /> 
    </ModalHolder>
}