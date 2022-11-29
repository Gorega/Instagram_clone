import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveSettingsList } from "../../features/navigatorListSlice";
import auth from "../api/auth/auth";
import Navbar from "../../components/navbar/Main";
import PrivacyPage from "../../components/settings/Index";


export default function Help(){
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(setActiveSettingsList(2))
    })

    return <>
        <Navbar />
        <PrivacyPage />
    </>
}


export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});