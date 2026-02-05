import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '@/services/commentService';

interface CommentState {
  comments: any[];
  replies: Record<string, any[]>;
  loading: boolean;
  replyLoading: Record<string, boolean>;
}

const initialState: CommentState = {
  comments: [],
  replies: {},
  loading: false,
  replyLoading: {},
};

export const getPostComments = createAsyncThunk(
  'comments/getPostComments',
  async ({ postId }: { postId: string }, thunkAPI) => {
    try {
      const res: any = await commentService.getComments(postId, 1000, 0);
      return res.data.comments;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCommentReplies = createAsyncThunk(
  'comments/getReplies',
  async ({ postId, commentId }: { postId: string; commentId: string }, thunkAPI) => {
    try {
      const res: any = await commentService.getReplies(postId, commentId, 1000, 0);

      return {
        commentId,
        replies: res.data.replies
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }: { postId: string; content: string }, thunkAPI) => {
    try {
      const res: any = await commentService.createComment(postId, content);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createReply = createAsyncThunk(
  'comments/createReply',
  async ({ postId, parentId, content }: { postId: string; parentId: string; content: string }, thunkAPI) => {
    try {
      const res: any = await commentService.createReply(postId, parentId, content);

      return {
        parentId: parentId,
        reply: res.data
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ postId, commentId, content, parentId }: { postId: string; commentId: string; content: string; parentId?: string }, thunkAPI) => {
    try {
      const res: any = await commentService.updateComment(postId, commentId, content);
      return {
        commentId,
        parentId,
        updatedData: res.data
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ postId, commentId, parentId }: { postId: string; commentId: string; parentId?: string }, thunkAPI) => {
    try {
      await commentService.deleteComment(postId, commentId);
      return { commentId, parentId };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const likeComment = createAsyncThunk(
  'comments/likeComment',
  async ({ postId, commentId, parentId }: { postId: string; commentId: string; parentId?: string }, thunkAPI) => {
    try {
      const res: any = await commentService.likeComment(postId, commentId);
      return { commentId, parentId, updatedData: res.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const unlikeComment = createAsyncThunk(
  'comments/unlikeComment',
  async ({ postId, commentId, parentId }: { postId: string; commentId: string; parentId?: string }, thunkAPI) => {
    try {
      const res: any = await commentService.unlikeComment(postId, commentId);
      return { commentId, parentId, updatedData: res.data };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    resetComments: (state) => {
      state.comments = [];
      state.replies = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostComments.pending, (state) => {
        state.loading = true;
      })

      .addCase(getPostComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.map((c: any) => ({
          ...c,
          repliesCount: c.repliesCount || 0
        }));
        action.payload.forEach((comment: any) => {
          if (comment.replies?.length > 0) {
            state.replies[comment._id] = comment.replies;
          }
        });

      })
      .addCase(getCommentReplies.pending, (state, action) => {
        state.replyLoading[action.meta.arg.commentId] = true;
      })
      .addCase(getCommentReplies.fulfilled, (state, action) => {
        const { commentId, replies } = action.payload;
        state.replyLoading[commentId] = false;
        state.replies[commentId] = replies;
      })
      .addCase(createComment.fulfilled, (state, action) => {

        state.comments.unshift(action.payload);
      })
      .addCase(createReply.fulfilled, (state, action) => {
        const { parentId, reply } = action.payload;
        if (!state.replies[parentId]) state.replies[parentId] = [];
        state.replies[parentId].push(reply);
        const parent = state.comments.find(c => c._id === parentId);
        if (parent) parent.repliesCount = (parent.repliesCount || 0) + 1;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const { commentId, parentId, updatedData } = action.payload;
        if (!updatedData) return;

        if (parentId) {
          if (state.replies[parentId]) {
            const id = state.replies[parentId].findIndex(r => r._id === commentId);
            if (id !== -1) {
              state.replies[parentId][id] = {
                ...state.replies[parentId][id],
                content: updatedData.content,
                updatedAt: updatedData.updatedAt
              };
            }
          }
        } else {
          const id = state.comments.findIndex(c => c._id === commentId);
          if (id !== -1) {
            state.comments[id] = {
              ...state.comments[id],
              content: updatedData.content,
              updatedAt: updatedData.updatedAt
            };
          }
        }
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const { commentId, parentId, updatedData } = action.payload;
        if (!updatedData) return;

        if (parentId) {
          if (state.replies[parentId]) {
            const id = state.replies[parentId].findIndex(r => r._id === commentId);
            if (id !== -1) {
              state.replies[parentId][id].likes = updatedData.likes;
            }
          }
        } else {
          const id = state.comments.findIndex(c => c._id === commentId);
          if (id !== -1) {
            state.comments[id].likes = updatedData.likes;
          }
        }
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const { commentId, parentId, updatedData } = action.payload;
        if (!updatedData) return;

        if (parentId) {
          if (state.replies[parentId]) {
            const id = state.replies[parentId].findIndex(r => r._id === commentId);
            if (id !== -1) {
              state.replies[parentId][id].likes = updatedData.likes;
            }
          }
        } else {
          const id = state.comments.findIndex(c => c._id === commentId);
          if (id !== -1) {
            state.comments[id].likes = updatedData.likes;
          }
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, parentId } = action.payload;

        if (parentId) {
          if (state.replies[parentId]) {
            state.replies[parentId] = state.replies[parentId].filter(r => r._id !== commentId);
          }
          const parentComment = state.comments.find(c => c._id === parentId);
          if (parentComment && parentComment.repliesCount > 0) {
            parentComment.repliesCount -= 1;
          }
        } else {
          state.comments = state.comments.filter(c => c._id !== commentId);
          delete state.replies[commentId];
        }
      });


  },
});

export const { resetComments } = commentSlice.actions;