import React, { useCallback, useRef } from "react";
import { Post } from "../../service";
import { StyledContainer } from "../common/Container";
import Tweet from "../tweet/Tweet";
import Loader from "../loader/Loader";

interface FeedProps {
  posts: Post[];
  loading: boolean;
  hasMore?: boolean;
  onReachedEnd? : () => void;
}

const Feed = ({ posts, loading, hasMore = true, onReachedEnd }: FeedProps) => {
  const observer = useRef<IntersectionObserver>()

  const lastTweet = useCallback(() => {
    if (loading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log("is visible and has more");
        if (onReachedEnd) onReachedEnd()
      }
    })
  }, [loading, hasMore])

  //TODO: manage overflow (height)
  return (
    <StyledContainer width={"100%"} alignItems={"center"} height={"auto"} maxHeight={"100%"} overflowY={"auto"}>
      {posts
        .filter((post, index, self) => {
          return self.findIndex((p) => p.id === post.id) === index;
        })
        .map((post: Post, i: number) => {
          return posts.length == i+1 ?
            <Tweet ref={lastTweet} key={post.id} post={post} /> :
            <Tweet key={post.id} post={post} />
        })}
      {loading && <Loader />}
    </StyledContainer>
  );
};

export default Feed;
