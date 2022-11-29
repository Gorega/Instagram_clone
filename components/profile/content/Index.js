import { useSelector } from "react-redux";
import styles from "../../../styles/components/profile/Content.module.css";
import Data from "./Data";

export default function Content(props){

    const {spinner} = useSelector((state)=> state.navigatorList);

    return <div className={styles.content}>
            {props.saved &&  <div className={styles.head}>
                <span>Only you can see what you have saved</span>
                <button>+ New Collection</button>
            </div>}
        
           <div className={styles.posts}>
                <div className={`${props.content.length <= 0 ? styles.block : styles.grid}`}>
                        {props.content.length > 0 ? props.content.map((post,index)=>{
                            return <Data key={index} {...post} /> })
                        :
                        !spinner && <div className={styles.empty}>No Content</div> }    
                </div>
           </div>
    </div>

}