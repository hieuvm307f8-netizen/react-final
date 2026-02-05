import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import chatService from "@/services/chatService";
import type { RootState } from "../store";

interface ChatState {
    conversations: any[];
    currentConversation: any | null;
    messages: any[];
    unreadCount: number;
    loading: boolean;
    messagesLoading: boolean;
    sending: boolean;
    error: string | null;
    typingUsers: { [conversationId: string]: boolean };
}

const initialState: ChatState = {
    conversations: [],
    currentConversation: null,
    messages: [],
    unreadCount: 0,
    loading: false,
    messagesLoading: false,
    sending: false,
    error: null,
    typingUsers: {},
};

export const getConversations = createAsyncThunk(
    "chat/getConversations",
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState() as RootState;
            const currentUserId = state.auth.currentUser?._id;
            const response: any = await chatService.getConversations();
            return {
                conversations: response.data.conversations,
                unreadCount: response.data.unreadCount,
                currentUserId,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const createOrGetConversation = createAsyncThunk(
    "chat/createOrGet",
    async (userId: string, thunkAPI) => {
        try {
            const response: any = await chatService.createOrGetConversation(userId);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getMessages = createAsyncThunk(
    "chat/getMessages",
    async (conversationId: string, thunkAPI) => {
        try {
            const response: any = await chatService.getMessages(conversationId);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const sendTextMessage = createAsyncThunk(
    "chat/sendText",
    async (payload: { conversationId: string; recipientId: string; content: string }, thunkAPI) => {
        try {
            const response: any = await chatService.sendTextMessage(payload);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const sendImageMessage = createAsyncThunk(
    "chat/sendImage",
    async (formData: FormData, thunkAPI) => {
        try {
            const response: any = await chatService.sendImageMessage(formData);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const markAsRead = createAsyncThunk(
    "chat/markAsRead",
    async (messageId: string, thunkAPI) => {
        try {
            const response: any = await chatService.markAsRead(messageId);
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const getUnreadCount = createAsyncThunk(
    "chat/getUnreadCount",
    async (_, thunkAPI) => {
        try {
            const response: any = await chatService.getUnreadCount();
            return response.data.unreadCount;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setTyping: (state, action: PayloadAction<{ conversationId: string; isTyping: boolean }>) => {
            state.typingUsers[action.payload.conversationId] = action.payload.isTyping;
        },

        receiveNewMessage: (state, action: PayloadAction<any>) => {
            const newMessage = action.payload;
            const conversationId = newMessage.conversationId;
            const conversationIndex = state.conversations.findIndex((item) => item._id === conversationId);

            if (conversationIndex !== -1) {
                const isCurrentChat = state.currentConversation?._id === conversationId;
                const senderId = typeof newMessage.senderId === "object" ? newMessage.senderId._id : newMessage.senderId;

                const updatedConversation = {
                    ...state.conversations[conversationIndex],
                    lastMessage: newMessage,
                    lastMessageAt: newMessage.createdAt,
                    unreadCount:
                        !isCurrentChat && senderId !== state.currentConversation?.myId
                            ? (state.conversations[conversationIndex].unreadCount || 0) + 1
                            : state.conversations[conversationIndex].unreadCount || 0,
                };

                state.conversations.splice(conversationIndex, 1);
                state.conversations.unshift(updatedConversation);
            }

            if (state.currentConversation && state.currentConversation._id === conversationId) {
                const isMessageExists = state.messages.some((message) => message._id === newMessage._id);
                if (!isMessageExists) {
                    state.messages.push(newMessage);
                }
            }
        },

        resetChatState: (state) => {
            state.currentConversation = null;
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getConversations.fulfilled, (state, action: any) => {
                state.loading = false;
                const { conversations, currentUserId } = action.payload;
                const uniqueMap = new Map();

                conversations.forEach((conversation: any) => {
                    const partner = conversation.participants.find((p: any) => p._id !== currentUserId);
                    if (!partner) return;

                    const existing = uniqueMap.get(partner._id);
                    if (!existing || new Date(conversation.updatedAt) > new Date(existing.updatedAt)) {
                        uniqueMap.set(partner._id, conversation);
                    }
                });

                state.conversations = Array.from(uniqueMap.values()).sort(
                    (a, b) =>
                        new Date(b.lastMessageAt || b.updatedAt).getTime() -
                        new Date(a.lastMessageAt || a.updatedAt).getTime()
                );
                state.unreadCount = action.payload.unreadCount;
            })
            .addCase(createOrGetConversation.fulfilled, (state, action) => {
                state.currentConversation = action.payload;
                const exists = state.conversations.find((c) => c._id === action.payload._id);
                if (!exists) {
                    state.conversations.unshift(action.payload);
                }
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.messagesLoading = false;
                state.messages = action.payload.messages;
                const conversation = state.conversations.find((c) => c._id === state.currentConversation?._id);
                if (conversation) {
                    state.unreadCount = Math.max(0, state.unreadCount - (conversation.unreadCount || 0));
                    conversation.unreadCount = 0;
                }
            })
            .addCase(sendTextMessage.fulfilled, (state, action) => {
                const isMessageExists = state.messages.some((message) => message._id === action.payload._id);
                if (!isMessageExists) {
                    state.messages.push(action.payload);
                }

                const conversationIndex = state.conversations.findIndex(
                    (item) => item._id === action.payload.conversationId
                );
                if (conversationIndex !== -1) {
                    state.conversations[conversationIndex].lastMessage = action.payload;
                    state.conversations[conversationIndex].lastMessageAt = action.payload.createdAt;
                    const [movedConversation] = state.conversations.splice(conversationIndex, 1);
                    state.conversations.unshift(movedConversation);
                }
            })
            .addCase(sendImageMessage.fulfilled, (state, action) => {
                state.sending = false;
                const isMessageExists = state.messages.some((message) => message._id === action.payload._id);
                if (!isMessageExists) {
                    state.messages.push(action.payload);
                }

                const conversationIndex = state.conversations.findIndex(
                    (item) => item._id === action.payload.conversationId
                );
                if (conversationIndex !== -1) {
                    state.conversations[conversationIndex].lastMessage = action.payload;
                    state.conversations[conversationIndex].lastMessageAt = action.payload.createdAt;
                    const [movedConversation] = state.conversations.splice(conversationIndex, 1);
                    state.conversations.unshift(movedConversation);
                }
            });
    },
});

export const { setTyping, receiveNewMessage, resetChatState } = chatSlice.actions;
export default chatSlice.reducer;