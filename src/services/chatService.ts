import httpRequest from "@/utils/httpRequest";

const chatService = {
  getConversations: (page = 1, limit = 20) => {
    return httpRequest.get("/api/messages/conversations", {
      params: { page, limit },
    });
  },

  createOrGetConversation: (userId: string) => {
    return httpRequest.post("/api/messages/conversations", { userId });
  },

  getMessages: (conversationId: string, page = 1, limit = 50) => {
    return httpRequest.get(`/api/messages/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
  },

  sendTextMessage: (data: { conversationId: string; recipientId: string; content: string }) => {
    return httpRequest.post("/api/messages/messages", {
      conversationId: data.conversationId,
      recipientId: data.recipientId,
      content: data.content,
      messageType: "text",
    });
  },

  sendImageMessage: (formData: FormData) => {
    return httpRequest.post("/api/messages/messages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  markAsRead: (messageId: string) => {
    return httpRequest.put(`/api/messages/messages/${messageId}/read`);
  },

  getUnreadCount: () => {
    return httpRequest.get("/api/messages/unread-count");
  },
};

export default chatService;