import axios, {
} from "axios";

const DEFAULT_BASE = "https://instagram.f8team.dev";

const httpRequest = axios.create({
  baseURL: DEFAULT_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

httpRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

httpRequest.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const res = await axios.post("https://instagram.f8team.dev/api/auth/refresh-token", { refreshToken });
          
          if (res.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return httpRequest(originalRequest);
          }
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    const message = error.response?.data?.message || "error";
    return Promise.reject(new Error(message));
  }
);

export default httpRequest;