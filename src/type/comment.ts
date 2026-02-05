export type TComment = {
  id: number;
  username: string;
  avatarUrl: string;
  commentContent: string;
  isLiked: boolean;
  likesCount: number
};

export type TPostComments = {
  postId: number;
  comments: TComment[];
};