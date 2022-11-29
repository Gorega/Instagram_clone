import styles from "../../styles/components/profile/Foot.module.css";

export default function Foot(){
    return <div className={styles.foot}>
        <div className={styles.body}>
        <ul>
            <li>Meta</li>
            <li>About</li>
            <li>Blog</li>
            <li>Job</li>
            <li>Help</li>
            <li>API</li>
            <li>Privacy</li>
            <li>Terms</li>
            <li>Top Accounts</li>
            <li>Hashtags</li>
            <li>Locations</li>
            <li>Instagram Lite</li>
        </ul>

        <span>@ 2022 Instagram from Gorega</span>
        </div>
    </div>
}