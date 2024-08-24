import axios from 'axios';
import { refreshToken } from '../components/refreshToken'; // La función que ya definimos para renovar el token

const apiUrl = import.meta.env.VITE_HOST;

const axiosInstance = axios.create({
    baseURL: apiUrl,
});

// Interceptor para manejar la expiración del token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Intenta refrescar el token
            const newToken = await refreshToken();
            if (newToken) {
                // Actualiza el token en la solicitud original
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;