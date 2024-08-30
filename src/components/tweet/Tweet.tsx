import React, {useState} from "react";
import {StyledTweetContainer} from "./TweetContainer";
import AuthorData from "./user-post-data/AuthorData";
import type {Post} from "../../service";
import {StyledReactionsContainer} from "./ReactionsContainer";
import Reaction from "./reaction/Reaction";
import {IconType} from "../icon/Icon";
import {StyledContainer} from "../common/Container";
import ThreeDots from "../common/ThreeDots";
import DeletePostModal from "./delete-post-modal/DeletePostModal";
import ImageContainer from "./tweet-image/ImageContainer";
import CommentModal from "../comment/comment-modal/CommentModal";
import {useNavigate} from "react-router-dom";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";
import { ReactionType } from "../../util/ReactionType";
import { createPortal } from "react-dom";

interface TweetProps {
  post: Post;
}

const Tweet = React.forwardRef<HTMLDivElement, TweetProps>(({post} : TweetProps, ref) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCommentModal, setShowCommentModal] = useState<boolean>(false);
  const service = useReactQueryProxy();
  const navigate = useNavigate();

  //TODO: manage error and loading
  const {data: user} = service.useMe()
  const {data: actualPost, isLoading: postLoading} = service.useGetPostById(post.id)

  const createReactionMutation = service.useCreateReaction({})
  const deleteReactionMutation = service.useDeleteReaction({})

  const handleReaction = async (type: ReactionType) => {
    if (postLoading || !actualPost) return
    const reacted = hasReactedByType(type);
    if (reacted) {
      deleteReactionMutation.mutate({postId: actualPost.id, reactionType: type})
    } else {
      createReactionMutation.mutate({postId: actualPost.id, reactionType: type})
    }
  };

  const hasReactedByType = (type: ReactionType): boolean => {    
    if (!actualPost) return (type === ReactionType.LIKE ? post.likedByUser : post.retweetedByUser) || false
    return (type === ReactionType.LIKE ? actualPost.likedByUser : actualPost.retweetedByUser) || false
  };

  //TODO: check how the undefined actualPost is being managed.
  return (
      <StyledTweetContainer ref={ref} >
        <StyledContainer
            style={{width: "100%"}}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            maxHeight={"48px"}
        >
          <AuthorData
              id={post.author.id}
              name={post.author.name ?? "Name"}
              username={post.author.username}
              createdAt={post.createdAt}
              profilePicture={post.author.profilePicture}
          />
          {post.authorId === user?.id && (
              <>
                <DeletePostModal
                    show={showDeleteModal}
                    id={post.id}
                    onClose={() => {
                      setShowDeleteModal(false);
                    }}
                />
                <ThreeDots
                    onClick={() => {
                      setShowDeleteModal(!showDeleteModal);
                    }}
                />
              </>
          )}
        </StyledContainer>
        <StyledContainer onClick={() => navigate(`/post/${post.id}`)}>
          <p>{post.content}</p>
        </StyledContainer>
        {post.images && post.images!.length > 0 && (
            <StyledContainer padding={"0 0 0 10%"}>
              <ImageContainer images={post.images}/>
            </StyledContainer>
        )}
        <StyledReactionsContainer>
          <Reaction
              img={IconType.CHAT}
              count={(actualPost || post).qtyComments}
              reactionFunction={() =>
                  window.innerWidth > 600
                      ? setShowCommentModal(true)
                      : navigate(`/compose/comment/${post.id}`)
              }
              increment={0}
              reacted={false}
          />
          <Reaction
              img={IconType.RETWEET}
              count={(actualPost || post).qtyRetweets}
              reactionFunction={() => handleReaction(ReactionType.RETWEET)}
              increment={1}
              reacted={hasReactedByType(ReactionType.RETWEET)}
          />
          <Reaction
              img={IconType.LIKE}
              count={(actualPost || post).qtyLikes}
              reactionFunction={() => handleReaction(ReactionType.LIKE)}
              increment={1}
              reacted={hasReactedByType(ReactionType.LIKE)}
          />
        </StyledReactionsContainer>
        { showCommentModal && createPortal(
          <CommentModal
              show={showCommentModal}
              post={post}
              onClose={() => setShowCommentModal(false)}
          />,
          document.body
        )}
      </StyledTweetContainer>
  );
});

export default Tweet;
