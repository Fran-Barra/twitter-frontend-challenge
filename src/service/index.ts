export interface SignUpData {
  name: string;
  password: string;
  email: string;
  username: string;
}

export interface SingInData {
  username?: string;
  email?: string;
  password: string;
}

export interface PostData {
  content: string;
  parentId?: string;
  images?: File[];
}

export interface Post {
  id: string;
  content: string;
  parentId?: string;
  images?: string[];
  createdAt: Date;
  authorId: string;
  author: Author;
  qtyComments: number;
  qtyLikes: number;
  qtyRetweets: number;
  likedByUser?: boolean;
  retweetedByUser?: boolean;
}

export interface Reaction {
  id: string;
  type: string;
  createdAt: Date;
  userId: string;
  postId: string;
  updatedAt: Date;
  deletedAt?: Date;
}
export interface Author {
  id: string;
  name?: string;
  username: string;
  profilePicture?: string;
  private: boolean;
  createdAt: Date;
  follows: boolean;
}

export interface User {
  id: string;
  name?: string;
  username: string;
  profilePicture?: string;
  private: boolean;
  createdAt: Date;
  follows: boolean;
  followsBack: boolean;
  posts: Post[];
}

export interface MessageDTO {
  id: string;
  message: string;
  createdAt: Date;
  chatId: string;
  userId: string;
  sender: Author;
}

export interface ChatDTO {
  id: string;
  name: string;
  owner: Author;
  participants: Author[];
  messages: MessageDTO[];
  createdAt: Date
}
