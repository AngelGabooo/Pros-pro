// src/services/dashboardService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Añadir token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardService = {
  getStats: async () => {
    try {
      // UNA SOLA LLAMADA: todo lo que necesita el dashboard
      const response = await api.get('/dashboard/stats');

      if (response.data.success) {
        return {
          success: true,
          stats: response.data.stats
        };
      } else {
        return {
          success: false,
          error: response.data.error || 'Error al cargar estadísticas'
        };
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas del dashboard:', error);

      // Mejor mensaje de error
      const message = error.response?.data?.error 
        || error.message 
        || 'No se pudo conectar al servidor. Verifica que esté corriendo.';

      return {
        success: false,
        error: message
      };
    }
  }
};