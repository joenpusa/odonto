import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true, // For cookies if needed, though we return tokens in body too
    headers: {
        'Content-Type': 'application/json',
    },
});

import i18n from '../i18n';

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers['Accept-Language'] = i18n.language || 'es';
        return config;
    },
    (error) => Promise.reject(error)
);

// TODO: Add response interceptor for refresh token on 401
// api.interceptors.response.use(...)

export default api;
