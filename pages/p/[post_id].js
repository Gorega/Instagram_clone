import styles from "../../styles/pages/p/index.module.css";
import auth from "../api/auth/auth";
import { server } from "../../lib/server";
import axios from "axios";
import Post from "../../components/Post";
import CardHolder from "../../components/CardHolder";
import Navbar from "../../components/navbar/Main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import Foot from "../../components/profile/Foot";
import Link from "next/link";
import { useEffect } from "react";
import { setCustomPostOptions, setShowPostModal } from "../../features/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import PostModal from "../../components/PostModal";
import { useRouter } from "next/router";

export default function PostPage({post,userPosts}){
    const dispatch = useDispatch();
    const router = useRouter();
    const {post_id} = router.query;
    const {showPostModal} = useSelector((state)=> state.modal);

    const openPostModalHnadler = (post_id)=>{
        history.pushState(post_id,null,`/p/${post_id}`)
        dispatch(setShowPostModal(true))
    }

    useEffect(()=>{
        dispatch(setCustomPostOptions({type:null}))
    },[])

    return <>
        <Navbar />
        <div className="container">
            <div className={styles.card}>
                <CardHolder style={{padding:0,margin:"auto"}}>
                    <Post post={post} customStyle={{maxHeight:660}} />
                </CardHolder>
            </div>
            <div className={styles.posts}>
                <h2>More Posts from <Link href={`/${post.createdBy}`}><span>{post.creator[0].name}</span></Link></h2>
                <div className={styles.grid}>
                    {userPosts.map((post,index)=>{
                        return <div className={styles.post} key={index} onClick={()=> openPostModalHnadler(post._id)}>
                            <img src={post?.posters[0]} alt="" />
                            <div className={styles.patch}>
                                <ul>
                                    <li><FontAwesomeIcon icon={faHeart} /> <span>0</span></li>
                                    <li><FontAwesomeIcon icon={faComment} /> <span>0</span></li>
                                </ul>
                            </div>
                            </div>
                    })}
                </div>
            </div>
            
            <div className={styles.footer}>
                <Foot />
            </div>
        </div>
        {showPostModal && <PostModal onClose={`/p/${post_id}`} />}
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
            userPosts:userPostsData,
        }
    }
})