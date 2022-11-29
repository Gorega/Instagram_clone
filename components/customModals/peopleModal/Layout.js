import styles from "../../../styles/components/CustomModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setCustomModal } from "../../../features/modalSlice";
import Person from "./person";

export default function Layout({title,people,type}){
    
    const dispatch = useDispatch();
    const {customModal} = useSelector((state)=> state.modal)

    return  customModal.type === type
            &&
            <div className={styles.people}>
                <div className={styles.head}>
                    <h2>{title}</h2>
                    <FontAwesomeIcon icon={faTimes} onClick={()=> dispatch(setCustomModal({status:false}))} />
                </div>
                <div className={styles.content}>
                    {people?.map((person,index)=>{
                        return <Person key={index} person={person} type={type} />
                    })}
                </div>
            </div>
}