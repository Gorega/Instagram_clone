import {getSession} from "next-auth/react";

export default function auth(getServerSideProps){
    return async (context) => {
        const session = await getSession(context)
        if(!session){
            return{
                redirect:{
                    destination:"/login",
                    permanent:false
                }
            }
        }
        return await getServerSideProps(context);
    }
}