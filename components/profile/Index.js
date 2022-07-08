import { useDispatch, useSelector } from "react-redux";
import Foot from "./Foot";
import Head from "./Head";
import NavigatorList from "./NavigatorList";
import Lists from "./Lists";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { AppContext } from "../../contextApi";
import { getUserPosts } from "../../features/user/posts";
import PostModal from "../PostModal";

export default function Index(){
    const dispatch = useDispatch();
    const {data:user,status} = useSession();
    const {showPostModal} = useSelector((state)=> state.modal);
    const {activeProfileList} = useSelector((state)=> state.navigatorList);
    const {list} = Lists();
    const {setUserPosts} = useContext(AppContext);
    const router = useRouter();
    const {profile_id} = router.query;

    useEffect(()=>{
        if(status === "authenticated"){
            dispatch(getUserPosts({profile_id})).then(res=>setUserPosts(res.payload))
        }
    },[user,router])

    return <div className="container">
        <Head />
        <NavigatorList />
        <div>
            {list[activeProfileList].content}
        </div>
        <Foot />
        {showPostModal && <PostModal onClose={`/${profile_id}`} />}
    </div>
}