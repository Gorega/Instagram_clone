import { useState } from "react";
import axios from "axios"

export default function useForm(){
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState({status:false,msg:""});
    const [success,setSuccess] = useState({status:false,msg:""})
            const submitHandler = (method,url,params)=>{
                setLoading(true)
                return axios[method](url,params,{withCredentials:true})
                .then(res =>{
                    setLoading(false);
                    setSuccess({status:true})
                    return true;
                }).catch(err => {
                    setLoading(false)
                    setError({status:true,msg:err.response.data.msg});
                    return false
                })
            }

        return {submitHandler,error,success,loading}
}