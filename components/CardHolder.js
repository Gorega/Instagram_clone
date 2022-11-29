import styles from "../styles/components/CardHolder.module.css";

export default function Card(props){
    return <div className={`${styles.cardHolder} ${props.preLoginFormClassName}`} style={props.style}>
            <div className={styles.body}>
                {props.children}
            </div>
        </div>
}