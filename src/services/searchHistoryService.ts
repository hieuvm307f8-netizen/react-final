import httpRequest from "@/utils/httpRequest";

const searchHistoryService = {
  addHistory: (data: { searchedUserId?: string; searchQuery: string }) => {
    return httpRequest.post("/api/search-history", data);
  },
  getHistory: (limit: number = 20) => {
    return httpRequest.get("/api/search-history", { params: { limit } });
  },
  deleteHistoryItem: (historyId: string) => {
    return httpRequest.delete(`/api/search-history/${historyId}`);
  },
  clearAllHistory: () => {
    return httpRequest.delete("/api/search-history");
  },
};

export default searchHistoryService;