import styles from "../../styles/components/settings/SideNavigator.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSettingsList } from "../../features/navigatorListSlice";
import ChangePass from "./ChangePass";
import EditProfile from "./EditProfile";
import Help from "./Help";
import Privacy from "./Privacy";
import RemoveTemporary from "./RemoveTemporary";

export const list = [{
    title:"Edit Profile",
    content:<EditProfile />,
    url:"/accounts/edit/"
},{
    title:"Change Password",
    content:<ChangePass />,
    url:"/accounts/password/change/"
},{
    title:"Privacy and Security",
    content:<Privacy />,
    url:"/accounts/privacy_and_security/"
},{
    title:"Help",
    content:<Help />,
    url:"/accounts/help/"
},{
    title:"Temporarily Deactivate Your Account",
    content:<RemoveTemporary />,
    url:"/accounts/remove/request/temporary/"
}]

export default function SideNavigator(){
    const dispatch = useDispatch();
    const {activeSettingsList} = useSelector((state)=> state.navigatorList);
    return <div className={styles.list}>
        <ul>
            {list.map((li,index)=>{
                return <li key={index} className={activeSettingsList === index && styles.active} onClick={()=> {
                    dispatch(setActiveSettingsList(index))
                    history.pushState(null,null,li.url)
                }}>{li.title}</li>
            })}
        </ul>
    </div>

}