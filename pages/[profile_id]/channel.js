import SavedPosts from "../../components/profile/Index";
import Navbar from "../../components/navbar/Main";
import auth from "../../pages/api/auth/auth";
import { setActiveProfileList } from "../../features/navigatorListSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function Channel(){

    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(setActiveProfileList(1))
    },[])

    return <>
        <Navbar />
        <SavedPosts />
    </>
}


export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});