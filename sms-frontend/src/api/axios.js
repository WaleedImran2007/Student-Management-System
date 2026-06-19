import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        if (error.response && error.response.status === 403) {
            window.location.href = '/no-permission';
        }

        else if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // Return the error so individual components can still handle specific errors if they want to
        return Promise.reject(error);
    }
);

export default api;
