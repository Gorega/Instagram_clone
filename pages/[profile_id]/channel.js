import SavedPosts from "../../components/profile/Index";
import Navbar from "../../components/navbar/Main";

export default function Channel(){
    const data = [];
    return <>
        <Navbar />
        <SavedPosts content={data} />
    </>
}