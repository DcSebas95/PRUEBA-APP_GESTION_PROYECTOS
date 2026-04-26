//Conexion entre en BACK y el FRONT
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Manejar errores globalmente
api.interceptors.response.use(
    response => response,
    error => {
        const mensaje = error.response?.data?.mensaje || 'Error en el servidor';
        return Promise.reject(new Error(mensaje));
    }
);

export default api;