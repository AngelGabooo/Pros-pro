const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para manejar respuestas HTTP
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
    error.campo = data.campo; // Agregar campo para saber qué causó el error
    throw error;
  }
  
  return data;
};

// Helper para obtener token
const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('⚠️ No hay token de autenticación en localStorage');
  }
  return token;
};

export const productService = {
  /**
   * Obtener todos los productos
   */
  async getAll(filters = {}) {
    try {
      console.log('🔍 ProductService: Obteniendo productos...');
      const token = getToken();
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      // Construir URL con filtros
      const url = new URL(`${API_URL}/products`);
      if (filters.search) url.searchParams.append('search', filters.search);
      if (filters.categoria && filters.categoria !== 'todas') {
        url.searchParams.append('categoria', filters.categoria);
      }

      console.log('📡 URL de petición:', url.toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      console.log('📊 Status de respuesta:', response.status);
      
      const data = await handleResponse(response);
      
      console.log(`✅ Productos recibidos: ${data.productos?.length || 0}`);
      
      return {
        success: true,
        productos: data.productos || [],
        total: data.total || 0,
        tienda: data.tienda
      };
      
    } catch (error) {
      console.error('❌ Error en productService.getAll:', error);
      
      return {
        success: false,
        error: error.message || 'Error al cargar productos',
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
      console.log('➕ ProductService: Creando nuevo producto...');
      console.log('📦 Datos del producto recibidos:', productData);
      
      const token = getToken();
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      // Validar datos mínimos
      if (!productData.nombre || !productData.nombre.trim()) {
        throw new Error('El nombre del producto es requerido');
      }

      if (!productData.precio || isNaN(productData.precio) || productData.precio < 0) {
        throw new Error('El precio debe ser un número válido mayor o igual a 0');
      }

      // CORRECCIÓN: Preparar datos limpios
      const dataToSend = {
        nombre: productData.nombre.trim(),
        precio: parseFloat(productData.precio),
        descripcion: productData.descripcion || '',
        costo: productData.costo || 0,
        stock: productData.stock || 0,
        stockMinimo: productData.minStock || productData.stockMinimo || 5,
        categoria: productData.categoria || 'General',
        proveedor: productData.proveedor || ''
      };

      // Solo agregar codigoInterno si tiene valor
      if (productData.codigoInterno && productData.codigoInterno.trim()) {
        dataToSend.codigoInterno = productData.codigoInterno.trim();
      }
      // Si no tiene valor, el backend generará uno automático

      // CORRECCIÓN IMPORTANTE: Solo enviar codigoBarra si tiene valor
      // No enviar el campo si está vacío o null
      if (productData.codigoBarra && productData.codigoBarra.trim() !== '') {
        dataToSend.codigoBarra = productData.codigoBarra.trim();
      }
      // Si está vacío, simplemente no incluirlo en el objeto

      console.log('📤 Enviando datos al backend:', dataToSend);
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend),
        credentials: 'include'
      });

      console.log('📊 Status de respuesta:', response.status);
      
      const data = await handleResponse(response);
      
      console.log('✅ Producto creado exitosamente:', data.producto?._id);
      
      return {
        success: true,
        producto: data.producto,
        message: data.message || 'Producto creado exitosamente'
      };
      
    } catch (error) {
      console.error('❌ Error en productService.create:', error);
      
      let errorMessage = error.message || 'Error desconocido';
      let campoError = error.campo || null;
      
      if (error.data?.error) {
        errorMessage = error.data.error;
        campoError = error.data.campo;
      }

      throw {
        error: errorMessage,
        campo: campoError,
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
      console.log(`✏️ ProductService: Actualizando producto ${id}...`);
      
      const token = getToken();
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      const dataToSend = {
        nombre: productData.nombre,
        codigoInterno: productData.codigoInterno,
        precio: productData.precio,
        descripcion: productData.descripcion || '',
        costo: productData.costo || 0,
        stock: productData.stock,
        stockMinimo: productData.stockMinimo,
        categoria: productData.categoria,
        proveedor: productData.proveedor || ''
      };

      // Manejar código de barras
      if (productData.codigoBarra !== undefined) {
        if (productData.codigoBarra && productData.codigoBarra.trim() !== '') {
          dataToSend.codigoBarra = productData.codigoBarra.trim();
        } else {
          // Para limpiar el código de barras, no enviar el campo
          // El backend lo manejará como undefined
        }
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend),
        credentials: 'include'
      });

      const data = await handleResponse(response);
      
      console.log(`✅ Producto actualizado: ${id}`);
      
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
   * Eliminar (desactivar) un producto
   */
  async delete(id) {
    try {
      console.log(`🗑️ ProductService: Marcando producto ${id} como inactivo...`);
      
      const token = getToken();
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const data = await handleResponse(response);
      
      console.log(`✅ Producto marcado como inactivo: ${id}`);
      
      return {
        success: true,
        message: data.message || 'Producto marcado como inactivo',
        producto: data.producto
      };
      
    } catch (error) {
      console.error('❌ Error en productService.delete:', error);
      throw error;
    }
  },

  /**
   * Actualizar stock de un producto
   */
  async updateStock(id, stockData) {
    try {
      console.log(`📊 ProductService: Actualizando stock del producto ${id}...`);
      
      const token = getToken();
      
      if (!token) {
        throw new Error('No autenticado. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_URL}/products/${id}/stock`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(stockData),
        credentials: 'include'
      });

      const data = await handleResponse(response);
      
      console.log(`✅ Stock actualizado para producto: ${id}`);
      
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
   * Verificar autenticación y conexión
   */
  async checkAuth() {
    try {
      console.log('🔐 ProductService: Verificando autenticación...');
      
      const token = getToken();
      
      if (!token) {
        return {
          success: false,
          error: 'No hay token de autenticación',
          authenticated: false
        };
      }

      const response = await fetch(`${API_URL}/debug/check-auth`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const data = await handleResponse(response);
      
      console.log('✅ Autenticación verificada:', data.user?.usuario);
      
      return {
        success: true,
        authenticated: true,
        user: data.user,
        tienda: data.tienda
      };
      
    } catch (error) {
      console.error('❌ Error en productService.checkAuth:', error);
      
      return {
        success: false,
        error: error.message,
        authenticated: false
      };
    }
  },

  /**
   * Verificar estado de la tienda
   */
  async checkTienda() {
    try {
      console.log('🏪 ProductService: Verificando estado de la tienda...');
      
      const token = getToken();
      
      if (!token) {
        throw new Error('No autenticado');
      }

      const response = await fetch(`${API_URL}/check-tienda`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const data = await handleResponse(response);
      
      console.log('✅ Estado de tienda:', data.estado);
      
      return {
        success: true,
        ...data
      };
      
    } catch (error) {
      console.error('❌ Error en productService.checkTienda:', error);
      throw error;
    }
  },

  /**
   * Verificar salud de la API
   */
  async healthCheck() {
    try {
      console.log('🏥 ProductService: Verificando salud de la API...');
      
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      console.log('✅ Health check:', data.status?.api);
      
      return {
        success: data.success || false,
        status: data.status,
        message: data.message
      };
      
    } catch (error) {
      console.error('❌ Error en productService.healthCheck:', error);
      
      return {
        success: false,
        error: 'No se pudo conectar al servidor',
        status: {
          api: 'offline',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
};

export default productService;