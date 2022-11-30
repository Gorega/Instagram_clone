import axios from "axios"
import { useState } from "react";

export default function useForm(){
    const [spinner,setSpinner] = useState(false);
    const [error,setError] = useState({status:null,msg:""});
    const [success,setSuccess] = useState({status:false,msg:""})
    
    const submitHandler = (method,url,params,successMsg)=>{
        setSpinner(true)
        setSuccess(false);
        setError({status:"pending"});
        return axios[method](url,params,{withCredentials:true})
        .then(_ =>{
            setSpinner(false)
            setSuccess({status:true,msg:successMsg})
            return true;
        }).catch(err => {
            setSpinner(false)
            setError({status:"fulfilled",msg:err.response.data.msg});
            return false
        })
    }

        return {submitHandler,error,success,spinner}
}