import styles from "../styles/components/ModalHolder.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setAddPostModal, setEditPostModal, setShowPostModal } from "../features/modalSlice";
import { useEffect, useRef } from "react";
import { setPeopleModal } from "../features/messengerSlice";

export default function ModalHolder(props){
    const dispatch = useDispatch();
    const modalRef = useRef();
    const {showPostModal,addPostModal,editPostModal} = useSelector((state)=> state.modal)

    const closeModalHanlder = ()=>{
        if(showPostModal){
            dispatch(setShowPostModal(false))
            dispatch(setPeopleModal(false));
            history.replaceState(null,null,props.onClose)
        }
        if(addPostModal.status || editPostModal.status){
            dispatch(setShowPostModal(false));
            const confirm = window.confirm("Changes you made will not be saved.");
            if(confirm){
                dispatch(setAddPostModal({status:false}))
                dispatch(setEditPostModal({status:false}))
            }
        }
    }
    

    // useEffect(()=>{
    //     const listener = document.addEventListener("mouseup",(e)=>{
    //         if(modalRef.current || modalRef.current.contains(e.target)){
    //             dispatch(setShowPostOptionsModal(false));
    //             dispatch(setShowAddPostModal(false));
    //             dispatch(setShowPostModal(false));
    //         }
    //       })
    //       return()=>{
    //           document.removeEventListener("mouseup",listener);
    //       }
    // },[showPostModal,showPostOptionsModal,showAddPostModal])

    return <div className={styles.modal} style={{backgroundColor:props.opacity}} ref={modalRef}>
        <div className={styles.body} style={props.style}>
            {props.showCloseButton && <div className={styles.close} onClick={closeModalHanlder}>
            <FontAwesomeIcon icon={faTimes} />
            </div>}
            {props.children}
        </div>
    </div>
}