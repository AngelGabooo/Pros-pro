// src/services/saleService.js

import { fetchAPI } from './api.js';  // ← Usamos el sistema centralizado de API

/**
 * Servicio para gestión de ventas
 * Integrado con el fetchAPI central para URL dinámica y manejo de token
 */

export const saleService = {
  /**
   * Crear una nueva venta
   */
  async create(saleData) {
    try {
      console.log('💰 SaleService: Creando venta...', saleData);

      const data = await fetchAPI('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData)
      });

      console.log('✅ Venta creada exitosamente:', data.code || data.venta?.codigo);

      return {
        success: true,
        venta: data.venta,
        code: data.code || data.venta?.codigo,
        message: data.message || 'Venta registrada exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en saleService.create:', error);

      let message = error.message || 'Error al registrar la venta';

      if (error.status === 400) {
        message = 'Datos de venta inválidos. Verifica los productos y montos.';
      } else if (error.status === 401) {
        message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.isOffline || error.status === 0) {
        message = 'No se pudo conectar al servidor. Verifica tu conexión.';
      }

      throw {
        error: message,
        status: error.status,
        details: error.data?.details || error.details
      };
    }
  },

  /**
   * Obtener todas las ventas con filtros opcionales (paginación, fechas, etc.)
   */
  async getAll(params = {}) {
    try {
      console.log('📋 SaleService: Obteniendo ventas con filtros...', params);

      let endpoint = '/sales';
      if (Object.keys(params).length > 0) {
        const query = new URLSearchParams(params).toString();
        endpoint += `?${query}`;
      }

      const data = await fetchAPI(endpoint);

      return {
        success: true,
        ventas: data.ventas || [],
        paginacion: data.paginacion || {},
        estadisticas: data.estadisticas || {}
      };
    } catch (error) {
      console.error('❌ Error en saleService.getAll:', error);

      let message = error.message || 'Error al cargar las ventas';

      if (error.status === 401) {
        message = 'Sesión expirada. Inicia sesión nuevamente.';
      }

      throw {
        error: message,
        status: error.status
      };
    }
  },

  /**
   * Obtener ventas del día actual
   */
  async getToday() {
    try {
      console.log('📅 SaleService: Obteniendo ventas de hoy...');

      const data = await fetchAPI('/sales/today');

      return {
        success: true,
        ventas: data.ventas || [],
        estadisticas: data.estadisticas || {}
      };
    } catch (error) {
      console.error('❌ Error en saleService.getToday:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas generales de ventas
   */
  async getStats() {
    try {
      console.log('📊 SaleService: Obteniendo estadísticas de ventas...');

      const data = await fetchAPI('/sales/stats');

      return {
        success: true,
        estadisticas: data.estadisticas || {}
      };
    } catch (error) {
      console.error('❌ Error en saleService.getStats:', error);
      throw error;
    }
  },

  /**
   * Anular/cancelar una venta
   */
  async cancelSale(id, motivo = '') {
    try {
      console.log(`❌ SaleService: Cancelando venta ${id}...`, { motivo });

      const data = await fetchAPI(`/sales/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ motivo })
      });

      console.log(`✅ Venta ${id} cancelada correctamente`);

      return {
        success: true,
        venta: data.venta,
        message: data.message || 'Venta cancelada exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en saleService.cancelSale:', error);

      let message = error.message || 'Error al cancelar la venta';

      if (error.status === 404) {
        message = 'Venta no encontrada';
      } else if (error.status === 400) {
        message = 'La venta ya está cancelada o no se puede anular';
      }

      throw {
        error: message,
        status: error.status
      };
    }
  }
};

export default saleService;