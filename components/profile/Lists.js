import { faBars, faBookmark, faCirclePlay, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AppContext } from "../../contextApi";
import Content from "./Content";

export default function Lists(){
    const router = useRouter();
    const {saved,userPosts} = useContext(AppContext)
    const {profile_id} = router.query;

    const list = [{
        title:"Posts",
        icon:faBars,
        content:<Content content={userPosts} />,
        url:`/${profile_id}`
    },{
        title:"Videos",
        icon:faCirclePlay,
        content:null,
        url:`/${profile_id}/channel`
    
    },{
        title:"Saved",
        icon:faBookmark,
        content:<Content saved={true} content={saved} />,
        url:`/${profile_id}/saved`
    },{
        title:"Tagged",
        icon:faHashtag,
        content:null,
        url:`/${profile_id}/tagged`
    }]

    return {list}
}