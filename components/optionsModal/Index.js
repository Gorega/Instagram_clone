import ModalHolder from "../ModalHolder";
import Content from "./Content";

export default function PostOptionsModal(props){

return <ModalHolder style={{width:350,height:"fit-content",borderRadius:10,padding:0}}>
        <Content likesPeople={props.likesPeople}
                creator={props.creator}
                followed={props.followed}
                postCreatorId={props.postCreatorId}
                commentCreatorId={props.commentCreatorId}
                post_id={props.post_id}
                comment_id={props.comment_id}
                profile_id={props.profile_id}
        />
</ModalHolder>    
}