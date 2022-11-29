import styles from "../styles/components/StoriesCard.module.css";
import CardHolder from "./CardHolder";

export default function StoriesCard(){
    
    const spinnerArray = [...Array(10)]

    return <CardHolder style={{width:500}}>
        <div className={styles.list}>
            {spinnerArray.map((_,index)=>{
                return <div key={index} className={styles.person}>
                    <div className={styles.img}></div>
                </div>
            })}
        </div>
    </CardHolder>
}