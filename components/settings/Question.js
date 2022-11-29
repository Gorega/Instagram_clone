import styles from "../../styles/components/settings/Question.module.css";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Question(props){
    const [showBody,setShowBody] = useState(false);

    return <div className={styles.question}>
        <div className={styles.head} onClick={()=> setShowBody(!showBody)}>
            <h3>{props.question}</h3>
            <span><FontAwesomeIcon icon={showBody ? faCaretDown : faCaretRight} /></span>
        </div>
        {showBody && <div className={styles.body}>
            <ul>
                {props.content.map((question,index)=>{
                    return <li key={index}>- {question.title}</li>
                })}
            </ul>
        </div>}
    </div>
}