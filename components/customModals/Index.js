import ModalHolder from "../ModalHolder";
import PostOptionsList from "./PostOptionsList";
import CommentOptionsList from "./CommentOptionsList";
import PeopleLikes from "./PeopleLikes";
import Followers from "./Followers";
import Following from "./Following";
import { useSelector } from "react-redux";

export default function CustomModalLayout(props){

const {profileId,creator,commentCreatorId,commentId,postCreatorId,postId,isFollowed,peopleLikes} = props;
const {customModal} = useSelector((state)=> state.modal);

return  <ModalHolder style={{width:350,height:"fit-content",borderRadius:10,padding:0}}>
                {customModal.type === "postOptionsList" && <PostOptionsList creator={creator} postCreatorId={postCreatorId} postId={postId} isFollowed={isFollowed} />}
                {customModal.type === "commentOptionsList" && <CommentOptionsList id={commentId} creatorId={commentCreatorId} postId={postId} />}
                {customModal.type === "peopleLikes" && <PeopleLikes peopleLikes={peopleLikes} />}
                {customModal.type === "followersPeople" && <Followers profileId={profileId} />}
                {customModal.type === "followingPeople" && <Following profileId={profileId} />}
        </ModalHolder>    
}