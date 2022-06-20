import styles from "../../styles/components/profile/Content.module.css";
import Data from "./Data";

export default function Content(props){

    return <div className={styles.content}>
            {props.saved &&  <div className={styles.head}>
                <span>Only you can see what you have saved</span>
                <button>+ New Collection</button>
            </div>}
        
           <div className={styles.posts}>
                <div className={styles.grid}>
                        {props.content?.map((post,index)=>{
                                return <Data key={index} {...post} />
                            })}    
                </div>
           </div>
    </div>

}