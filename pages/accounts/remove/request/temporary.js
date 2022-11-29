import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveSettingsList } from "../../../../features/navigatorListSlice";
import auth from "../../../api/auth/auth";
import Navbar from "../../../../components/navbar/Main";
import DeactivateTempraryPage from "../../../../components/settings/Index";


export default function Deactivate(){
    const dispatch = useDispatch();
    
    useEffect(()=>{
        dispatch(setActiveSettingsList(4))
    })

    return <>
        <Navbar />
        <DeactivateTempraryPage />
    </>
}


export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});