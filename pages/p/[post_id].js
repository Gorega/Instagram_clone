import styles from "../../styles/pages/p/index.module.css";
import axios from "axios";
import { server } from "../../lib/server";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setCustomModal } from "../../features/modalSlice";
import auth from "../api/auth/auth";
import PostCardModal from "../../components/postCardModal/Index";
import CardHolder from "../../components/CardHolder";
import Navbar from "../../components/navbar/Main";
import Foot from "../../components/profile/Foot";
import Link from "next/link";
import PostCard from "../../components/postCardModal/Layout";
import UserPosts from "../../components/p/userPosts";

export default function PostPage({post,userPostsData}){
    const dispatch = useDispatch();
    const router = useRouter();
    const {post_id} = router.query;
    const {showPostModal} = useSelector((state)=> state.modal);

    useEffect(()=>{
        dispatch(setCustomModal({status:false,type:null}))
    },[])

    return <>
        <Navbar />
        <div className="container">
            <div className={styles.card}>
                <CardHolder style={{padding:0,margin:"auto"}}>
                    <PostCard post={post} customStyle={{maxHeight:660,minHeight:660}} />
                </CardHolder>
            </div>
            <div className={styles.posts}>
                <h2>More Posts from <Link href={`/${post.createdBy}`}><span>{post.creator[0].name}</span></Link></h2>
                <div className={styles.grid}>
                    {userPostsData?.map((post,index)=>{
                        return <UserPosts key={index} post={post} />
                    })}
                </div>
            </div>
            
            <div className={styles.footer}>
                <Foot />
            </div>
        </div>
        {showPostModal && <PostCardModal onClose={`/p/${post_id}`} />}
    </>
}

export const getServerSideProps = auth(async(context)=>{
    const {post_id} = context.params;
    // fetch post data
    const response = await axios.get(`${server}/api/post/${post_id}`,{withCredentials:true});
    const data = await response.data[0];
    
    // fetch user posts
    const userPostsResponse = await axios.get(`${server}/api/user/${data.createdBy}/posts`,{withCredentials:true});
    const userPostsData = await userPostsResponse.data.results;

    return{
        props:{
            post:data,
            userPostsData:userPostsData,
        }
    }
})