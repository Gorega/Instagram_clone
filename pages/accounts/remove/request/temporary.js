import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../../../../components/navbar/Main";
import { setActiveSettingsList } from "../../../../features/navigatorListSlice";
import DeactivateTempraryPage from "../../../../components/settings/Index";
import auth from "../../../api/auth/auth";


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


export const getServerSideProps = auth(()=>{
    return{
        props:{

        }
    }
})