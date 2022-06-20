import styles from "../../styles/components/preLogin/Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import CardHolder from "../CardHolder";
import Foot from "../profile/Foot";
import Link from "next/link";
import { useState } from "react";
import {signIn} from "next-auth/react"

export default function Login(){
    const [username,setUsername] = useState(null)
    const [email,setEmail] = useState(null)
    const [password,setPassword] = useState(null);

    const loginHandler = async (e)=>{
        e.preventDefault();
        const result = await signIn("credentials",{
            redirect:false,
            email:email,
            username:username,
            password:password,
        })
        if(result.error){
            console.log(result.error)
        }
        if(!result.error){
            window.location.replace("/")
        }
    }

    return <div className={styles.login}>
        <div className={styles.body}>
            <CardHolder style={{width:"50%",left:"50%",transform:"translateX(-50%)"}}>
                <div className={styles.logo}>
                    <img src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" alt="" />
                </div>
                <form onSubmit={loginHandler}>
                    <input type="text" placeholder="Username or email" value={email || username} onChange={(e)=>{
                        setEmail(e.target.value)
                        setUsername(e.target.value)
                    }} />
                    <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
                    <button type="submit">Log In</button>
                </form>
                <div className={styles.other}>
                    <div className={styles.facebookLogin}>
                        <FontAwesomeIcon icon={faFacebook} />
                        <h4>Log in with facebook</h4>
                    </div>
                    <h3>Forget password?</h3>
                </div>
            </CardHolder>
            <CardHolder style={{width:"50%",left:"50%",transform:"translateX(-50%)"}}>
                <Link href="/register"><h4>Dont have an account? <span>Sign up</span></h4></Link>
            </CardHolder>
            <Foot />
        </div>
    </div>
}