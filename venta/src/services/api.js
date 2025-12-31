// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Helper para obtener el token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token && !endpoint.includes('/register') && !endpoint.includes('/login')) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(`📡 API Request: ${endpoint}`, { method: options.method || 'GET' });

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include'
    });
    const contentType = response.headers.get('content-type');

    // Verificar si la respuesta es JSON
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Respuesta no válida del servidor: ${text.substring(0, 100)}`);
    }
    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error ${response.status}:`, data);
      throw {
        status: response.status,
        message: data.error || 'Error del servidor',
        data
      };
    }

    return data;
  } catch (error) {
    console.error(`❌ Fetch error para ${endpoint}:`, error);

    // Si es un error de red
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw {
        status: 0,
        message: 'No se pudo conectar al servidor. Verifica que esté corriendo en http://localhost:5000',
        data: null
      };
    }

    throw error;
  }
};

export const authService = {
  /**
   * Registro de nuevo usuario
   */
  async register(userData) {
    try {
      console.log('👤 Registrando nuevo usuario...', { usuario: userData.usuario });

      const data = await fetchAPI('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      console.log('✅ Usuario registrado exitosamente');

      return data;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      throw error || { error: 'Error de conexión' };
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

        // Guardar token y usuario en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Guardar también información adicional para debug
        localStorage.setItem('tienda', data.user.databaseName);
        localStorage.setItem('lastLogin', new Date().toISOString());
      }

      return data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error || { error: 'Error de conexión' };
    }
  },

  /**
   * Logout
   */
  logout() {
    console.log('👋 Realizando logout...');

    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tienda');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('bankData'); // opcional: limpiar también datos bancarios

    // Opcional: redirigir a login
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  },

  /**
   * Verificar si está autenticado
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      return false;
    }

    // Verificación básica
    try {
      const userData = JSON.parse(user);
      return !!userData.id;
    } catch {
      return false;
    }
  },

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;

      const user = JSON.parse(userStr);
      return user;
    } catch (error) {
      console.error('❌ Error al leer usuario de localStorage:', error);
      return null;
    }
  },

  /**
   * Obtener información de la tienda actual
   */
  getCurrentTienda() {
    try {
      const tienda = localStorage.getItem('tienda');
      return tienda || null;
    } catch (error) {
      console.error('❌ Error al leer tienda:', error);
      return null;
    }
  },

  /**
   * Verificar sesión con el servidor
   */
  async verifySession() {
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'No autenticado' };
      }
      const response = await fetchAPI('/debug/check-auth', {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('❌ Error verificando sesión:', error);
      return {
        success: false,
        error: error.message || 'Error de autenticación'
      };
    }
  },

  /**
   * Actualizar información del perfil del usuario en el servidor
   */
  async updateUserInfo(userData) {
    try {
      console.log('🔄 Enviando actualización de perfil al servidor...', userData);

      const data = await fetchAPI('/profile/update', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      if (data.success && data.user) {
        console.log('✅ Perfil actualizado en el servidor y en localStorage');

        // Obtener usuario actual para preservar campos que no vengan en la respuesta
        const currentUser = this.getCurrentUser() || {};

        const updatedUser = {
          ...currentUser,
          ...data.user,
          // Conservar/actualizar datos específicos de la tienda
          tiendaNombre: userData.tiendaNombre ?? currentUser.tiendaNombre,
          tiendaDireccion: userData.tiendaDireccion ?? currentUser.tiendaDireccion,
          tiendaTelefono: userData.tiendaTelefono ?? currentUser.tiendaTelefono,
          tiendaRFC: userData.tiendaRFC ?? currentUser.tiendaRFC,
          tiendaMensajeTicket: userData.tiendaMensajeTicket ?? currentUser.tiendaMensajeTicket
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Guardar datos bancarios por separado si se enviaron
        if (userData.banco || userData.tipoCuenta || userData.numeroCuenta) {
          localStorage.setItem('bankData', JSON.stringify({
            banco: userData.banco,
            tipoCuenta: userData.tipoCuenta,
            numeroCuenta: userData.numeroCuenta,
            cci: userData.cci,
            titularCuenta: userData.titularCuenta,
            monedaCuenta: userData.monedaCuenta
          }));
        }
      }

      return data;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error || { error: 'Error de conexión' };
    }
  },

  /**
   * Cambiar contraseña
   */
  async changePassword(passwordData) {
    try {
      console.log('🔑 Cambiando contraseña...');

      const data = await fetchAPI('/profile/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      });

      console.log('✅ Contraseña cambiada exitosamente');
      return data;
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error);
      throw error || { error: 'Error de conexión' };
    }
  },

  /**
   * Obtener perfil actualizado desde el servidor
   */
  async getProfile() {
    try {
      console.log('📥 Obteniendo perfil actualizado del servidor...');

      const data = await fetchAPI('/profile');

      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ Perfil sincronizado con el servidor');
      }

      return data;
    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error);
      throw error || { error: 'No autorizado' };
    }
  }
};

// Exportar helper fetchAPI para uso en otros servicios
export { fetchAPI };