import styles from "../../styles/components/createModal/Caption.module.css";
import {useSession} from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setShowPostersPreview } from "../../features/createModalSlice";
import Preview from "./Preview";

export default function Caption(props){
    const {data:user} = useSession();
    const dispatch = useDispatch();
    const {showPostersPreview} = useSelector((state)=> state.createModal);

    return <>
    <div className={styles.main}>
        <div className={styles.head}>
            <img src={user.user.image} alt="" />
            <h2>{user.username}</h2>
        </div>
        <div className={styles.caption}>
            <textarea placeholder="Write a caption..." defaultValue={props.caption} onChange={props.setCaption}></textarea>
            <div className={styles.counter}>
                {props.caption?.length}/2,200
            </div>
            <div className={styles.smile}>
                <svg aria-label="Emoji" color="#8e8e8e" fill="#8e8e8e" height="20" role="img" viewBox="0 0 24 24" width="20"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path></svg>
            </div>
        </div>
        <div className={styles.options}>
            <ul>
                <li>
                    <input type="text" placeholder="Add Location" value={props.location} onChange={props.setLocation} />
                        <svg aria-label="Add location" color="#8e8e8e" fill="#8e8e8e" height="16" role="img" viewBox="0 0 24 24" width="16"><path d="M12.053 8.105a1.604 1.604 0 101.604 1.604 1.604 1.604 0 00-1.604-1.604zm0-7.105a8.684 8.684 0 00-8.708 8.66c0 5.699 6.14 11.495 8.108 13.123a.939.939 0 001.2 0c1.969-1.628 8.109-7.424 8.109-13.123A8.684 8.684 0 0012.053 1zm0 19.662C9.29 18.198 5.345 13.645 5.345 9.66a6.709 6.709 0 0113.417 0c0 3.985-3.944 8.538-6.709 11.002z"></path></svg>
                </li>
                <li onClick={()=> dispatch(setShowPostersPreview(!showPostersPreview))}>
                    <svg aria-label="Open media gallery" color="#ffffff" fill="#ffffff" height="16" role="img" viewBox="0 0 24 24" width="16"><path d="M19 15V5a4.004 4.004 0 00-4-4H5a4.004 4.004 0 00-4 4v10a4.004 4.004 0 004 4h10a4.004 4.004 0 004-4zM3 15V5a2.002 2.002 0 012-2h10a2.002 2.002 0 012 2v10a2.002 2.002 0 01-2 2H5a2.002 2.002 0 01-2-2zm18.862-8.773A.501.501 0 0021 6.57v8.431a6 6 0 01-6 6H6.58a.504.504 0 00-.35.863A3.944 3.944 0 009 23h6a8 8 0 008-8V9a3.95 3.95 0 00-1.138-2.773z" fillRule="evenodd"></path></svg>
                </li>
            </ul>
        </div>
        {showPostersPreview
        &&
        <Preview />}
    </div>
    </>
}