import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Routes that do NOT need auth and should never trigger a refresh
const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/refresh'];

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ---- Race condition state ----
let isRefreshing = false;
// Queue of { resolve, reject } for requests waiting on a token refresh
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

// ---- Request interceptor: attach access token ----
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Don't attach token for auth routes
    const url = config.url || '';
    const isAuthRoute = AUTH_ROUTES.some((route) => url.includes(route));

    if (!isAuthRoute && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

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
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      // Mark as retrying and set refreshing flag
      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('refreshToken')
        : null;

      if (!storedRefreshToken) {
        processQueue(error, null);
        isRefreshing = false;
        // Force logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: storedRefreshToken,
        });

        const newAccessToken: string = data.access_token;
        const newRefreshToken: string = data.refresh_token;

        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Update queued requests with new token
        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — force logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
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
