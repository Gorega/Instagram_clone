import RegisterPage from "../components/preLogin/Register"
import { useRouter } from "next/router";
import { useState } from "react";
import {useSession} from "next-auth/react";

export default function Register(){
    const [loading,setLoading] = useState(true);
    const router = useRouter();
    const {status} = useSession({
        required:true,
        onUnauthenticated(){
            setLoading(false)
        }
    });

    if(status === "authenticated"){
        router.replace("/")
    }
    
    if(loading){
        return <div>loading...</div>
    }

    return <RegisterPage />
}