import SavedPosts from "../../components/profile/Index";
import Navbar from "../../components/navbar/Main";
import auth from "../api/auth/auth";

export default function Tagged(){
    const data = [];
    return <>
        <Navbar />
        <SavedPosts content={data} />
    </>
}

export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});