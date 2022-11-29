import ProfilePage from "../../components/profile/Index";
import Navbar from "../../components/navbar/Main";
import auth from "../api/auth/auth";

export default function Profile(){

    return <>
        <Navbar />
        <ProfilePage />
    </>
}

export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});