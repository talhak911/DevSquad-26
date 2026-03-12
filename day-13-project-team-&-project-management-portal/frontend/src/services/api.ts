import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send HttpOnly refresh_token cookie
  headers: { "Content-Type": "application/json" },
});

// ─── Request Interceptor: inject access token ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response Interceptor: handle 401 → refresh flow ─────────────────────────
let isRefreshing = false;
let failedQueue: {
  resolve: (v: string) => void;
  reject: (e: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Skip refresh flow for login and register requests
    const isAuthRequest = originalRequest.url.includes("/auth/login") || originalRequest.url.includes("/auth/register");
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newToken = data.data.token;
        localStorage.setItem("access_token", newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth ───────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),
  getMe: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.post("/auth/refresh"),
};

// ─── Projects ───────────────────────────────────────────────────────────────────
export const projectsApi = {
  getAll: () => api.get("/projects"),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (data: Record<string, unknown>) => api.post("/projects", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  getStats: () => api.get("/projects/stats"),
  assignMember: (
    projectId: string,
    userId: string,
    permission: "edit" | "view",
  ) => api.post(`/projects/${projectId}/assign`, { userId, permission }),
  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/assign/${userId}`),
};

// ─── Members ───────────────────────────────────────────────────────────────────
export const membersApi = {
  getAll: () => api.get("/members"),
  getOne: (id: string) => api.get(`/members/${id}`),
  create: (data: Record<string, unknown>) => api.post("/members", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/members/${id}`, data),
  delete: (id: string) => api.delete(`/members/${id}`),
  getStats: () => api.get("/members/stats"),
};

export default api;
