import {initFirebase} from "../../lib/initFirebase";
import styles from "../../styles/components/settings/EditProfile.module.css";
import {useSession} from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import {server} from "../../lib/server";
import { getStorage, ref, uploadBytesResumable,deleteObject, getDownloadURL } from "firebase/storage";
import ModalHolder from "../ModalHolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { setActiveSettingsList } from "../../features/navigatorListSlice";
import { useDispatch } from "react-redux";

export default function EditProfile(){
    const dispatch = useDispatch();
    const {data:user} = useSession();
    const [name,setName] = useState(user?.user.name);
    const [username,setUsername] = useState(user?.username);
    const [website,setWebsite] = useState(user?.website);
    const [bio,setBio] = useState(user?.bio);
    const [email,setEmail] = useState(user?.user.email);
    const [phone,setPhone] = useState(user?.phone);
    const [gender,setGender] = useState(user?.gender);
    const [image,setImage] = useState(user?.image);
    const [imageName,setImageName] = useState(null);
    const [imageSpinner,setImageSpinner] = useState(false);
    const [showChangeProfilePhotoModal,setShowChangeProfilePhotoModal] = useState(false);
    const defaultProfileImage = "https://firebasestorage.googleapis.com/v0/b/instagram-clone-a6598.appspot.com/o/profile%2Fdefault.jpeg?alt=media&token=58a03f2d-ebc8-4194-b036-3329eaa12d0e"

    const uploadImage = (e)=>{
            const storage = getStorage();
            const file = e.target.files[0];
            // Create the file metadata
            const metadata = {
                contentType: 'image/jpeg'
                };
                // Upload file and metadata to the object 'images/mountains.jpg'
                const storageRef = ref(storage, 'profile/' + file.name);
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
                        setShowChangeProfilePhotoModal(false);
                        setImageSpinner(true);
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
                        setImageSpinner(false)
                        setImage(downloadURL);
                        setImageName(file.name)
                        axios.patch(`${server}/api/settings/edit`,{image:downloadURL},{withCredentials:true});
                    });
                }
                );
    }

    const removeCurrentProfilePhotoHandler = async ()=>{
        setImage(defaultProfileImage);
        setShowChangeProfilePhotoModal(false);
        const response = await axios.patch(`${server}/api/settings/edit`,{image:defaultProfileImage},{withCredentials:true});
        // remove image from firebase
        const storage = getStorage();
        const desertRef = ref(storage, `profile/${imageName}`);
        deleteObject(desertRef).then(() => {
            console.log("deleted")
        }).catch((error) => {
            console.log(error)
        });
    }

    const UpdateUserInfo = async (e)=>{
        e.preventDefault();
        const response = await axios.patch(`${server}/api/settings/edit`,{name,username,website,bio,email,phone,gender},{withCredentials:true});
        const data = await response.data;
        console.log(data);
    }


    useEffect(()=>{
        setName(user?.user.name)
        setUsername(user?.username)
        setEmail(user?.user.email)
        setBio(user?.bio)
        setPhone(user?.phone)
        setGender(user?.gender)
        setWebsite(user?.website)
        setImage(user?.image)
    },[user])

    return <>
            <div className={styles.main}>
                <form onSubmit={UpdateUserInfo}>
                <div className={styles.head}>
                    {imageSpinner ? <div className={styles.imageSpinner}>
                        <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
                        <img src={image} alt="" />
                    </div> : <img src={image} alt="" />}
                    <div className={styles.user}>
                        <h3>{user?.username}</h3>
                        <p onClick={()=> setShowChangeProfilePhotoModal(true)}>Change Profile Photo</p>
                    </div>
                </div>
                    <div className={styles.field}>
                        <div className={styles.inputField}>
                            <label>Name</label>
                            <input type="text" value={name} onChange={(e)=> setName(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.inputField}>
                            <label>Username</label>
                            <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.inputField}>
                            <label>Website</label>
                            <input type="text" placeholder="website" value={website} onChange={(e)=> setWebsite(e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.inputField}>
                            <label>Bio</label>
                            <textarea value={bio} onChange={(e)=> setBio(e.target.value)}></textarea>
                        </div>
                    </div>

                    <div className={styles.fieldSeparate}>
                            <h4>Personal Information</h4>
                            <p>
                                Provide your personal information, even if the account is used for a business, a pet or something else. This will not be a part of your public profile.
                            </p>
                    </div>
                    
                    <div className={styles.field}>
                        <div className={styles.inputField}>
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.inputField}>
                            <label>Phone Number</label>
                            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e)=> setPhone(e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <div className={styles.inputField}>
                            <label>Gender</label>
                            <input type="text" value={gender} onChange={(e)=> setGender(e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.disable} onClick={()=>{
                        dispatch(setActiveSettingsList(4))
                        history.pushState(null,null,"/accounts/remove/request/temporary/")
                    }}>
                        Temporarily disable my account 
                    </div>
                    <button type="submit">Submit</button>
                </form>
        </div>
        {showChangeProfilePhotoModal && <ModalHolder style={{width:400,height:"fit-content",borderRadius:15,padding:0}}>
            <div className={styles.changePhotoModal}>
                <h2>Change profile photo</h2>
                <ul>
                    <li>
                        <input id="image" type="file" style={{display:"none"}} onChange={uploadImage} />
                        <label htmlFor="image" >Change Profile Photo</label>
                    </li>
                    <li onClick={removeCurrentProfilePhotoHandler}>Remove current photo</li>
                    <li onClick={()=> setShowChangeProfilePhotoModal(false)}>Cancel</li>
                </ul>
            </div>    
        </ModalHolder>}
    </>
}