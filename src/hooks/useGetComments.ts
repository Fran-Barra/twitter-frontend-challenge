import { useEffect, useState } from "react";
import { useHttpRequestService } from "../service/HttpRequestService";
import { Post } from "../service";

interface UseGetCommentsProps {
  postId: string;
}


//TODO: should paginate, should make a pagination method
export const useGetComments = ({ postId }: UseGetCommentsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const service = useHttpRequestService();

  useEffect(() => {
    try {
      setLoading(true);
      setError(false);
      service.getCommentsByPostId(postId).then((res) => {       
        setPosts(oldPosts => {
          return Array.from(new Set([...oldPosts, ...res]))
        }) 
        setLoading(false);
      });
    } catch (e) {
      setError(true);
      console.log(e);
    }
  }, [postId]);

  return { posts, loading, error };
};
