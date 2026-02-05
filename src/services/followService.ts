import httpRequest from "@/utils/httpRequest";

const followService = {
    followUser: (userId: string) => {
        return httpRequest.post(`/api/follow/${userId}/follow`);
    },
    unfollowUser: (userId: string) => {
        return httpRequest.delete(`/api/follow/${userId}/follow`);
    },
    getFollowers: (userId: string, page = 1, limit = 20) => {
        return httpRequest.get(`/api/follow/${userId}/followers`, {
            params: { page, limit },
        });
    },
    getFollowing: (userId: string, page = 1, limit = 20) => {
        return httpRequest.get(`/api/follow/${userId}/following`, {
            params: { page, limit },
        });
    },
};

export default followService;