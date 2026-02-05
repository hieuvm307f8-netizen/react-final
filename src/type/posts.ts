export interface TPost {
  id: number;
  username: string;
  avatarUrl: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isSponsored?: boolean;
}