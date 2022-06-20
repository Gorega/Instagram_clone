import styles from "../styles/components/PeopleCard.module.css";
import CardHolder from "../components/CardHolder";

export default function PeopleCard(){
    const spinnerArray = [...Array(10)]
    return <CardHolder>
        <div className={styles.list}>
            {spinnerArray.map((_,index)=>{
                return <div key={index} className={styles.person}>
                    <div className={styles.img}></div>
                </div>
            })}
        </div>
    </CardHolder>
}