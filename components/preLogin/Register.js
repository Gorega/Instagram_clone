import styles from "../../styles/components/preLogin/Register.module.css";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardHolder from "../CardHolder";
import Foot from "../profile/Foot";
import Link from "next/link"
import {server} from "../../lib/server";
import useForm from "../../lib/useForm";
import { useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Register(){
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [username,setUsername] = useState(null);
    const [name,setName] = useState(null);
    const {submitHandler,loading} = useForm()
    const registerHandler = async (e)=>{
        e.preventDefault();
        const success = await submitHandler("post",`${server}/api/auth/register`,{email,name,username,password});
        if(success){
            window.location.replace("/login")
        }
    }

    return <div className={styles.register}>
        <div className={styles.body}>
            <CardHolder style={{width:"50%",left:"50%",transform:"translateX(-50%)"}}>
                <div className={styles.logo}>
                    <img src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" alt="" />
                </div>
                <p>Sign up to see photos and videos from your friends.</p>
                <div className={styles.facebookRegister}>
                    <FontAwesomeIcon icon={faFacebook} />
                    <span>Log in with facebook</span>
                </div>
                <form onSubmit={registerHandler}>
                    <input type="email" placeholder="Email" required value={email} onChange={(e)=> setEmail(e.target.value)} />
                    <input type="text" placeholder="Full Name" required value={name} onChange={(e)=> setName(e.target.value)} />
                    <input type="text" placeholder="Username" required value={username} onChange={(e)=> setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" required value={password} onChange={(e)=> setPassword(e.target.value)} />
                    <button type="submit" style={{backgroundColor:loading && "#B2DFFB",pointerEvents:loading && "none"}}>{loading ? <FontAwesomeIcon className="fa-spin" icon={faSpinner} /> : "Sign up"}</button>
                    <span>By signing up, you agree to our Terms , Data Policy and Cookies Policy .</span>
                </form>
            </CardHolder>
            <CardHolder style={{width:"50%",left:"50%",transform:"translateX(-50%)"}}>
                <Link href="/login"><h3>Have an account? <span>Log in</span></h3></Link>
            </CardHolder>
            <Foot />
        </div>
    </div>

}