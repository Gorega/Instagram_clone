import Navbar from "../../components/navbar/Main";
import MessangerPage from "../../components/messenger/Index";
import auth from "../api/auth/auth";

export default function Inbox(){
    return <>
        <Navbar />
        <MessangerPage />
    </>
}


export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});