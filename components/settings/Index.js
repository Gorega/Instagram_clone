import { useSelector } from "react-redux";
import {list} from "./SideNavigator";
import SideNavigator from "./SideNavigator";
import CardHolder from "../CardHolder";
import Foot from "../profile/Foot";

export default function Index(){

    const {activeSettingsList} = useSelector((state)=> state.navigatorList)
    
    return <div className="container">
            <CardHolder style={{width:"100%",height:"100%",padding:"0"}}>
                <div style={{display:"flex"}}>
                    <SideNavigator />
                    {list[activeSettingsList].content}
                </div>    
            </CardHolder>
            <Foot />
    </div>
}