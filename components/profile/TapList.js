import styles from "../../styles/components/profile/NavigatorList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {setActiveProfileList} from "../../features/navigatorListSlice";
import { useSession } from "next-auth/react";
import ListArray from "./ListArray";

export default function TapList(){
    const dispatch = useDispatch();
    const {data:user} = useSession();
    const {activeProfileList,spinner} = useSelector((state)=>state.navigatorList);
    const {list} = ListArray()

    if(!spinner){
        return <div className={styles.list}>
          <ul>
            {location.pathname.includes(user.userId) ?
            list.map((li,index)=>{
              return <li key={index} className={activeProfileList === index && styles.active} onClick={()=> {
                dispatch(setActiveProfileList(index))
                window.history.pushState(null,null,li.url)
              }}>
                <FontAwesomeIcon icon={li.icon} /> {li.title}
                </li>
              })
              
              :

              <>
              <li className={activeProfileList === 0 && styles.active} onClick={()=> {
                  dispatch(setActiveProfileList(0))
                  window.history.pushState(null,null,list[0].url)
              }}>
              <FontAwesomeIcon icon={list[0].icon} /> {list[0].title}
              </li>

              <li className={activeProfileList === 1 && styles.active} onClick={()=> {
                  dispatch(setActiveProfileList(1))
                  window.history.pushState(null,null,list[1].url)
              }}>
              <FontAwesomeIcon icon={list[1].icon} /> {list[1].title}
              </li>

              <li className={activeProfileList === 3 && styles.active} onClick={()=> {
                  dispatch(setActiveProfileList(3))
                  window.history.pushState(null,null,list[3].url)
              }}>
              <FontAwesomeIcon icon={list[3].icon} /> {list[3].title}
              </li>

              </>
              }
          </ul>
    </div>
    }
}