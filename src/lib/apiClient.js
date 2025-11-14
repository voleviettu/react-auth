import axios from 'axios';

// Token storage
let accessToken = null;
let refreshToken = localStorage.getItem('refreshToken');
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Create Axios instance
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      processQueue(new Error('No refresh token available'), null);
      isRefreshing = false;
      
      // Trigger logout
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(error);
    }

    try {
      // Attempt to refresh the token
      const response = await axios.post('/api/auth/refresh', {
        refreshToken: storedRefreshToken
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      // Update tokens
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      // Update the original request with new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Process queued requests
      processQueue(null, newAccessToken);

      isRefreshing = false;

      // Retry the original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed - logout user
      processQueue(refreshError, null);
      isRefreshing = false;

      clearTokens();
      window.dispatchEvent(new CustomEvent('auth:logout'));

      return Promise.reject(refreshError);
    }
  }
);

// Token management functions
export const setAccessToken = (token) => {
  accessToken = token;
};

export const setRefreshToken = (token) => {
  refreshToken = token;
  if (token) {
    localStorage.setItem('refreshToken', token);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => refreshToken || localStorage.getItem('refreshToken');

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('refreshToken');
};

export default apiClient;
