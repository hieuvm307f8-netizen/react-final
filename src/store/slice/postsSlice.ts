import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from '@/services/postService';

interface PostState {
  homePosts: any[];
  profilePosts: any[];
  explorePosts: any[];
  savedPosts: any[];
  loading: boolean;
  error: string | null;
  posts: any[];
  userPosts: any[];
}

const initialState: PostState = {
  homePosts: [],
  profilePosts: [],
  explorePosts: [],
  savedPosts: [],
  loading: false,
  error: null,
  posts: [],
  userPosts: [],
};

export const getPostDetails = createAsyncThunk(
  'posts/getPostDetails',
  async (postId: string, thunkAPI) => {
    try {
      const res: any = await postService.getPostDetails(postId);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getNewsFeed = createAsyncThunk(
  'posts/getNewsFeed',
  async (args: { limit?: number; offset?: number } | void, thunkAPI) => {
    try {
      const limit = (args as any)?.limit || 10;
      const offset = (args as any)?.offset || 0;
      const res: any = await postService.getNewsFeed(limit, offset);
      return { posts: res.data?.posts || [], offset };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getExplorePosts = createAsyncThunk(
  'posts/getExplorePosts',
  async (args: { page?: number; limit?: number } | void, thunkAPI) => {
    try {
      const page = (args as any)?.page || 1;
      const limit = (args as any)?.limit || 20;
      const res: any = await postService.getExplore(page, limit);
      return res.data?.posts || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserPosts = createAsyncThunk(
  'posts/getUserPosts',
  async ({ userId, filter }: { userId: string, filter: 'all' | 'video' | 'saved' }, thunkAPI) => {
    try {
      const res: any = await postService.getUserPosts(userId, filter);
      const posts = res.data?.posts || [];
      return { posts, filter, userId };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createNewPost = createAsyncThunk(
  'posts/createPost',
  async (formData: FormData, thunkAPI) => {
    try {
      const res: any = await postService.createPost(formData);
      return res.data?.post || res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  'posts/toggleLike',
  async ({ postId, userId, isLiked }: { postId: string, userId: string, isLiked: boolean }, thunkAPI) => {
    try {
      let response;
      if (isLiked) {
        response = await postService.unlikePost(postId);
      } else {
        response = await postService.likePost(postId);
      }

      return {
        postId,
        userId,
        isLiked: !isLiked,
        data: response.data?.data || response.data
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleSavePost = createAsyncThunk(
  'posts/toggleSave',
  async ({ postId, userId, isSaved }: { postId: string, userId: string, isSaved: boolean }, thunkAPI) => {
    try {
      let response;
      if (isSaved) {
        response = await postService.unsavePost(postId);
      } else {
        response = await postService.savePost(postId);
      }

      return {
        postId,
        userId,
        isSaved: !isSaved,
        postData: response.data?.data
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, thunkAPI) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, caption }: { postId: string, caption: string }, thunkAPI) => {
    try {
      const res: any = await postService.updatePost(postId, caption);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearProfilePosts: (state) => {
      state.profilePosts = [];
    },
    clearSavedPosts: (state) => {
      state.savedPosts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostDetails.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const updateInList = (list: any[]) => {
          const id = list.findIndex(p => p._id === updatedPost._id);
          if (id !== -1) list[id] = updatedPost;
        };
        updateInList(state.homePosts);
        updateInList(state.profilePosts);
        updateInList(state.savedPosts);
      })
      .addCase(getNewsFeed.pending, (state) => { state.loading = true; })
      .addCase(getNewsFeed.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, offset } = action.payload;
        if (offset === 0) {
          state.homePosts = posts;
        } else {
          const existingIds = new Set(state.homePosts.map(p => p._id));
          const newUniquePosts = posts.filter((p: any) => !existingIds.has(p._id));
          state.homePosts = [...state.homePosts, ...newUniquePosts];
        }
      })
      .addCase(getExplorePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.explorePosts = action.payload;
      })
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, filter } = action.payload;

        if (filter === 'saved') {
          state.savedPosts = posts.map((p: any) => ({ ...p, isSaved: true }));
        } else {
          state.profilePosts = posts;
        }
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.loading = false;
        const newPost = action.payload;
        state.homePosts = [newPost, ...state.homePosts];
        state.profilePosts = [newPost, ...state.profilePosts];
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, userId, isLiked } = action.payload;
        const updatedData = action.payload.data;

        const updateList = (list: any[]) => {
          const index = list.findIndex((p) => p._id === postId);
          if (index !== -1) {
            list[index].likes = updatedData.likes;
            if (!list[index].likedBy) list[index].likedBy = [];

            if (isLiked) {
              if (!list[index].likedBy.includes(userId)) {
                list[index].likedBy.push(userId);
              }
            } else {
              list[index].likedBy = list[index].likedBy.filter((id: string) => id !== userId);
            }
            list[index].isLiked = isLiked;
          }
        };

        updateList(state.homePosts);
        updateList(state.profilePosts);
        updateList(state.savedPosts);
        updateList(state.explorePosts);
      })
      .addCase(toggleSavePost.fulfilled, (state, action) => {
        const { postId, userId, isSaved, postData } = action.payload;

        const updateList = (list: any[]) => {
          const index = list.findIndex((p) => p._id === postId);
          if (index !== -1) {
            if (!list[index].savedBy) list[index].savedBy = [];

            if (isSaved) {
              if (!list[index].savedBy.includes(userId)) list[index].savedBy.push(userId);
            } else {
              list[index].savedBy = list[index].savedBy.filter((id: string) => id !== userId);
            }
            list[index].isSaved = isSaved;
          }
        };

        updateList(state.homePosts);
        updateList(state.profilePosts);
        updateList(state.explorePosts);

        if (isSaved) {
          const postToSave = postData || state.homePosts.find(p => p._id === postId);
          if (postToSave && !state.savedPosts.find(p => p._id === postId)) {
            state.savedPosts.unshift({ ...postToSave, isSaved: true });
          }
        } else {
          state.savedPosts = state.savedPosts.filter(p => p._id !== postId);
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload;
        state.homePosts = state.homePosts.filter(p => p._id !== postId);
        state.profilePosts = state.profilePosts.filter(p => p._id !== postId);
        state.explorePosts = state.explorePosts.filter(p => p._id !== postId);
        state.savedPosts = state.savedPosts.filter(p => p._id !== postId);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const updateList = (list: any[]) => {
          const index = list.findIndex(p => p._id === updatedPost._id);
          if (index !== -1) {
            list[index].caption = updatedPost.caption;
            list[index].updatedAt = updatedPost.updatedAt;
          }
        };

        updateList(state.homePosts);
        updateList(state.profilePosts);
        updateList(state.explorePosts);
        updateList(state.savedPosts);
      });
  },
});

export const { clearProfilePosts, clearSavedPosts } = postsSlice.actions;
export default postsSlice.reducer;