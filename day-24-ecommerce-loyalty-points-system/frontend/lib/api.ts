import axios, { AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Routes that do NOT need auth and should never trigger a refresh
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/refresh'];

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Crucial for sending HttpOnly cookies automatically
});

// ---- Race condition state ----
let isRefreshing = false;
// Queue of { resolve, reject } for requests waiting on a token refresh
let failedQueue: Array<{ resolve: () => void; reject: (err: any) => void }> = [];

function processQueue(error: any) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

// ---- Response interceptor: handle 401, refresh token with race condition guard ----
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Skip retry entirely for auth routes
    const url = originalRequest?.url || '';
    const isAuthRoute = AUTH_ROUTES.some((route) => url.includes(route));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              // The browser will automatically attach the new HttpOnly cookie
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      // Mark as retrying and set refreshing flag
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // The refresh_token is sent automatically via HTTPOnly cookie
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });

        // Update queued requests to proceed
        processQueue(null);

        // Retry original request (axios + browser handles the new cookie)
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed — force logout but avoid redirecting passive checks
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          if (!url.includes('/auth/profile')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
