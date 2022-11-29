import LoginPage from "../components/preLogin/Login";
import { useRouter } from "next/router";
import {useSession} from "next-auth/react";
import { useState } from "react";

export default function Login(){
    const router = useRouter();
    const [loading,setLoading] = useState(true);
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
        return <div>Loading...</div>
    }

    return <LoginPage />
}