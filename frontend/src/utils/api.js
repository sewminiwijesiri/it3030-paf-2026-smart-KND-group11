import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081',
});

// Request interceptor: Attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 & 403 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Session expired or unauthenticated -> Redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
            } else if (error.response.status === 403) {
                // Unauthorized role -> Show Access Denied
                window.location.href = '/access-denied';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
