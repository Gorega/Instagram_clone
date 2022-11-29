import { faBars, faBookmark, faCirclePlay, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { AppContext } from "../../contextApi";
import Content from "./content/Index";

export default function ListArray(){
    const router = useRouter();
    const {profile_id} = router.query;
    const {saved} = useContext(AppContext)
    const {userPosts} = useSelector((state)=>state.navigatorList)

    const list = [{
        title:"Posts",
        icon:faBars,
        content:<Content content={userPosts?.filter(post=> post.posters[0].contentType.includes("image"))} />,
        url:`/${profile_id}`
    },{
        title:"Videos",
        icon:faCirclePlay,
        content:<Content content={userPosts?.filter(post=> post.posters[0].contentType.includes("video"))} />,
        url:`/${profile_id}/channel`
    
    },{
        title:"Saved",
        icon:faBookmark,
        content:<Content saved={true} content={saved} />,
        url:`/${profile_id}/saved`
    },{
        title:"Tagged",
        icon:faHashtag,
        content:<Content content={[]} />,
        url:`/${profile_id}/tagged`
    }]

    return {list}
}