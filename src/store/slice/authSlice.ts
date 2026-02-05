import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import authService from "@/services/authService";
import userService from "@/services/userService";

interface AuthState {
  currentUser: any;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  loading: false,
  error: null,
  accessToken: localStorage.getItem("access_token") || null,
};

export const accessUser = createAsyncThunk(
  "auth/access-user",
  async ({ data, type }: any, thunkAPI) => {
    try {
      if (type === "register") {
        const res: any = await authService.register(data);
        return { type, res: res.data || res };
      } else {
        const res: any = await authService.login(data);
        const responseData = res.data || res;
        const accessToken = responseData?.accessToken || responseData?.tokens?.accessToken;
        const refreshToken = responseData?.refreshToken || responseData?.tokens?.refreshToken;

        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
          if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
          }
        }

        return {
          type,
          res: {
            user: responseData.user || responseData.data?.user,
            accessToken: accessToken
          }
        };
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Authentication error");
    }
  }
);
export const getCurrentUser = createAsyncThunk(
  "auth/get-user",
  async (_, thunkAPI) => {
    try {
      const res: any = await userService.getProfile();
      return res.data;

    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateCurrentUser = createAsyncThunk(
  "auth/update-user",
  async (formData: FormData, thunkAPI) => {
    try {
      const res: any = await userService.updateProfile(formData);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteProfilePicture = createAsyncThunk(
  "auth/delete-picture",
  async (_, thunkAPI) => {
    try {
      const res: any = await userService.deleteProfilePicture();
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const changeUserPassword = createAsyncThunk(
  "auth/change-password",
  async (data: any, thunkAPI) => {
    try {
      const res: any = await authService.changePassword(data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to change password");
    }
  }
);


export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.error = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(accessUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(accessUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload.type === "login") {
          state.accessToken = action.payload.res.accessToken;
          state.currentUser = action.payload.res.user;
          state.error = null;
        }
      })
      .addCase(accessUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.accessToken = null;
        localStorage.removeItem("access_token");
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = { ...state.currentUser, ...action.payload };
      })
      .addCase(deleteProfilePicture.fulfilled, (state) => {
        if (state.currentUser) state.currentUser.profilePicture = null;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;