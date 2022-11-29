import { useSession } from "next-auth/react";
import styles from "../../styles/components/settings/RemoveTemporary.module.css";

export default function RemoveTemporary(){
    const {data:user} = useSession();

    return <div className={styles.main}>
        <h2>Temporarily Deactivate Your Account</h2>
        <h4>Hi <span>{user.username}</span></h4>
        <p>You can deactivate your account instead of deleting it. This means that your account will be hidden until you reactivate it by logging back in.<br/>
        You can only deactivate your account once a week.</p>

        <form>
            <div className={styles.field}>
                <label>Why are you deactivating your account?</label>
                <select>
                    <option value="none">Select</option>
                    <option>Want to remove something</option>
                    <option>Privacy Concerns</option>
                    <option>Too busy/Too distracting</option>
                    <option>can not find people to follow</option>
                    <option>Toruble getting started</option>
                    <option>Too many ads</option>
                    <option>Just need a break</option>
                    <option>Something else</option>
                </select>
            </div>
            <div className={styles.field}>
                <label>To continue, please re-enter your password</label>
                <div className={styles.pass}>
                    <input type="password" />
                    <span>Forgotten your password?</span>
                </div>
            </div>
        </form>
        <p>When you press the button below, your photos, comments and likes will be hidden until you reactivate your account by logging back in.</p>
        <button>Temprarily Deactivate Account</button>
    </div>
}