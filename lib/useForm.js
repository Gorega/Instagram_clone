import axios from "axios"
import { useState } from "react";

export default function useForm(){
    const [error,setError] = useState({status:null,msg:""});
    const [success,setSuccess] = useState({status:false,msg:""})
    
    const submitHandler = (method,url,params)=>{
        setError({status:"pending"});
        return axios[method](url,params,{withCredentials:true})
        .then(res =>{
            setSuccess({status:true})
            return true;
        }).catch(err => {
            setError({status:"fulfilled",msg:err.response.data.msg});
            return false
        })
    }

        return {submitHandler,error,success}
}