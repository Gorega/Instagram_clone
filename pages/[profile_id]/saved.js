import { useEffect } from "react";
import SavedPosts from "../../components/profile/Index";
import Navbar from "../../components/navbar/Main";
import { setActiveProfileList } from "../../features/navigatorListSlice";
import { useDispatch } from "react-redux";
import auth from "../api/auth/auth";

export default function Saved(){
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setActiveProfileList(2))
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