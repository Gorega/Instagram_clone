import styles from "../../styles/components/preLogin/Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import {signIn} from "next-auth/react"
import CardHolder from "../CardHolder";
import Foot from "../profile/Foot";
import Link from "next/link";
import logo from "../../public/logo.png";

export default function Login(){
    const [username,setUsername] = useState(null)
    const [email,setEmail] = useState(null)
    const [password,setPassword] = useState(null);
    const [error,setError] = useState({status:null,msg:""});

    const loginHandler = async (e)=>{
        e.preventDefault();
        setError({status:"pending"});
        const result = await signIn("credentials",{
            redirect:false,
            email:email,
            username:username,
            password:password,
        })
        if(result.error){
            setError({status:"fulfilled",msg:result.error});
        }
        if(!result.error){
            window.location.replace("/")
        }
    }

    return <div className={styles.login}>
        <div className={styles.body}>
            <CardHolder preLoginFormClassName={styles.formCard} style={{width:"50%",left:"50%",transform:"translateX(-50%)"}}>
                <div className={styles.logo}>
                    <img src={logo.src} alt="" />
                </div>
                <form onSubmit={loginHandler}>
                    <input type="text" placeholder="Username or email" value={email || username} onChange={(e)=>{
                        setEmail(e.target.value)
                        setUsername(e.target.value)
                    }} />
                    <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
                    <button className={(email && password) && styles.active} type="submit">{error.status === "pending" ? <FontAwesomeIcon className="fa-spin" icon={faSpinner} /> : "Log In"}</button>
                </form>
                <div className={styles.other}>
                    <div className={styles.facebookLogin} onClick={()=> signIn("facebook")}>
                        <FontAwesomeIcon icon={faFacebook} />
                        <h4>Log in with Facebook</h4>
                    </div>
                    {error.status && <div className={styles.errorMsg}>
                        {error.msg}    
                    </div>}
                    <h3>Forget password?</h3>
                </div>
            </CardHolder>
            <CardHolder preLoginFormClassName={styles.formCard} style={{width:"50%",left:"50%",transform:"translateX(-50%)"}}>
                <Link href="/register"><h4>Dont have an account? <span>Sign up</span></h4></Link>
            </CardHolder>
            <Foot />
        </div>
    </div>
}