import Question from "./Question";
import styles from "../../styles/components/settings/Help.module.css";

export default function Help(){
    const privacyQuestions = [{
        title:"Account Privacy",
        link:""
    },{
        title:"Blocking Accounts",
        link:""
    },{
        title:"Removing Followers",
        link:""
    },{
        title:"Deleting Comments",
        link:""
    }]

    const supportQuestions = [{
        title:"Reports",
        link:""
    },{
        title:"Violations",
        link:""
    }]
    return <div className={styles.main}>
        <h2>Help</h2>
        <Question question="Help Center" content="" />
        <Question question="Privacy and Security Help" content={privacyQuestions} />
        <Question question="Support Requests" content={supportQuestions}  />
    </div>

}