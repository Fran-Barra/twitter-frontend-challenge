import axios from "axios";
import server from "./axiosServer";
import type { PostData, SingInData, SingUpData, User } from "./index";
import { S3Service } from "./S3Service";

interface HttpRequestService {
  me: () => Promise<User | undefined>
  followUser: (userId: string) => Promise<any | undefined>
  unfollowUser: (userId: string) => Promise<any | undefined>
  getProfile: (userId : string) => Promise<User>

  [key: string]: (...args: any[]) => Promise<any | undefined>;
}

const httpRequestService : HttpRequestService = {
  signUp: async (data: Partial<SingUpData>) => {
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
    const res = await server.post(`/post`, data);
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
  getPosts: async (query: string) => {
    const res = await server.get(`/post/${query}`);
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

  createReaction: async (postId: string, reaction: string) => {
    const res = await server.post(
      `/reaction/${postId}`,
      { type: reaction }
    );
    if (res.status === 201) {
      return res.data;
    }
  },

  deleteReaction: async (reactionId: string) => {
    const res = await server.delete(`/reaction/${reactionId}`);
    if (res.status === 200) {
      return res.data;
    }
  },

  followUser: async (userId: string) => {
    const res = await server.post(`/follow/${userId}`);
    if (res.status === 201) {
      return res.data;
    }
  },

  unfollowUser: async (userId: string) => {
    const res = await server.delete(`/follow/${userId}`);
    if (res.status === 200) {
      return res.data;
    }
  },

  searchUsers: async (username: string, limit: number, skip: number) => {
    try {
      //TODO: deprecated, should not be used
      const cancelToken = axios.CancelToken.source();

      const response = await server.get(`/user/search`, {
        params: {
          username,
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

  createChat: async (id: string) => {
    const res = await server.post(
      `/chat`,
      {
        users: [id],
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
    const res = await server.get(`/post/comment/by_post/${id}`, {
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
    const res = await server.get(`/post/comment/by_post/${id}`);
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
