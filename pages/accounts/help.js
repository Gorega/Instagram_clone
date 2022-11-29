import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveSettingsList } from "../../features/navigatorListSlice";
import auth from "../api/auth/auth";
import Navbar from "../../components/navbar/Main";
import HelpPage from "../../components/settings/Index";


export default function Help(){
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(setActiveSettingsList(3))
    })

    return <>
        <Navbar />
        <HelpPage />
    </>
}


export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});