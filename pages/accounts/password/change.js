import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveSettingsList } from "../../../features/navigatorListSlice";
import auth from "../../api/auth/auth";
import Navbar from "../../../components/navbar/Main";
import PasswordChangePage from "../../../components/settings/Index";


export default function PasswordChange(){
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(setActiveSettingsList(1))
    })

    return <>
    <Navbar />
    <PasswordChangePage />
    </>
}


export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});