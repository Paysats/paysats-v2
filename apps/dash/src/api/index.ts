import axios from 'axios';
import { useDashAuthStore } from '../store/dashAuthStore';
import { config } from '@shared/config/config';

const api = axios.create({
    baseURL: `${config.app.API_URL}/admin`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = useDashAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            useDashAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;
