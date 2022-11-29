import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveProfileList } from "../../features/navigatorListSlice";
import auth from "../api/auth/auth";
import SavedPosts from "../../components/profile/Index";
import Navbar from "../../components/navbar/Main";

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