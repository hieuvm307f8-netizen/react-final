import httpRequest from "@/utils/httpRequest";

const userService = {
  getProfile: () => {
    return httpRequest.get("/api/users/profile");
  },
  updateProfile: (data: FormData) => {
    return httpRequest.patch("/api/users/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteProfilePicture: () => {
    return httpRequest.delete("/api/users/profile/picture");
  },
  getUserById: (userId: string) => {
    return httpRequest.get(`/api/users/${userId}`);
  },
  searchUsers: (q: string) => {
    return httpRequest.get("/api/users/search", {
      params: { q },
    });
  },
  getSuggestedUsers: () => {
    return httpRequest.get("/api/users/suggested");
  },
};

export default userService;