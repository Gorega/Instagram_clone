import {initFirebase} from "../../lib/initFirebase";
import { getStorage, ref,deleteObject, uploadBytesResumable, getDownloadURL, getMetadata } from "firebase/storage";
import { useDispatch } from "react-redux";
import { setCurrentFile } from "../../features/addPostSlice";
import styles from "../../styles/components/post/Preview.module.css";
import { useContext } from "react";
import {AppContext} from "../../contextApi";

export default function Preview(){
    const dispatch = useDispatch();
    const {uploadedFiles,setUploadedFiles} = useContext(AppContext);

    const uploadFile = (e)=>{
        const storage = getStorage();
        const file = e.target.files[0];
        // Create the file metadata
        const metadata = {
            contentType: file?.type.includes("image") ? 'image/jpeg' : file?.type.includes("videos") ? `video/mb4` : null};
            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, 'posts/' + file?.name);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                }
            }, 
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;
    
                // ...
    
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
            }, 
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // get file contentType
                    getMetadata(storageRef).then((metadata)=>{
                        setUploadedFiles(prevState => [...prevState,{backdrop:downloadURL,contentType:metadata.contentType,name:metadata.name}])
                    })
                });
            }
            );
    }

    const deleteFileFromFirebase=(fileName)=>{
        const storage = getStorage();
        const desertRef = ref(storage, `posts/${fileName}`);
        deleteObject(desertRef).then(() => {
            console.log("deleted")
        }).catch((error) => {
            console.log(error)
        });
    }

    return <div className={styles.postersPreview}>
        <div className={styles.posters}>
            {uploadedFiles?.map((poster,index)=>{
                return <div key={index} className={styles.poster} onClick={()=> dispatch(setCurrentFile(index))}>
                    <div className={styles.delete} onClick={()=>{
                        deleteFileFromFirebase(poster.name)
                        setUploadedFiles((prevState)=>{
                            return prevState.filter((file)=> {
                                return file.backdrop !== poster.backdrop
                            });
                        })
                    }}>x</div>
                    {poster?.contentType.includes("image") && <img src={poster.backdrop} alt="" />}
                    {poster?.contentType.includes("video") && <video controls src={poster.backdrop} alt="" />} 
                </div>
            })}

            <div className={styles.add}>
                <label htmlFor="file">+</label>
                <input id="file" type="file" style={{display:"none"}} onChange={uploadFile} />
            </div>
        </div>
    </div>
}