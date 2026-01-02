// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';
import AuthContainer from '../components/organisms/AuthContainer';
import Footer from '../components/organisms/Footer';
import { authService } from '../services/api';

const Login = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  const handleLoginSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Intentando login con datos:', {
        username: formData.username,
        password: formData.password ? '***' : 'vacío'
      });

      const result = await authService.login({
        username: formData.username.trim(),
        password: formData.password
      });

      if (result.success) {
        console.log('Login exitoso, redirigiendo...');
        
        // IMPORTANTE: Forzar una actualización del estado global
        window.dispatchEvent(new CustomEvent('userLogin', {
          detail: { user: result.user }
        }));
        
        // Navegación con un pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
          navigate('/pos', { replace: true });
        }, 50);
      }
    } catch (error) {
      console.error('Error completo en login:', error);

      let errorMessage = 'Usuario o contraseña incorrectos';
      if (error.status === 403) errorMessage = 'Usuario inactivo o suspendido';
      else if (error.status === 0 || error.isOffline) errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión.';
      else if (error.error || error.message) errorMessage = error.error || error.message;

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const userData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email?.trim() || '',
        telefono: formData.telefono?.trim() || '',
        dni: formData.dni?.trim() || '',
        cargo: formData.cargo,
        usuario: formData.usuario.trim(),
        password: formData.password,
        sucursal: formData.sucursal?.trim() || 'Principal'
      };

      const result = await authService.register(userData);

      if (result.success) {
        setAuthMode('login');
        setError(null);
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
      }
    } catch (error) {
      console.error('Error en registro desde login:', error);
      setError(error.error || error.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col">
        <Header isAuthenticated={false} onThemeToggle={handleThemeToggle} darkMode={darkMode} />
        <main className="flex-grow">
          <AuthContainer
            mode={authMode}
            onModeChange={setAuthMode}
            onLoginSubmit={handleLoginSubmit}
            onRegisterSubmit={handleRegisterSubmit}
            loading={loading}
            error={error}
          />
        </main>
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Login;