import styles from '../styles/Home.module.css'
import Navbar from "../components/navbar/Main";
import PostCard from '../components/PostCard';
import PeopleCard from '../components/PeopleCard';
import UserSide from '../components/sideInterface/UserSide';
import axios from "axios";
import {server} from "../lib/server";
import auth from './api/auth/auth';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppContext } from '../contextApi';
import EditPostModal from "../components/post/Index";
import PostModal from '../components/PostModal';
import PeopleModal from '../components/messenger/PeopleModal';
import UnfollowModal from '../components/sideInterface/UnfollowModal';
import instagramSpinner from "../public/instagram.png"

export default function Home() {
  const [page,setPage] = useState(1);
  const [firstRender,setFirstRender] = useState(true);
  const {posts,setPosts,postId,uploadedFiles} = useContext(AppContext);
  const {peopleModal} = useSelector((state)=> state.messenger);
  const {unfollowModal} = useSelector((state)=>state.modal);
  const {showPostOptionsModal,editPostModal,customPostOptions,showPostModal} = useSelector((state)=>state.modal);
  const {currentFile} = useSelector((state)=> state.addPost);
  const observer = useRef();

  const lastPostElementRef = useCallback(node =>{
    if(observer.current){
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        setFirstRender(false);
        setPage((page)=>{
          return page + 1
        })
      }
    })
    if(node){
      observer.current.observe(node)
    }
  },[]);

  useEffect(()=>{
    const fetchMorePosts = async ()=>{
        const response = await axios.get(`${server}/api/post?page=${page}`,{withCredentials:true});
        const data = await response.data;
        setPosts(data.results)
    }
    if(!firstRender){
      fetchMorePosts();
    }
  },[page])

  return posts.length <= 0 ?
  <div className={styles.spinner}>
    <img src={instagramSpinner.src} alt="" />
  </div>
  :
  <>
    <Navbar />
    <div className='container'>
    <PeopleCard />
    <div className={styles.posts}>
      {posts?.map((post,index)=>{
        const {name,image} = post.creator[0];
        if(posts.length === index + 1){
          return <div ref={lastPostElementRef} key={index}>
            <PostCard key={index} {...post} name={name} image={image} post_likes={post.post_likes} />
          </div>
        }
        return <PostCard key={index} {...post} name={name} image={image} post_likes={post.post_likes} />
      })}
        <UserSide />
      </div>
    </div>
    {editPostModal.status && <EditPostModal editPost={true} backdrop={uploadedFiles[currentFile]?.backdrop} />}
    {showPostModal && <PostModal onClose={"/"} />}
    {peopleModal && <PeopleModal type="share" postId={postId} />}
    {showPostOptionsModal && customPostOptions.content}
    {unfollowModal.status && <UnfollowModal person={unfollowModal.payload} /> }
  </>
}

export const getServerSideProps = auth(async()=>{
  return{
      props:{}
  }
});