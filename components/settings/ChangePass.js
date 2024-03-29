import styles from "../../styles/components/settings/EditProfile.module.css";
import {server} from "../../lib/server";
import {useSession} from "next-auth/react";
import { useState } from "react";
import useForm from "../../lib/useForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ChangePass(){
    const {data:user} = useSession();
    const [oldPassword,setOldPassword] = useState(null);
    const [newPassword,setNewPassword] = useState(null);
    const [confirmNewPassword,setConfirmNewPassword] = useState(null);
    const {submitHandler,error,success,spinner} = useForm();

    const updateUserPassword = async (e)=>{
        e.preventDefault();
        submitHandler(
            "patch",
            `${server}/api/settings/change_password`,
            {oldPassword,newPassword,confirmNewPassword},
            "Updated Successfully"
        )
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
                <div className={styles.submitLine}>
                    <button type="submit">Change Password</button>
                    {spinner && <span><FontAwesomeIcon icon={faSpinner} className="fa-spin" /></span>}
                    {error.status === "fulfilled" && <span style={{color:"red"}}> <FontAwesomeIcon icon={faTimes} /> {error.msg}</span>}
                    {success.status && <span style={{color:"green"}}> <FontAwesomeIcon icon={faCheck} /> {success.msg}</span>}
                </div>
            </form>
    </div>
}