import axios from "axios";
import { server } from "../../lib/server";
import { useState,useEffect } from "react";
import ModalHolder from "../ModalHolder";
import Layout from "./Layout";

export default function Index(props){
    const [post,setPost] = useState([]);

    const fetchPostData = async ()=>{
        const response = await axios.get(`${server}/api/post/${history.state}`,{withCredentials:true});
        const data = await response.data[0];
        setPost(data);
    }

    useEffect(()=>{
        fetchPostData();
    },[])

    return <ModalHolder style={{padding:0}} showCloseButton={true} onClose={props.onClose}>
        <Layout post={post} /> 
    </ModalHolder>
}