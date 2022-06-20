import SettingsPage from '../components/settings/Index';
import Navbar from "../components/navbar/Main";
import auth from './api/auth/auth';

export default function Accounts(){
    return  <>
        <Navbar />
        <SettingsPage />
    </>
}

export const getServerSideProps = auth(async()=>{
    return{
        props:{
            
        }
    }
});