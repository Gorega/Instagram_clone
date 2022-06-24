import auth from "../api/auth/auth";

export default function Conversation(){
    return;
}

export const getServerSideProps = auth(async()=>{
    return{
        redirect:{
            destination:"/direct/inbox",
            premenant:false
        },
        props:{}
    }
});