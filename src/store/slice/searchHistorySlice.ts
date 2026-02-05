import searchHistoryService from "@/services/searchHistoryService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface HistoryState {
    historyItems: any[];
    loading: boolean;
}

const initialState: HistoryState = {
    historyItems: [],
    loading: false,
};

export const fetchSearchHistory = createAsyncThunk("history/fetch", async () => {
    const res: any = await searchHistoryService.getHistory();
    return res.data;
});

export const addHistoryItem = createAsyncThunk("history/add", async (data: any) => {
    const res: any = await searchHistoryService.addHistory(data);
    return res.data;
});

export const deleteHistoryItem = createAsyncThunk("history/delete", async (id: string) => {
    await searchHistoryService.deleteHistoryItem(id);
    return id;
});

export const clearAllHistory = createAsyncThunk("history/clearAll", async () => {
    await searchHistoryService.clearAllHistory();
    return [];
});

export const searchHistorySlice = createSlice({
    name: "searchHistory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchHistory.fulfilled, (state, action) => {
                state.historyItems = action.payload;
            })
            .addCase(addHistoryItem.fulfilled, (state, action) => {
                state.historyItems = [action.payload, ...state.historyItems.filter(i => i._id !== action.payload._id)];
            })
            .addCase(deleteHistoryItem.fulfilled, (state, action) => {
                state.historyItems = state.historyItems.filter(item => item._id !== action.payload);
            })
            .addCase(clearAllHistory.fulfilled, (state) => {
                state.historyItems = [];
            });
    },
});

export default searchHistorySlice.reducer;  