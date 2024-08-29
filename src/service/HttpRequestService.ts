import axios from "axios";
import server from "./axiosServer";
import type { ChatDTO, Post, PostData, SignUpData, SingInData, User } from "./index";
import { S3Service } from "./S3Service";
import { ReactionType } from "../util/ReactionType";

interface HttpRequestService {
  me: () => Promise<User | undefined>
  followUser: (userId: string) => Promise<any | undefined>
  unfollowUser: (userId: string) => Promise<any | undefined>
  getProfile: (userId : string) => Promise<User>

  getPosts: (following: boolean, limit: number, after?: string) => Promise<Post[]>
  getPostById: (postId : string) => Promise<Post>

  createReaction: (postId : string, reactionType: ReactionType) => Promise<void>
  deleteReaction: (postId : string, reactionType: ReactionType) => Promise<void>

  createChat: (participantIds: string[], name?: string) => Promise<void>
  getChats: () => Promise<ChatDTO[]>

  [key: string]: (...args: any[]) => Promise<any | undefined>;
}

const httpRequestService : HttpRequestService = {
  signUp: async (data: Partial<SignUpData>) => {
    const res = await server.post(`/auth/signup`, {...data, privateUser: true});

    if (res.status === 201) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },

  signIn: async (data: SingInData) => {
    const res = await server.post(`/auth/login`, data);
    if (res.status === 200) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  createPost: async (data: PostData) => {
    const body = {content: data.content, images: data.images ? data.images.map(i=>'') : undefined}
    
    const res = data.parentId ? 
      await server.post(`/post/comment/${data.parentId}`, body) :
      await server.post(`/post`, body) 
      
    if (res.status === 201) {
      const { upload } = S3Service;
      for (const imageUrl of res.data.images) {
        const index: number = res.data.images.indexOf(imageUrl);
        await upload(data.images![index], imageUrl);
      }
      return res.data;
    }
  },
  getPaginatedPosts: async (limit: number, after: string, query: string) => {
    const res = await server.get(`/post/${query}`, {
      params: {
        limit,
        after,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },

  //TODO: type query and use axios params
  getPosts: async (following: boolean, limit: number, after?: string) => {
    const res = await server.get(`/post${following ? '/following' : ''}`, {
      params: {
        limit,
        after
      }
    });
    if (res.status === 200) {
      return res.data;
    }
  },

  getRecommendedUsers: async (limit: number, skip: number) => {
    const res = await server.get(`/user`, {
      params: {
        limit,
        skip,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },

  me: async () => {
    console.log("Requested with axios");
    
    const res = await server.get(`/user/me`);
    if (res.status === 200) {
      return res.data;
    }
  },

  getPostById: async (id: string) => {
    const res = await server.get(`/post/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },

  createReaction: async (postId: string, reaction: ReactionType) => {
    const res = await server.post(
      `/reaction/${postId}`, null,
      { params: {reactionType: reaction} }
    );
    if (res.status === 201) {
      return res.data;
    }
  },

  deleteReaction: async (postId: string, reaction: ReactionType) => {
    const res = await server.delete(
      `/reaction/${postId}`,
      {params: { reactionType: reaction}}
    );
    if (res.status === 200) {
      return res.data;
    }
  },

  followUser: async (userId: string) => {
    const res = await server.post(`/follower/follow/${userId}`);
    if (res.status === 201) {
      return res.data;
    }
  },

  unfollowUser: async (userId: string) => {
    const res = await server.post(`/follower/unfollow/${userId}`);
    if (res.status === 200) {
      return res.data;
    }
  },

  searchUsers: async (username: string, limit: number, skip: number) => {
    try {
      //TODO: deprecated, should not be used
      const cancelToken = axios.CancelToken.source();
      if (!username) return []
      const response = await server.get(`/user/by_username/${username}`, {
        params: {
          limit,
          skip,
        },
        cancelToken: cancelToken.token,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (!axios.isCancel(error)) console.log(error);
    }
  },

  getProfile: async (id: string) => {
    const res = await server.get(`/user/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },

  getPaginatedPostsFromProfile: async (
    limit: number,
    after: string,
    id: string
  ) => {
    const res = await server.get(`/post/by_user/${id}`, {
      params: {
        limit,
        after,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },
  getPostsFromProfile: async (id: string) => {
    const res = await server.get(`/post/by_user/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  },

  isLogged: async () => {
    const res = await server.get(`/user/me`);
    return res.status === 200;
  },

  getProfileView: async (id: string) => {
    const res = await server.get(`/user/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },

  deleteProfile: async () => {
    const res = await server.delete(`/user/me`);

    if (res.status === 204) {
      localStorage.removeItem("token");
    }
  },

  getChats: async () => {
    const res = await server.get(`/chat`);

    if (res.status === 200) {
      return res.data;
    }
  },

  getMutualFollows: async () => {
    const res = await server.get(`/follow/mutual`);

    if (res.status === 200) {
      return res.data;
    }
  },

  createChat: async (participantIds: string[], name: string = "personal") => {
    const res = await server.post(
      `/chat`,
      {
        participantIds: participantIds,
        name: name
      }
    );

    if (res.status === 201) {
      return res.data;
    }
  },

  getChat: async (id: string) => {
    const res = await server.get(`/chat/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  },

  deletePost: async (id: string) => {
    await server.delete(`/post/${id}`);
  },

  getPaginatedCommentsByPostId: async (
    id: string,
    limit: number,
    after: string
  ) => {
    const res = await server.get(`/post/comment/${id}`, {
      params: {
        limit,
        after,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  
  getCommentsByPostId: async (id: string) => {
    const res = await server.get(`/post/comment/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },
};

const useHttpRequestService = () => httpRequestService;

// For class component (remove when unused)
class HttpService {
  service = httpRequestService;
}

export { useHttpRequestService, HttpService };
