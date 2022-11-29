import {initFirebase} from "./initFirebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, getMetadata,deleteObject } from "firebase/storage";
import { useState } from "react";

export default function useUpload(){
    const [loading,setLoading] = useState(false);
    const [downloadedURL,setDownloadedURL] = useState({image:""});
    const [deletedURL,setDeletedURL] = useState({status:null})

    const uploadFile = (e,dest)=>{
        const storage = getStorage();
        const file = e.target.files[0];
        // Create the file metadata
        const metadata = {
            contentType: file?.type.includes("image") ? 'image/jpeg' : "video/mb4"
            };
            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, dest + file?.name + Date.now());
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                case 'paused':
                    break;
                case 'running':
                    setLoading(true)
                    break;
                }
            }, 
            (error) => {
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
                    setLoading(false);
                    // get file contentType
                    getMetadata(storageRef).then((metadata)=>{
                        setDownloadedURL({image:downloadURL,contentType:metadata.contentType,name:metadata.name})
                    })
                });
            }
            );
    }

    const deleteFileFromFirebase=(dest,fileName)=>{
        const storage = getStorage();
        const desertRef = ref(storage, `${dest}/${fileName}`);
        setDeletedURL({status:"fulfilled"})
        deleteObject(desertRef).then(() => {
            // successfully deleted handler
        }).catch((error) => {
            // error handler
        });
    }

    return {downloadedURL,uploadFile,deleteFileFromFirebase,loading,deletedURL}
}