import auth from './api/auth/auth';
import SettingsPage from '../components/settings/Index';
import Navbar from "../components/navbar/Main";

export default function Accounts(){
    return  <>
        <Navbar />
        <SettingsPage />
    </>
}

export const getServerSideProps = auth(async()=>{
    return{
        props:{}
    }
});