// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';
import AuthContainer from '../components/organisms/AuthContainer';
import Footer from '../components/organisms/Footer';
import { authService } from '../services/api';

const Register = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [authMode, setAuthMode] = useState('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleRegisterSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('📤 Enviando datos de registro real al backend:', formData);

      const userData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email?.trim() || `${formData.usuario.trim()}@tienda.com`,
        telefono: formData.telefono?.trim() || '',
        cargo: formData.cargo,
        usuario: formData.usuario.trim(),
        password: formData.password
      };

      console.log('📦 Datos estructurados para backend:', userData);

      const result = await authService.register(userData);

      if (result.success) {
        console.log('✅ Registro exitoso:', result);
        setSuccess('¡Usuario registrado exitosamente! Cambiando a login...');

        setTimeout(() => {
          setAuthMode('login');
          setSuccess(null);
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error completo en registro:', error);

      let errorMessage = 'Error al registrar usuario';
      if (error.error?.includes('ya existe') || error.message?.includes('ya existe')) {
        errorMessage = 'El nombre de usuario o email ya está en uso. Intenta con otro.';
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📤 Intentando login desde página de registro...');
      const result = await authService.login({
        username: formData.username.trim(),
        password: formData.password
      });

      if (result.success) {
        console.log('✅ Login exitoso desde registro');
        navigate('/pos');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError('Usuario o contraseña incorrectos');
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
            success={success}
          />
        </main>

        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Register;