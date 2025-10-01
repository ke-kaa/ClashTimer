import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const publicPaths = [
            '/auth/register',
            '/auth/login',
            '/auth/forgot-password',
            '/auth/reset-password'
        ];

        const isPublicPath = publicPaths.some(path => config.url.endsWith(path));

        if (!isPublicPath) {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;