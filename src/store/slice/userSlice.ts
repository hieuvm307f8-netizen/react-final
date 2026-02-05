import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "@/services/userService";
import followService from "@/services/followService";

interface UserState {
  viewedUser: any;
  searchResults: any[];
  suggestedUsers: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  viewedUser: null,
  searchResults: [],
  suggestedUsers: [],
  loading: false,
  error: null,
};

export const searchUsers = createAsyncThunk(
  "user/search",
  async (query: string, thunkAPI) => {
    try {
      const res: any = await userService.searchUsers(query);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/get-by-id",
  async (userId: string, thunkAPI) => {
    try {
      const res: any = await userService.getUserById(userId);
      console.log(res.data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getSuggestedUsers = createAsyncThunk(
  "user/suggested",
  async (_, thunkAPI) => {
    try {
      const res: any = await userService.getSuggestedUsers();
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const followUser = createAsyncThunk(
  "user/followUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await followService.followUser(userId);
      return { userId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await followService.unfollowUser(userId);
      return { userId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getFollowers = createAsyncThunk(
  "user/getFollowers",
  async ({ userId, page }: { userId: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await followService.getFollowers(userId, page);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFollowing = createAsyncThunk(
  "user/getFollowing",
  async ({ userId, page }: { userId: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await followService.getFollowing(userId, page);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearViewedUser: (state) => {
      state.viewedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.viewedUser = action.payload;
      })
      .addCase(getSuggestedUsers.fulfilled, (state, action) => {
        state.suggestedUsers = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        if (state.viewedUser && state.viewedUser._id === userId) {
          state.viewedUser.isFollowing = true;
          state.viewedUser.followersCount += 1;
        }
        state.suggestedUsers = state.suggestedUsers.map(user =>
          user._id === userId
            ? { ...user, isFollowing: true, followersCount: user.followersCount + 1 }
            : user
        );
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { userId } = action.payload;

        if (state.viewedUser && state.viewedUser._id === userId) {
          state.viewedUser.isFollowing = false;
          state.viewedUser.followersCount -= 1;
        }
        state.suggestedUsers = state.suggestedUsers.map(user =>
          user._id === userId
            ? { ...user, isFollowing: false, followersCount: user.followersCount - 1 }
            : user
        );
      })

  },
});

export const { clearSearchResults, clearViewedUser } = userSlice.actions;
export default userSlice.reducer;