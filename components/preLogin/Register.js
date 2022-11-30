import styles from "../../styles/components/preLogin/Register.module.css";
import { useState } from "react";
import {server} from "../../lib/server";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import CardHolder from "../CardHolder";
import Foot from "../profile/Foot";
import Link from "next/link";
import useForm from "../../lib/useForm";
import logo from "../../public/logo.png";

export default function Register(){
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);
    const [username,setUsername] = useState(null);
    const [name,setName] = useState(null);
    const {submitHandler,error} = useForm()

    const registerHandler = async (e)=>{
        e.preventDefault();
        const success = await submitHandler("post",`${server}/api/auth/register`,{email,name,username,password});
        if(success){
            window.location.replace("/login")
        }
    }

    return <div className={styles.register}>
        <div className={styles.body}>
            <CardHolder preLoginFormClassName={styles.formCard} style={{width:"50%",left:"50%",transform:"translateX(-50%)"}}>
                <div className={styles.logo}>
                    <img src={logo.src} alt="" />
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
                    <span>By signing up, you agree to our Terms , Data Policy and Cookies Policy .</span>
                    <button className={(email && password && username && name) && styles.active} type="submit">{error.status === "pending" ? <FontAwesomeIcon className="fa-spin" icon={faSpinner} /> : "Sign up"}</button>
                    {error && <div className={styles.errorMsg}>
                        {error.msg}
                    </div>}
                </form>
            </CardHolder>
            <CardHolder preLoginFormClassName={styles.formCard} style={{width:"50%",left:"50%",transform:"translateX(-50%)"}}>
                <Link href="/login"><h3>Have an account? <span>Log in</span></h3></Link>
            </CardHolder>
            <Foot />
        </div>
    </div>

}