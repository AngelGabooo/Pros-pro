// src/services/api.js

// ==================== CONFIGURACIÓN DE URL DEL BACKEND ====================
// En desarrollo: localhost
// En producción: la URL de tu backend desplegado (Render, Railway, etc.)
const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000/api';

// Eliminar barra final si existe, para evitar duplicados
const API_URL = API_BASE_URL.endsWith('/') 
  ? API_BASE_URL.slice(0, -1) 
  : API_BASE_URL;

console.log('🌍 API Base URL configurada:', API_URL);

// ==================== HELPER PARA OBTENER TOKEN ====================
const getToken = () => {
  return localStorage.getItem('token');
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
        
        // Guardar en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('tienda', data.user.databaseName || '');
        localStorage.setItem('lastLogin', new Date().toISOString());
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tienda');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('bankData');

    // Redirigir solo si no estamos ya en login
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  },

  /**
   * Verificar si está autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) return false;

    try {
      const userData = JSON.parse(user);
      return !!userData.id && !!userData.usuario;
    } catch {
      return false;
    }
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
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
    return localStorage.getItem('tienda') || null;
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

        localStorage.setItem('user', JSON.stringify(updatedUser));
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
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ Perfil sincronizado');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error;
    }
  }
};

// Exportar también el helper para otros servicios (productos, ventas, etc.)
export { fetchAPI, API_URL };