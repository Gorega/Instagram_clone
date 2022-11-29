import React,{ useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { getUserPosts } from "../../features/user/posts";
import { setUserPosts } from "../../features/navigatorListSlice";
import Head from "./Head";
import TapList from "./TapList";
import ListArray from "./ListArray";
import PostCardModal from "../postCardModal/Index";
import Foot from "./Foot";

export default function Index(){
    const dispatch = useDispatch();
    const router = useRouter();
    const {profile_id} = router.query;
    const {data:user,status} = useSession();
    const {showPostModal} = useSelector((state)=> state.modal);
    const {activeProfileList} = useSelector((state)=> state.navigatorList);
    const {list} = ListArray();

    useEffect(()=>{
        if(status === "authenticated"){
            dispatch(getUserPosts({profile_id})).then(res=> dispatch(setUserPosts(res.payload)))
        }
    },[user,router])

    return <div className="container">
        <Head />
        <TapList />
        <div>
            {list[activeProfileList].content}
        </div>
        <Foot />
        {showPostModal && <PostCardModal onClose={`/${profile_id}`} />}
    </div>
}