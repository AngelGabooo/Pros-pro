// src/services/dashboardService.js

import { fetchAPI } from './api.js';  // Reutilizamos el mismo fetchAPI que ya configuramos

/**
 * Servicio para el Dashboard
 * Usa el mismo sistema de API que authService para mantener consistencia
 * en URL, token, manejo de errores, etc.
 */

export const dashboardService = {
  /**
   * Obtener todas las estadísticas del dashboard en una sola llamada
   */
  getStats: async () => {
    try {
      console.log('📊 Solicitando estadísticas del dashboard...');
      
      const data = await fetchAPI('/dashboard/stats');

      if (data.success && data.stats) {
        console.log('✅ Estadísticas del dashboard cargadas correctamente');
        return {
          success: true,
          stats: data.stats
        };
      } else {
        console.warn('⚠️ Respuesta inesperada del servidor en dashboard/stats:', data);
        return {
          success: false,
          error: data.error || 'Respuesta inválida del servidor'
        };
      }
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del dashboard:', error);

      let message = 'Error desconocido al cargar el dashboard';

      if (error.isOffline) {
        message = 'No hay conexión a internet o el servidor no está disponible';
      } else if (error.status === 0) {
        message = 'No se pudo conectar al servidor. Verifica tu conexión o que el backend esté activo.';
      } else if (error.status === 401) {
        message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        // Opcional: puedes hacer logout automático aquí
        // authService.logout();
      } else if (error.status >= 500) {
        message = 'Error en el servidor. Intenta más tarde.';
      } else if (error.message) {
        message = error.message;
      }

      return {
        success: false,
        error: message
      };
    }
  },

  /**
   * Opcional: función para ventas por período (si la usas en algún gráfico)
   */
  getVentasPorPeriodo: async (periodo = 'hoy') => {
    try {
      console.log(`📈 Obteniendo ventas para período: ${periodo}`);
      const data = await fetchAPI(`/dashboard/ventas/${periodo}`);
      
      if (data.success) {
        return { success: true, data: data };
      } else {
        return { success: false, error: data.error || 'Error al cargar ventas' };
      }
    } catch (error) {
      console.error(`❌ Error obteniendo ventas por ${periodo}:`, error);
      return {
        success: false,
        error: error.message || 'Error de conexión'
      };
    }
  },

  /**
   * Opcional: productos más vendidos
   */
  getProductosMasVendidos: async (limite = 10) => {
    try {
      const data = await fetchAPI(`/dashboard/productos-mas-vendidos/${limite}`);
      if (data.success) {
        return { success: true, productos: data.productos };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Error obteniendo productos más vendidos:', error);
      return { success: false, error: 'Error al cargar productos más vendidos' };
    }
  },

  /**
   * Opcional: alertas del sistema
   */
  getAlertas: async () => {
    try {
      const data = await fetchAPI('/dashboard/alertas');
      if (data.success) {
        return { success: true, alertas: data.alertas, total: data.totalAlertas };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Error obteniendo alertas:', error);
      return { success: false, error: 'No se pudieron cargar las alertas' };
    }
  }
};