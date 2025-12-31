// services/saleService.js
const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Respuesta inválida del servidor: ${text.substring(0, 100)}`);
  }

  const data = await response.json();
  
  if (!response.ok) {
    console.error('❌ Error del servidor:', {
      status: response.status,
      statusText: response.statusText,
      data
    });
    
    const error = new Error(data.error || `Error ${response.status}: ${response.statusText}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

export const saleService = {
  async create(saleData) {
    try {
      console.log('💰 SaleService: Creando venta...', saleData);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleData)
      });

      const data = await handleResponse(response);
      
      console.log('✅ Venta creada exitosamente:', data.code);
      
      return {
        success: true,
        venta: data.venta,
        code: data.code,
        message: data.message
      };
      
    } catch (error) {
      console.error('❌ Error en saleService.create:', error);
      
      throw {
        error: error.message || 'Error en la venta',
        status: error.status,
        details: error.data?.details
      };
    }
  },

  async getAll(params = {}) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_URL}/sales${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await handleResponse(response);
      
      return {
        success: true,
        ventas: data.ventas || [],
        paginacion: data.paginacion,
        estadisticas: data.estadisticas
      };
      
    } catch (error) {
      console.error('❌ Error en saleService.getAll:', error);
      throw error;
    }
  },

  async getToday() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_URL}/sales/today`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await handleResponse(response);
      
      return {
        success: true,
        ventas: data.ventas || [],
        estadisticas: data.estadisticas
      };
      
    } catch (error) {
      console.error('❌ Error en saleService.getToday:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_URL}/sales/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await handleResponse(response);
      
      return {
        success: true,
        estadisticas: data.estadisticas
      };
      
    } catch (error) {
      console.error('❌ Error en saleService.getStats:', error);
      throw error;
    }
  },

  async cancelSale(id, motivo) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_URL}/sales/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ motivo })
      });

      const data = await handleResponse(response);
      
      return {
        success: true,
        venta: data.venta,
        message: data.message
      };
      
    } catch (error) {
      console.error('❌ Error en saleService.cancelSale:', error);
      throw error;
    }
  }
};