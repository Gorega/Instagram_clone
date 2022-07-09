import styles from "../../styles/components/post/Index.module.css";
import ModalHolder from "../ModalHolder";
import Upload from "./Upload";
import Caption from "./Caption";
import axios from "axios";
import {server} from "../../lib/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setCaptionValue, setDoneUpload } from "../../features/addPostSlice";
import {setAddPostModal, setEditPostModal} from "../../features/modalSlice";
import { useState } from "react";
import { setUpdatePosts } from "../../features/post";
import { useContext } from "react";
import { AppContext } from "../../contextApi";

export default function Index(props){
    const dispatch = useDispatch();
    const {uploadedFiles,setUploadedFiles} = useContext(AppContext);
    const [loading,setLoading] = useState(false);
    const [location,setLocation] = useState("");
    const {editPostModal} = useSelector((state)=> state.modal);
    const {doneUpload,captionValue} = useSelector((state)=> state.addPost)

    const sharePostHandler = ()=>{
        setLoading(true)
        dispatch(setUpdatePosts("pending"));
        axios.post(`${server}/api/post/add`,{poster:[...uploadedFiles],caption:captionValue,location:location},{withCredentials:true})
        .then(res => {
            dispatch(setAddPostModal({status:false}))
            dispatch(setDoneUpload(false));
            dispatch(setUpdatePosts("done"));
            setUploadedFiles([]);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false)
        });
    }

    const editPostHandler = ()=>{
        setLoading(true)
        dispatch(setUpdatePosts("pending"));
        axios.patch(`${server}/api/post/${editPostModal.postId}`,{poster:[...uploadedFiles],caption:captionValue,location:location},{withCredentials:true})
        .then(res => {
            dispatch(setEditPostModal({status:false}))
            dispatch(setDoneUpload(false));
            dispatch(setUpdatePosts("done"));
            setUploadedFiles([]);
            setLoading(false);
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
                    {(doneUpload && props.createPost && <span onClick={sharePostHandler}>Share</span>)}
                    {(doneUpload && props.editPost && <span onClick={editPostHandler}>Edit</span>)}
                </div>
                {!doneUpload && <div className={styles.content}>
                    <Upload />
                </div>}
                {doneUpload && <div className={styles.content}>
                    <div className={styles.sec}>
                        <Upload editPost={props.editPost} createPost={props.createPost} backdrop={props.backdrop} />
                    </div>
                    <div className={styles.sec}>
                        <Caption caption={captionValue}
                                setCaption={(e)=>dispatch(setCaptionValue(e.target.value))}
                                location={location}
                                setLocation={(e)=>setLocation(e.target.value)}   
                                />
                    </div>
                </div>}
    </ModalHolder>
    </>
}