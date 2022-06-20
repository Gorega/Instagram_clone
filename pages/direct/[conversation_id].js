
export default function Conversation(){
    return;
}

export async function getServerSideProps({context}){
    return{
        redirect:{
            destination:"/direct/inbox",
            premenant:false
        }
    }
}