import styles from "../../styles/components/createModal/Preview.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setCurrentIndex,removeFromUploadedFiles, setUploadedFiles} from "../../features/createModalSlice";
import useUpload from "../../lib/useUpload";

export default function Preview(){
    const dispatch = useDispatch();
    const {uploadFile,downloadedURL} = useUpload();
    const {uploadedFiles} = useSelector((state)=> state.createModal);

    useEffect(()=>{
        if(downloadedURL?.image){
            dispatch(setUploadedFiles(({backdrop:downloadedURL.image,contentType:downloadedURL.contentType,name:downloadedURL.name})))
        }
    },[downloadedURL])

    return <div className={styles.postersPreview}>
        <div className={styles.posters}>
            {uploadedFiles?.map((poster,index)=>{
                return <div key={index} className={styles.poster} onClick={()=> dispatch(setCurrentIndex(index))}>
                    <div className={styles.delete} onClick={()=>{
                        dispatch(removeFromUploadedFiles(poster.backdrop));
                    }}>x</div>
                    {poster?.contentType?.includes("image") && <img src={poster.backdrop} alt="" />}
                    {poster?.contentType?.includes("video") && <video controls src={poster.backdrop} alt="" />} 
                </div>
            })}

            <div className={styles.add}>
                <label htmlFor="file">+</label>
                <input id="file" type="file" style={{display:"none"}} onChange={(e)=> uploadFile(e,"posts/")} />
            </div>
        </div>
    </div>
}