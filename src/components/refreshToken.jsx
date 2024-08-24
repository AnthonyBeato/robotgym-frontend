import axiosInstance from "../instance/axiosIntance";

export async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
        const response = await axiosInstance.post('/refresh-token', { token: refreshToken });

        if (response.status === 200) {
            const newToken = response.data.accessToken;
            localStorage.setItem('token', newToken); // Actualiza el token en localStorage
            return newToken;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
}