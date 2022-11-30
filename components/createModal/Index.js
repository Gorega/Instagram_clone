import styles from "../../styles/components/createModal/Index.module.css";
import axios from "axios";
import {server} from "../../lib/server";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { clearUploadedFiles, setCaptionValue, setUploadedFiles } from "../../features/createModalSlice";
import {setAddPostModal, setEditPostModal} from "../../features/modalSlice";
import { setUpdatePosts } from "../../features/post";
import ModalHolder from "../ModalHolder";
import Upload from "./Upload";
import Caption from "./Caption";
import useUpload from "../../lib/useUpload";

export default function Index(props){
    const {createPost,editPost} = props;
    const dispatch = useDispatch();
    const {uploadFile,downloadedURL,deleteFileFromFirebase} = useUpload();
    const {editPostModal} = useSelector((state)=> state.modal);
    const {uploadedFiles,captionValue} = useSelector((state)=> state.createModal)
    const [loading,setLoading] = useState(false);
    const [location,setLocation] = useState("");

    const submitHandler = async (method,uri,params)=>{
        setLoading(true)
        dispatch(setUpdatePosts("pending"));
        await axios[method](uri,params,{withCredentials:true})
        .then(_ => {
            dispatch(setAddPostModal({status:false}));
            dispatch(setEditPostModal({status:false}));
            dispatch(setUpdatePosts("done"));
            dispatch(clearUploadedFiles([]));
            setLoading(false);
        })
        .catch(err => {
            setLoading(false)
        });
    }

    const sharePostHandler = ()=>{
        submitHandler(
            "post",
            `${server}/api/post/add`,
            {poster:[...uploadedFiles],caption:captionValue,location:location}
        )
    }

    const editPostHandler = ()=>{
        submitHandler(
            "patch",
            `${server}/api/post/${editPostModal.postId}`,
            {poster:[...uploadedFiles],caption:captionValue,location:location}
        )
        deleteFileFromFirebase("posts",editPostModal.content?.poster?.name);
    }
    
    useEffect(()=>{
        if(downloadedURL?.image){
            dispatch(setUploadedFiles(({backdrop:downloadedURL.image,contentType:downloadedURL.contentType,name:downloadedURL.name})))
        }
    },[downloadedURL])

    return <>
        <ModalHolder showCloseButton={true}>
            <div className={styles.header} style={{justifyContent:uploadedFiles.length <= 0 && "center"}}>
                {uploadedFiles?.length > 0 && <div className={styles.return} onClick={()=> dispatch(clearUploadedFiles([]))}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>}
                <h2>Create new post</h2>
                {(uploadedFiles?.length > 0 && createPost && <span onClick={sharePostHandler}>Share</span>)}
                {(uploadedFiles?.length > 0 && editPost && <span onClick={editPostHandler}>Edit</span>)}
            </div>
            {uploadedFiles.length <= 0 && <div className={styles.content}>
                <Upload
                    uploadFile={(e)=> uploadFile(e,"posts/")}
                    uploadedFiles={uploadedFiles}
                    loading={loading}
                 />
            </div>}
            {uploadedFiles.length > 0 && <div className={styles.content}>
                <div className={styles.sec}>
                    <Upload
                        uploadedFiles={uploadedFiles}
                    />
                </div>
                <div className={styles.sec}>
                    <Caption
                        caption={captionValue}
                        setCaption={(e)=>dispatch(setCaptionValue(e.target.value))}
                        location={location}
                        setLocation={(e)=>setLocation(e.target.value)}   
                    />
                </div>
            </div>}
        </ModalHolder>
    </>
}