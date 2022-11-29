import styles from "../../styles/components/settings/EditProfile.module.css";
import axios from "axios";
import {server} from "../../lib/server";
import {useSession} from "next-auth/react";
import { useState } from "react";

export default function ChangePass(){
    const {data:user} = useSession();
    const [oldPassword,setOldPassword] = useState(null);
    const [newPassword,setNewPassword] = useState(null);
    const [confirmNewPassword,setConfirmNewPassword] = useState(null);

    const updateUserPassword = async (e)=>{
        e.preventDefault();
        const response = await axios.patch(`${server}/api/settings/change_password`,{oldPassword,newPassword,confirmNewPassword},{withCredentials:true});
    }

    return <div className={styles.main}>
            <form onSubmit={updateUserPassword}>
                <div className={styles.head}>
                    <img src={user?.image} alt="" />
                    <div className={styles.user}>
                        <h3 style={{marginTop:-20}}>{user?.username}</h3>
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.inputField}>
                        <label>Old Password</label>
                        <input type="password" style={{background:"#FAFAFA"}} value={oldPassword} onChange={(e)=> setOldPassword(e.target.value)} />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.inputField}>
                        <label >New Password</label>
                        <input type="password" style={{background:"#FAFAFA"}} value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} />
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.inputField}>
                        <label>Confirm New Password</label>
                        <input type="password" style={{background:"#FAFAFA"}} value={confirmNewPassword} onChange={(e)=> setConfirmNewPassword(e.target.value)} />
                    </div>
                </div>
                <button type="submit">Change Password</button>
            </form>
    </div>
}