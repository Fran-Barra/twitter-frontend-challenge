import React, { useEffect, useState } from "react";
import Feed from "./Feed";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";
import { LIMIT } from "../../util/Constants";
import { Post } from "../../service";

interface ContentFeedProps {
  following: boolean
}

const ContentFeed = ({following} : ContentFeedProps) => {
  const [afterId, setAfterId] = useState<string>()
  const [posts, setPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const service = useReactQueryProxy()

  useEffect(()=>{
    setAfterId(undefined)
    setPosts([])
    setHasMore(true)
    console.log("following changed, posts to null");
    
  }, [following])

  const { data: newPosts, isLoading: loading } = service.useGetPosts(following, LIMIT, afterId);

  useEffect(()=>{
    if (!newPosts) return
    if (newPosts.length === 0) {
      setHasMore(false)
      return
    }

    setPosts(oldPosts=> {
      const map = new Map<string, Post>(oldPosts.map(p=>[p.id, p]))
      newPosts.forEach(np=>map.set(np.id, np))
      return Array.from(map.values())
    })
  }, [newPosts])

  const handleOnReachedEnd = () => {
    if (!posts) return
    setAfterId(posts[posts.length-1].id)
  }


  if (!posts) {
    return <></>
  }
  return <Feed posts={posts} loading={loading} hasMore={hasMore} onReachedEnd={handleOnReachedEnd} />;
};
export default ContentFeed;
