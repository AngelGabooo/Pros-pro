// src/services/api.js - VERSIÓN CORREGIDA

// ==================== CONFIGURACIÓN DE URL DEL BACKEND ====================
// En desarrollo: localhost
// En producción: la URL de tu backend desplegado en Vercel
const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000/api';


// Eliminar barra final si existe, para evitar duplicados
const API_URL = API_BASE_URL.endsWith('/') 
  ? API_BASE_URL.slice(0, -1) 
  : API_BASE_URL;

console.log('🌍 API Base URL configurada:', API_URL);

// ==================== HELPER PARA OBTENER TOKEN ====================
const getToken = () => {
  return localStorage.getItem('auth_token') || localStorage.getItem('token');
};

// ==================== HELPER PRINCIPAL DE FETCH ====================
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  
  // Asegurar que el endpoint empiece con /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // Agregar token solo si NO es registro o login
  if (token && !cleanEndpoint.includes('/register') && !cleanEndpoint.includes('/login')) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(`📡 API Request: ${cleanEndpoint}`, { 
    method: options.method || 'GET',
    url: `${API_URL}${cleanEndpoint}`
  });

  try {
    const response = await fetch(`${API_URL}${cleanEndpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Necesario para cookies si usas sesiones (opcional)
    });

    // Manejar respuestas no JSON (errores del servidor, HTML, etc.)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Respuesta no JSON del servidor:', text.substring(0, 200));
      throw {
        status: response.status,
        message: 'Respuesta inválida del servidor (no JSON)',
        data: text
      };
    }

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error ${response.status}:`, data);
      throw {
        status: response.status,
        message: data.error || data.message || 'Error desconocido del servidor',
        data
      };
    }

    return data;
  } catch (error) {
    console.error(`❌ Fetch error para ${cleanEndpoint}:`, error);

    // Error de conexión (servidor apagado, CORS, etc.)
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw {
        status: 0,
        message: 'No se pudo conectar al servidor. Verifica tu conexión a internet o que el backend esté activo.',
        data: null,
        isOffline: true
      };
    }

    // Otros errores (JSON mal formado, etc.)
    throw error;
  }
};

// ==================== SERVICIO DE AUTENTICACIÓN ====================
export const authService = {
  /**
   * Registro de nuevo usuario
   */
  async register(userData) {
    try {
      console.log('👤 Registrando nuevo usuario...', { usuario: userData.usuario });
      console.log('📦 Enviando datos de registro real al backend:', userData);
      
      const data = await fetchAPI('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      console.log('✅ Usuario registrado exitosamente:', data);
      return data;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error || { error: 'Error de conexión al registrar' };
    }
  },

  /**
   * Login de usuario
   */
  async login(credentials) {
    try {
      console.log('🔐 Intentando login...', { username: credentials.username });
      
      const data = await fetchAPI('/login', {
        method: 'POST',
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      if (data.success && data.token && data.user) {
        console.log('✅ Login exitoso:', data.user.usuario);
        
        // Guardar en localStorage con nombres consistentes
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token); // Backup por compatibilidad
        localStorage.setItem('user', JSON.stringify(data.user)); // Backup por compatibilidad
        localStorage.setItem('tienda', data.user.databaseName || '');
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        // Disparar evento para notificar a App.jsx
        window.dispatchEvent(new CustomEvent('userLogin', {
          detail: { user: data.user }
        }));
      }

      return data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error || { error: 'Error de conexión al iniciar sesión' };
    }
  },

  /**
   * Logout
   */
  logout() {
    console.log('👋 Realizando logout...');
    
    // Limpiar todo el localStorage de forma exhaustiva
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tienda');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('bankData');
    localStorage.removeItem('pos_recent_products');
    localStorage.removeItem('pos_sale_counter');
    localStorage.removeItem('pos_notifications');
    
    // Disparar evento para notificar a App.jsx
    window.dispatchEvent(new CustomEvent('userLogout'));
  },

  /**
   * Verificar si está autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const user = localStorage.getItem('auth_user') || localStorage.getItem('user');
    
    if (!token || !user) return false;

    try {
      const userData = JSON.parse(user);
      return !!(token && userData && userData.id && userData.usuario);
    } catch {
      return false;
    }
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    try {
      // Intentar con auth_user primero, luego con user por compatibilidad
      const userStr = localStorage.getItem('auth_user') || localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('❌ Error leyendo usuario de localStorage:', error);
      return null;
    }
  },

  /**
   * Obtener nombre de la tienda actual
   */
  getCurrentTienda() {
    const user = this.getCurrentUser();
    return user?.databaseName || localStorage.getItem('tienda') || null;
  },

  /**
   * Verificar sesión con el servidor
   */
  async verifySession() {
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'No hay token' };
      }

      const response = await fetchAPI('/debug/check-auth');
      return response;
    } catch (error) {
      console.error('❌ Error verificando sesión:', error);
      return {
        success: false,
        error: error.message || 'Sesión inválida o expirada'
      };
    }
  },

  /**
   * Actualizar perfil en el servidor y localStorage
   */
  async updateUserInfo(userData) {
    try {
      console.log('🔄 Actualizando perfil...', userData);
      
      const data = await fetchAPI('/profile/update', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      if (data.success && data.user) {
        const currentUser = this.getCurrentUser() || {};
        const updatedUser = {
          ...currentUser,
          ...data.user,
          tiendaNombre: userData.tiendaNombre ?? currentUser.tiendaNombre ?? 'Mi Tienda',
          tiendaDireccion: userData.tiendaDireccion ?? currentUser.tiendaDireccion,
          tiendaTelefono: userData.tiendaTelefono ?? currentUser.tiendaTelefono,
          tiendaRFC: userData.tiendaRFC ?? currentUser.tiendaRFC,
          tiendaMensajeTicket: userData.tiendaMensajeTicket ?? currentUser.tiendaMensajeTicket ?? '¡Gracias por su compra! Vuelva pronto :)'
        };

        // Actualizar en ambos lugares por compatibilidad
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Disparar evento para notificar a App.jsx
        window.dispatchEvent(new CustomEvent('userUpdated'));
        
        console.log('✅ Perfil actualizado correctamente');
      }

      return data;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error || { error: 'Error al actualizar perfil' };
    }
  },

  /**
   * Cambiar contraseña (si tienes esta ruta en el backend)
   */
  async changePassword(passwordData) {
    try {
      console.log('🔑 Cambiando contraseña...');
      const data = await fetchAPI('/profile/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      });
      console.log('✅ Contraseña cambiada');
      return data;
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error);
      throw error;
    }
  },

  /**
   * Obtener perfil fresco del servidor
   */
  async getProfile() {
    try {
      console.log('📥 Obteniendo perfil del servidor...');
      const data = await fetchAPI('/profile');
      
      if (data.success && data.user) {
        // Actualizar en ambos lugares por compatibilidad
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ Perfil sincronizado');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error;
    }
  },

  /**
   * Guardar token manualmente (para compatibilidad)
   */
  saveToken(token) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('token', token); // Backup
  },

  /**
   * Guardar usuario manualmente (para compatibilidad)
   */
  saveUser(user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user)); // Backup
  }
};

// ==================== SERVICIO DE PRODUCTOS ====================
export const productService = {
  async getAll() {
    try {
      const data = await fetchAPI('/products');
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      throw error;
    }
  },

  async create(productData) {
    try {
      const data = await fetchAPI('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      return data;
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      throw error;
    }
  },

  async update(id, productData) {
    try {
      const data = await fetchAPI(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      return data;
    } catch (error) {
      console.error('❌ Error actualizando producto:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const data = await fetchAPI(`/products/${id}`, {
        method: 'DELETE',
      });
      return data;
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      throw error;
    }
  },

  async updateStock(id, stock) {
    try {
      const data = await fetchAPI(`/products/${id}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ stock }),
      });
      return data;
    } catch (error) {
      console.error('❌ Error actualizando stock:', error);
      throw error;
    }
  }
};

// ==================== SERVICIO DE VENTAS ====================
export const saleService = {
  async create(saleData) {
    try {
      const data = await fetchAPI('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });
      return data;
    } catch (error) {
      console.error('❌ Error creando venta:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      const data = await fetchAPI('/sales');
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo ventas:', error);
      throw error;
    }
  },

  async getToday() {
    try {
      const data = await fetchAPI('/sales/today');
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo ventas de hoy:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      const data = await fetchAPI('/sales/stats');
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};

// ==================== SERVICIO DE DASHBOARD ====================
export const dashboardService = {
  async getStats() {
    try {
      const data = await fetchAPI('/dashboard/stats');
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del dashboard:', error);
      throw error;
    }
  },

  async getAlertas() {
    try {
      const data = await fetchAPI('/dashboard/alertas');
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo alertas:', error);
      throw error;
    }
  },

  async getMetodosPago(periodo = 'hoy') {
    try {
      const data = await fetchAPI(`/dashboard/metodos-pago?periodo=${periodo}`);
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo métodos de pago:', error);
      throw error;
    }
  }
};

// ==================== SERVICIO DE REPORTES ====================
export const reportService = {
  async generateSalesReport(reportData) {
    try {
      // Aquí implementarías la lógica para generar el reporte
      console.log('📊 Generando reporte de ventas:', reportData);
      
      // Esto es un placeholder - deberías implementar según tu backend
      const data = await fetchAPI('/sales/report/daily', {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error generando reporte:', error);
      throw error;
    }
  },

  async generateDetailedReport(reportData) {
    try {
      console.log('📋 Generando reporte detallado:', reportData);
      
      // Esto es un placeholder - deberías implementar según tu backend
      const data = await fetchAPI('/sales/report/detailed', {
        method: 'POST',
        body: JSON.stringify(reportData),
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error generando reporte detallado:', error);
      throw error;
    }
  }
};

// Exportar también el helper para otros servicios (productos, ventas, etc.)
export { fetchAPI, API_URL };