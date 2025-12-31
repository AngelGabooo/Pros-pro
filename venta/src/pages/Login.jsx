// src/pages/Login.jsx CORREGIDO
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';
import AuthContainer from '../components/organisms/AuthContainer';
import Footer from '../components/organisms/Footer';
import { authService } from '../services/api';

const Login = ({ onLogin }) => { // <-- Asegúrate de recibir onLogin como prop
  const [darkMode, setDarkMode] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLoginSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📤 Intentando login con datos:', {
        username: formData.username,
        password: formData.password ? '***' : 'vacío'
      });
      
      const result = await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      if (result.success) {
        console.log('✅ Login exitoso, llamando onLogin...');
        
        // IMPORTANTE: Llamar a onLogin para actualizar App.js
        if (typeof onLogin === 'function') {
          onLogin(); // Esto actualiza el estado en App.js
        } else {
          console.error('❌ onLogin no es una función:', onLogin);
        }
        
        // Redirigir al POS
        console.log('🔄 Redirigiendo a /pos...');
        navigate('/pos');
      }
    } catch (error) {
      console.error('❌ Error completo en login:', error);
      
      let errorMessage = error.error || error.message || 'Error al iniciar sesión';
      
      if (error.status === 401) {
        errorMessage = 'Usuario o contraseña incorrectos';
      } else if (error.status === 403) {
        errorMessage = 'Usuario inactivo o suspendido';
      } else if (error.status === 0) {
        errorMessage = 'No se puede conectar al servidor. Verifica que esté corriendo en http://localhost:5000';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepara los datos para el backend
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email || '',
        telefono: formData.telefono || '',
        dni: formData.dni || '',
        cargo: formData.cargo,
        usuario: formData.usuario,
        password: formData.password,
        sucursal: formData.sucursal || ''
      };
      
      console.log('📤 Enviando registro:', userData);
      
      const result = await authService.register(userData);
      
      if (result.success) {
        // Cambiar a modo login después de registro exitoso
        setAuthMode('login');
        setError(null);
        alert('✅ Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      setError(error.error || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col">
        <Header 
          isAuthenticated={false}
          onThemeToggle={handleThemeToggle}
          darkMode={darkMode}
        />
        
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
        
        <Footer />
      </div>
    </div>
  );
};

export default Login;