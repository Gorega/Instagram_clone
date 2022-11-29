import styles from "../../styles/components/settings/EditProfile.module.css";
import axios from "axios";
import {server} from "../../lib/server";
import {useSession} from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { setActiveSettingsList } from "../../features/navigatorListSlice";
import ModalHolder from "../ModalHolder";
import useUpload from "../../lib/useUpload";

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
    const {loading:imageSpinner,uploadFile,downloadedURL,deleteFileFromFirebase,deletedURL} = useUpload();
    const [showChangeProfilePhotoModal,setShowChangeProfilePhotoModal] = useState(false);
    const defaultProfileImage = "https://firebasestorage.googleapis.com/v0/b/instagram-clone-a6598.appspot.com/o/profile%2Fdefault.jpeg?alt=media&token=58a03f2d-ebc8-4194-b036-3329eaa12d0e"

    const UpdateUserInfo = async (e)=>{
        e.preventDefault();
        const response = await axios.patch(`${server}/api/settings/edit`,{name,username,website,bio,email,phone,gender},{withCredentials:true});
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

    useEffect(()=>{
        if(downloadedURL?.image){
            setShowChangeProfilePhotoModal(false);
            setImage(downloadedURL.image)
            axios.patch(`${server}/api/settings/edit`,{image:downloadedURL.image},{withCredentials:true});
        }
    },[downloadedURL])

    useEffect(()=>{
        if(deletedURL?.status){
            setShowChangeProfilePhotoModal(false);
            setImage(defaultProfileImage)
            axios.patch(`${server}/api/settings/edit`,{image:defaultProfileImage},{withCredentials:true});
        }
    },[deletedURL])

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
                        <input id="image" type="file" style={{display:"none"}} onChange={(e)=> uploadFile(e,"profile/")} />
                        <label htmlFor="image" >Change Profile Photo</label>
                    </li>
                    <li onClick={()=> deleteFileFromFirebase("profile",downloadedURL.name)}>Remove current photo</li>
                    <li onClick={()=> setShowChangeProfilePhotoModal(false)}>Cancel</li>
                </ul>
            </div>    
        </ModalHolder>}
    </>
}