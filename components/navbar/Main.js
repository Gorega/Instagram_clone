import styles from "../../styles/components/navbar/Main.module.css";
import axios from "axios";
import {server} from "../../lib/server";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useState,useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddPostModal } from "../../features/modalSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { setMessengerPatch } from "../../features/messengerSlice";
import { AppContext } from "../../contextApi";
import Link from "next/link"
import SearchSugg from "./SearchSugg";
import UserMenu from "./UserMenu";
import logo from "../../public/logo.png";
import CreateModal from "../../components/createModal/Index";

export default function Main(){
    const dispatch = useDispatch();
    const router = useRouter();
    const userRef = useRef();
    const navbarRef = useRef();
    const searchBarRef = useRef();
    const {data:user,status} = useSession();
    const {socket} = useContext(AppContext);
    const [searchBarSpinner,setSearchBarSpinner] = useState(false);
    const [showSearchSugg,setShowSearchSugg] = useState(false);
    const [showUserMenu,setShowUserMenu] = useState(false);
    const [searchValue,setSearchValue] = useState(null);
    const {addPostModal} = useSelector((state)=> state.modal)
    const {messengerPatch} = useSelector((state)=> state.messenger)

    // list icons
    const [homeIcon,setHomeIcon] = useState(<svg ariaLabel="Home" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>)
    const [messengerIcon,setMessengerIcon] = useState(<svg ariaLabel="Messenger" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 2.001a9.705 9.705 0 110 19.4 10.876 10.876 0 01-2.895-.384.798.798 0 00-.533.04l-1.984.876a.801.801 0 01-1.123-.708l-.054-1.78a.806.806 0 00-.27-.569 9.49 9.49 0 01-3.14-7.175 9.65 9.65 0 0110-9.7z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.739"></path><path d="M17.79 10.132a.659.659 0 00-.962-.873l-2.556 2.05a.63.63 0 01-.758.002L11.06 9.47a1.576 1.576 0 00-2.277.42l-2.567 3.98a.659.659 0 00.961.875l2.556-2.049a.63.63 0 01.759-.002l2.452 1.84a1.576 1.576 0 002.278-.42z" fillRule="evenodd"></path></svg>)
    const [newPostIcon,setNewPostIcon] = useState(<svg ariaLabel="New Post" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>)
    const [activityFeedIcon,setActivityFeedIcon] = useState(<svg ariaLabel="Activity Feed" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg>)

    // set active class on active list
    useEffect(()=>{
        if(router.pathname === "/"){
            setHomeIcon(<svg ariaLabel="Home" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 01.31.724V22a1 1 0 01-1 1z"></path></svg>)
        }
        if(router.pathname.includes("/direct")){
            setMessengerIcon(<svg ariaLabel="Messenger" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 1.131a10.487 10.487 0 00-10.87 10.57 10.194 10.194 0 003.412 7.771l.054 1.78a1.67 1.67 0 002.342 1.476l1.935-.872a11.767 11.767 0 003.127.416 10.488 10.488 0 0010.87-10.57 10.487 10.487 0 00-10.87-10.57zm5.786 9.001l-2.566 3.983a1.577 1.577 0 01-2.278.42l-2.452-1.84a.63.63 0 00-.759.002l-2.556 2.049a.659.659 0 01-.96-.874L8.783 9.89a1.576 1.576 0 012.277-.42l2.453 1.84a.63.63 0 00.758-.003l2.556-2.05a.659.659 0 01.961.874z"></path></svg>)
        }

        if(addPostModal.status){
            setHomeIcon(<svg ariaLabel="Home" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>)
            setMessengerIcon(<svg ariaLabel="Messenger" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 2.001a9.705 9.705 0 110 19.4 10.876 10.876 0 01-2.895-.384.798.798 0 00-.533.04l-1.984.876a.801.801 0 01-1.123-.708l-.054-1.78a.806.806 0 00-.27-.569 9.49 9.49 0 01-3.14-7.175 9.65 9.65 0 0110-9.7z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.739"></path><path d="M17.79 10.132a.659.659 0 00-.962-.873l-2.556 2.05a.63.63 0 01-.758.002L11.06 9.47a1.576 1.576 0 00-2.277.42l-2.567 3.98a.659.659 0 00.961.875l2.556-2.049a.63.63 0 01.759-.002l2.452 1.84a1.576 1.576 0 002.278-.42z" fillRule="evenodd"></path></svg>)
            setNewPostIcon(<svg ariaLabel="New post" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 5.545l-.117.006-.112.02a1 1 0 00-.764.857l-.007.117V11H6.544l-.116.007a1 1 0 00-.877.876L5.545 12l.007.117a1 1 0 00.877.876l.116.007h4.457l.001 4.454.007.116a1 1 0 00.876.877l.117.007.117-.007a1 1 0 00.876-.877l.007-.116V13h4.452l.116-.007a1 1 0 00.877-.876l.007-.117-.007-.117a1 1 0 00-.877-.876L17.455 11h-4.453l.001-4.455-.007-.117a1 1 0 00-.876-.877zM8.552.999h6.896c2.754 0 4.285.579 5.664 1.912 1.255 1.297 1.838 2.758 1.885 5.302L23 8.55v6.898c0 2.755-.578 4.286-1.912 5.664-1.298 1.255-2.759 1.838-5.302 1.885l-.338.003H8.552c-2.754 0-4.285-.579-5.664-1.912-1.255-1.297-1.839-2.758-1.885-5.302L1 15.45V8.551c0-2.754.579-4.286 1.912-5.664C4.21 1.633 5.67 1.05 8.214 1.002L8.552 1z"></path></svg>)
        }else{
            setNewPostIcon(<svg ariaLabel="New Post" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>)
        }
    },[router,addPostModal.status])

    useEffect(()=>{
        const listener = document.addEventListener("mouseup",(e)=>{
          if(!searchBarRef.current || !searchBarRef.current.contains(e.target)){
              setShowSearchSugg(false)
              setSearchBarSpinner(false)
          }
          if(!userRef.current || !userRef.current.contains(e.target)){
            setShowUserMenu(false)
          }
        })

        // fix z-index on userMenu open
        if(showUserMenu){
            navbarRef.current.style.zIndex = 13
        }else{
            navbarRef.current.style.zIndex = 10
        }
        
        return()=>{
            document.removeEventListener("mouseup",listener);
        }
    },[showSearchSugg,showUserMenu])

    useEffect(()=>{
        socket?.current?.on("getMessengerPatch",(data)=>{
            if(data.receiverId === user.userId){
                dispatch(setMessengerPatch(true))
            }
        })
    },[socket.current])

    const isUnviewedConversationExist = async ()=>{
        if(status === "authenticated"){
            const response = await axios.get(`${server}/api/user/${user.userId}/conversation/viewed`,{withCredentials:true});
            const data = await response.data;
            if(data){
                dispatch(setMessengerPatch(false))
            }else{
                dispatch(setMessengerPatch(true));
            }
        }
    }

    useEffect(()=>{
        isUnviewedConversationExist();
    },[user])

    return <>
        <div className={styles.main} ref={navbarRef}>
        <div className="container">
            <div className={styles.body}>
                <div className={styles.logo}>
                    <Link href="/"><img src={logo.src} alt="" /></Link>
                </div>
                <div className={styles.searchBar} ref={searchBarRef}>
                    {showSearchSugg || <FontAwesomeIcon icon={faSearch} />}
                    <input type="text" placeholder="Search" value={searchValue} onChange={(e)=> setSearchValue(e.target.value)}  onClick={()=> setShowSearchSugg(true)} />
                    {searchBarSpinner && <div className={styles.spinner}><FontAwesomeIcon className="fa-spin" icon={faSpinner} /></div>}
                    {showSearchSugg && <SearchSugg setSearchBarSpinner={setSearchBarSpinner} username={searchValue} />}
                </div>
                <div className={styles.list}>
                    <ul>
                        <Link href="/"><li>{homeIcon}</li></Link>
                        <Link href="/direct/inbox"><li className={messengerPatch && styles.patch}>{messengerIcon}</li></Link>
                        <li onClick={()=> {
                            dispatch(setAddPostModal({status:true,content:null}));
                        }}>
                            {newPostIcon}
                        </li>
                        <li>{activityFeedIcon}</li>
                        <li onClick={()=> setShowUserMenu(true)} ref={userRef}>
                            <img src={user && user.user.image} style={{border:showUserMenu && "3px solid #d9d9d9"}} />
                            {showUserMenu && <UserMenu />}
                         </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    {addPostModal.status && <CreateModal createPost={true} />}
    </>

}