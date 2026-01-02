// src/services/productService.js

import { fetchAPI } from './api.js';  // ← Usamos el mismo fetchAPI centralizado

/**
 * Servicio para gestión de productos
 * Totalmente integrado con el sistema central de API
 */

export const productService = {
  /**
   * Obtener todos los productos con filtros opcionales
   */
  async getAll(filters = {}) {
    try {
      console.log('🔍 ProductService: Obteniendo productos...', filters);

      let endpoint = '/products';
      if (filters.search || (filters.categoria && filters.categoria !== 'todas')) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search.trim());
        if (filters.categoria && filters.categoria !== 'todas') {
          params.append('categoria', filters.categoria);
        }
        endpoint += `?${params.toString()}`;
      }

      const data = await fetchAPI(endpoint);

      console.log(`✅ Productos recibidos: ${data.productos?.length || 0}`);

      return {
        success: true,
        productos: data.productos || [],
        total: data.total || data.productos?.length || 0,
        tienda: data.tienda
      };
    } catch (error) {
      console.error('❌ Error en productService.getAll:', error);

      let message = error.message || 'Error al cargar los productos';

      if (error.status === 401) {
        message = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (error.isOffline || error.status === 0) {
        message = 'No se pudo conectar al servidor. Verifica tu conexión o que el backend esté activo.';
      }

      return {
        success: false,
        error: message,
        productos: [],
        total: 0
      };
    }
  },

  /**
   * Crear un nuevo producto
   */
  async create(productData) {
    try {
      console.log('➕ ProductService: Creando nuevo producto...', productData);

      // Validaciones básicas
      if (!productData.nombre?.trim()) {
        throw new Error('El nombre del producto es requerido');
      }
      if (!productData.precio || isNaN(productData.precio) || productData.precio < 0) {
        throw new Error('El precio debe ser un número válido mayor o igual a 0');
      }

      const dataToSend = {
        nombre: productData.nombre.trim(),
        precio: parseFloat(productData.precio),
        descripcion: productData.descripcion || '',
        costo: productData.costo ? parseFloat(productData.costo) : 0,
        stock: productData.stock ? parseInt(productData.stock) : 0,
        stockMinimo: productData.minStock || productData.stockMinimo || 5,
        categoria: productData.categoria || 'General',
        proveedor: productData.proveedor || ''
      };

      // Solo incluir codigoInterno si se proporciona
      if (productData.codigoInterno?.trim()) {
        dataToSend.codigoInterno = productData.codigoInterno.trim();
      }

      // Solo incluir codigoBarra si tiene valor real
      if (productData.codigoBarra?.trim()) {
        dataToSend.codigoBarra = productData.codigoBarra.trim();
      }

      console.log('📤 Enviando al backend:', dataToSend);

      const data = await fetchAPI('/products', {
        method: 'POST',
        body: JSON.stringify(dataToSend)
      });

      console.log('✅ Producto creado:', data.producto?._id);

      return {
        success: true,
        producto: data.producto,
        message: data.message || 'Producto creado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en productService.create:', error);

      let errorMessage = error.message || 'Error al crear el producto';
      let campo = error.campo || null;

      if (error.data?.error) {
        errorMessage = error.data.error;
        campo = error.data.campo || null;
      }

      throw {
        error: errorMessage,
        campo,
        status: error.status,
        details: error.data?.details
      };
    }
  },

  /**
   * Actualizar un producto existente
   */
  async update(id, productData) {
    try {
      console.log(`✏️ ProductService: Actualizando producto ${id}...`, productData);

      const dataToSend = {
        nombre: productData.nombre?.trim(),
        precio: productData.precio !== undefined ? parseFloat(productData.precio) : undefined,
        descripcion: productData.descripcion || '',
        costo: productData.costo !== undefined ? parseFloat(productData.costo) : undefined,
        stock: productData.stock !== undefined ? parseInt(productData.stock) : undefined,
        stockMinimo: productData.stockMinimo,
        categoria: productData.categoria,
        proveedor: productData.proveedor || ''
      };

      // codigoInterno solo si se envía
      if (productData.codigoInterno !== undefined) {
        dataToSend.codigoInterno = productData.codigoInterno?.trim() || undefined;
      }

      // codigoBarra: solo si tiene valor, si no, no enviar (para no sobrescribir)
      if (productData.codigoBarra !== undefined) {
        if (productData.codigoBarra?.trim()) {
          dataToSend.codigoBarra = productData.codigoBarra.trim();
        }
        // Si está vacío, no incluir → backend no lo toca
      }

      // Eliminar campos undefined para no enviarlos
      Object.keys(dataToSend).forEach(key => 
        dataToSend[key] === undefined && delete dataToSend[key]
      );

      const data = await fetchAPI(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dataToSend)
      });

      console.log(`✅ Producto ${id} actualizado`);

      return {
        success: true,
        producto: data.producto,
        message: data.message || 'Producto actualizado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en productService.update:', error);
      throw error;
    }
  },

  /**
   * Eliminar (marcar como eliminado) un producto
   */
  async delete(id) {
    try {
      console.log(`🗑️ ProductService: Eliminando producto ${id}...`);

      const data = await fetchAPI(`/products/${id}`, {
        method: 'DELETE'
      });

      console.log(`✅ Producto ${id} marcado como eliminado`);

      return {
        success: true,
        message: data.message || 'Producto marcado como eliminado',
        producto: data.producto
      };
    } catch (error) {
      console.error('❌ Error en productService.delete:', error);
      throw error;
    }
  },

  /**
   * Actualizar solo el stock de un producto
   */
  async updateStock(id, stockData) {
    try {
      console.log(`📊 Actualizando stock del producto ${id}:`, stockData);

      if (!stockData.stock || isNaN(stockData.stock) || stockData.stock < 0) {
        throw new Error('El stock debe ser un número mayor o igual a 0');
      }

      const data = await fetchAPI(`/products/${id}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ stock: parseInt(stockData.stock) })
      });

      console.log(`✅ Stock actualizado para producto ${id}`);

      return {
        success: true,
        producto: data.producto,
        message: data.message || 'Stock actualizado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en productService.updateStock:', error);
      throw error;
    }
  },

  /**
   * Verificar autenticación y conexión a la tienda
   */
  async checkAuth() {
    try {
      console.log('🔐 Verificando autenticación...');

      const data = await fetchAPI('/debug/check-auth');

      return {
        success: true,
        authenticated: true,
        user: data.user,
        tienda: data.tienda
      };
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      return {
        success: false,
        authenticated: false,
        error: error.message || 'Sesión inválida o expirada'
      };
    }
  },

  /**
   * Verificar estado de la tienda actual
   */
  async checkTienda() {
    try {
      console.log('🏪 Verificando estado de la tienda...');

      const data = await fetchAPI('/check-tienda');

      return {
        success: true,
        ...data
      };
    } catch (error) {
      console.error('❌ Error verificando tienda:', error);
      throw error;
    }
  },

  /**
   * Health check del backend (sin autenticación)
   */
  async healthCheck() {
    try {
      console.log('🏥 Verificando salud del servidor...');

      // Esta ruta no requiere token
      const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();

      return {
        success: data.success || false,
        status: data.status,
        message: data.message
      };
    } catch (error) {
      console.error('❌ Servidor no responde:', error);
      return {
        success: false,
        error: 'El servidor no está disponible',
        status: { api: 'offline' }
      };
    }
  }
};

export default productService;