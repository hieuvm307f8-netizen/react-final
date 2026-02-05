import httpRequest from "@/utils/httpRequest";

const postService = {
  getNewsFeed: (limit = 200, offset = 0) => {
    return httpRequest.get(`/api/posts/feed?limit=${limit}&offset=${offset}`);
  },

  getExplore: (page = 1, limit = 20) => {
    return httpRequest.get(`/api/posts/explore?page=${page}&limit=${limit}`);
  },

  getUserPosts: (userId: string, filter: 'all' | 'video' | 'saved' = 'all', limit = 20, offset = 0) => {
    return httpRequest.get(`/api/posts/user/${userId}`, {
      params: { filter, limit, offset }
    });
  },

  getUserStats: (userId: string) => {
    return httpRequest.get(`/api/posts/user/${userId}/stats`);
  },

  getPostDetails: (postId: string) => {
    return httpRequest.get(`/api/posts/${postId}`);
  },

  createPost: (formData: FormData) => {
    return httpRequest.post('/api/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updatePost: (postId: string, caption: string) => {
    return httpRequest.patch(`/api/posts/${postId}`, { caption });
  },

  deletePost: (postId: string) => {
    return httpRequest.delete(`/api/posts/${postId}`);
  },

  likePost: (postId: string) => httpRequest.post(`/api/posts/${postId}/like`),

  unlikePost: (postId: string) => httpRequest.delete(`/api/posts/${postId}/like`),

  savePost: (postId: string) => httpRequest.post(`/api/posts/${postId}/save`),

  unsavePost: (postId: string) => httpRequest.delete(`/api/posts/${postId}/save`),
};

export default postService;