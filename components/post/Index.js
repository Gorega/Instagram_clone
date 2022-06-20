import styles from "../../styles/components/post/Index.module.css";
import ModalHolder from "../ModalHolder";
import Upload from "./Upload";
import Caption from "./Caption";
import axios from "axios";
import {server} from "../../lib/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setDoneUpload } from "../../features/addPostSlice";
import {setShowAddPostModal} from "../../features/modalSlice";
import { useState } from "react";
import { setUpdatePosts } from "../../features/post";

export default function Index(){
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);
    const [captionValue,setCaptionValue] = useState("");
    const [location,setLocation] = useState(null);
    const {doneUpload,uploadedFile} = useSelector((state)=> state.addPost)

    const sharePost = ()=>{
        setLoading(true)
        dispatch(setUpdatePosts("pending"));
        axios.post(`${server}/api/post/add`,{posters:[uploadedFile[0]],caption:captionValue,location:location},{withCredentials:true})
        .then(res => {
            dispatch(setShowAddPostModal(false))
            dispatch(setUpdatePosts("done"));
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
        });
    }
    return <>
        {loading && <div className={styles.spinner}> <FontAwesomeIcon className="fa-spin" icon={faSpinner} /> </div>}
        <ModalHolder showCloseButton={true}>
                 <div className={styles.header} style={{justifyContent:!doneUpload && "center"}}>
                    {doneUpload && <div className={styles.return} onClick={()=> dispatch(setDoneUpload(false))}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>}
                    <h2>Create new post</h2>
                    {doneUpload && <span onClick={sharePost}>Share</span>}
                </div>
                {!doneUpload && <div className={styles.content}>
                    <Upload />
                </div>}
                {doneUpload && <div className={styles.content}>
                    <div className={styles.sec}>
                        <Upload />
                    </div>
                    <div className={styles.sec}>
                        <Caption caption={captionValue}
                                setCaption={(e)=>setCaptionValue(e.target.value)}
                                location={location}
                                setLocation={(e)=>setLocation(e.target.value)}
                                />
                    </div>
                </div>}
    </ModalHolder>
    </>
}