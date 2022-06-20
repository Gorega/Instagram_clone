import ProfilePage from "../../components/profile/Index";
import Navbar from "../../components/navbar/Main";

export default function Profile(){

    return <>
        <Navbar />
        <ProfilePage />
    </>
}

// export const getServerSideProps = auth( async(context)=>{
//         const {profile_id} = context.params;
//         const response = await axios.get(`${server}/api/user/${profile_id}`,{withCredentials:true});
//         const data = await response.data[0];
//         const totalFollowersResponse = await axios.get(`${server}/api/user/${profile_id}/follower/total_counts`,{withCredentials:true});
//         const totalFollowersData = await totalFollowersResponse.data.total;
//         const totalFollowingResponse = await axios.get(`${server}/api/user/${profile_id}/following/total_counts`,{withCredentials:true});
//         const totalFollowingData = await totalFollowingResponse.data.total;
        
//     return{
//         props:{
//             profile:data,
//             totalFollowers:totalFollowersData,
//             totalFollowing:totalFollowingData,
//         }
//     }
// });