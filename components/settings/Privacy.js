import styles from "../../styles/components/settings/Privacy.module.css";

export default function Privacy(){
    return <div className={styles.main}>
        <div className={styles.field}>
            <h2>Account Privacy</h2>
            <div className={styles.check}>
                <input type="checkbox" />
                <label>Private Account</label>
            </div>
            <p>When your account is private, only people you approve can see your photos and videos on Instagram. Your existing followers will not be affected.</p>
        </div>
        <div className={styles.field}>
            <h2>Activity Status</h2>
            <div className={styles.check}>
                <input type="checkbox" />
                <label>Show Activity Status</label>
            </div>
            <p>Allow accounts you follow and anyone you message to see when you were last active or are currently active on Instagram apps. When this is turned off, you will not be able to see the activity status of other accounts. <br/> You can continue to use our services if active status is off.</p>
        </div>
        <div className={styles.field}>
            <h2>Story Sharing</h2>
            <div className={styles.check}>
                <input type="checkbox" />
                <label>Allow Sharing</label>
            </div>
            <p>Let people share your story as messages</p>
        </div>
        <div className={styles.field}>
            <h2>Mentions</h2>
            <div className={styles.select}>
                <label>Allow @mentions From</label>
                <div className={styles.radio}>
                    <input name="mention" type="radio" /> Everyone
                </div>
                <div className={styles.radio}>
                    <input name="mention" type="radio" /> People You Follow
                </div>
                <div className={styles.radio}>
                    <input name="mention" type="radio" /> No One
                </div>
            </div>
            <p>Choose who can @mention you to link your account in their stories, comments, live videos, and captions. When people try to @mention you, they will see if you do not allow @mentions.</p>
        </div>
        <div className={styles.field}>
            <div className={styles.select}>
                <label>Allow Tags From</label>
                <div className={styles.radio}>
                    <input name="tags" type="radio" /> Everyone
                </div>
                <div className={styles.radio}>
                    <input name="tags" type="radio" /> People You Follow
                </div>
                <div className={styles.radio}>
                    <input name="tags" type="radio" /> No One
                </div>
            </div>
        </div>
    </div>
}