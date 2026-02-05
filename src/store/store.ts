import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './slice/userSlice';
import { postsSlice } from './slice/postsSlice';
import { commentSlice } from './slice/commentSlice'
import { authSlice } from './slice/authSlice';
import { searchHistorySlice } from './slice/searchHistorySlice';
import { chatSlice } from './slice/chatSlice';

export const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
    user: userSlice.reducer,
    comments: commentSlice.reducer,
    auth: authSlice.reducer,
    searchHistory: searchHistorySlice.reducer,
    chat: chatSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;