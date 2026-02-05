import httpRequest from "@/utils/httpRequest";

const authService = {
  register: (data: any) => httpRequest.post("/api/auth/register", data),
  login: (data: any) => httpRequest.post("/api/auth/login", data),
  verifyEmail: (token: string) => httpRequest.post(`/api/auth/verify-email/${token}`),
  refreshToken: (refreshToken: string) => httpRequest.post("/api/auth/refresh-token", { refreshToken }),
  resendVerifyEmail: (email: string) => {
    return httpRequest.post("/api/auth/resend-verification-email", { email });
  },

  forgotPassword: (email: string) => {
    return httpRequest.post("/api/auth/forgot-password", { email });
  },

  resetPassword: (token: string, password: string) => {
    return httpRequest.post(`/api/auth/reset-password/${token}`, { password });
  },

  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return httpRequest.post("/api/auth/change-password", data);
  },

};

export default authService;