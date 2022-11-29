import Navbar from "../../components/navbar/Main";
import SettingsPage from "../../components/settings/Index";
import auth from "../api/auth/auth";

export default function Edit(){

    return <>
        <Navbar />
        <SettingsPage />
    </>
}

export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});