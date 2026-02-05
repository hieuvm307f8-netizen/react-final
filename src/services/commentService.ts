import httpRequest from "@/utils/httpRequest";

const commentService = {
  getComments: (postId: string, limit = 20, offset = 0) => {
    return httpRequest.get(`/api/posts/${postId}/comments`, {
      params: { limit, offset }
    });
  },

  getReplies: (postId: string, commentId: string, limit = 10, offset = 0) => {
    return httpRequest.get(`/api/posts/${postId}/comments/${commentId}/replies`, {
      params: { limit, offset }
    });
  },

  createComment: (postId: string, content: string) => {
    return httpRequest.post(`/api/posts/${postId}/comments`, {
      content,
      parentCommentId: null
    });
  },

  createReply: (postId: string, commentId: string, content: string) => {
    return httpRequest.post(`/api/posts/${postId}/comments/${commentId}/replies`, {
      content
    });
  },

  updateComment: (postId: string, commentId: string, content: string) => {
    return httpRequest.patch(`/api/posts/${postId}/comments/${commentId}`, {
      content
    });
  },

  deleteComment: (postId: string, commentId: string) => {
    return httpRequest.delete(`/api/posts/${postId}/comments/${commentId}`);
  },

  likeComment: (postId: string, commentId: string) => {
    return httpRequest.post(`/api/posts/${postId}/comments/${commentId}/like`);
  },

  unlikeComment: (postId: string, commentId: string) => {
    return httpRequest.delete(`/api/posts/${postId}/comments/${commentId}/like`);
  }
};

export default commentService;