import { config } from '@/config/config';
import { STORAGE_KEYS } from '@shared/utils';
import axios from 'axios';

const api = axios.create({
    baseURL: config.app.API_URL,
    withCredentials: true, // Include cookies in requests
})

// interceptors
api.interceptors.request.use((config: any) => {

    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// response interceptor to handle 401 errors
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Don't retry if the failed request was to the refresh endpoint itself
        if (originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // attempt to refresh the access token
                const refreshResponse = await api.post('/auth/refresh');

                if (refreshResponse.data.success) {
                    const newAccessToken = refreshResponse.data.data.accessToken;
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);

                    // update the authorization header
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    processQueue(null, newAccessToken);

                    // retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);

                // clear storage and redirect to auth
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);

                window.location.href = '/auth';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;