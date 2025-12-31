import React, { useState } from 'react';
import Card from '../atoms/Card';
import LoginForm from '../molecules/LoginForm';
import RegisterForm from '../molecules/RegisterForm';

import {
  IconShoppingCart,
  IconBuildingStore
} from '@tabler/icons-react';

const AuthContainer = ({ 
  mode = 'login', 
  onModeChange, 
  onLoginSubmit,
  onRegisterSubmit,
  loading = false,
  error = null 
}) => {
  const [success, setSuccess] = useState(null);

  const handleLogin = async (formData) => {
    if (onLoginSubmit) {
      await onLoginSubmit(formData);
    }
  };

  const handleRegister = async (formData) => {
    if (onRegisterSubmit) {
      await onRegisterSubmit(formData);
    }
  };

  // Iconos para diferentes modos
  const authIcons = {
    login: IconShoppingCart,
    register: IconBuildingStore
  };
  const AuthIcon = authIcons[mode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - POS Info con logo personalizado */}
        <div className="flex flex-col justify-center items-center lg:items-start text-gray-800">
          {/* Logo personalizado grande */}
          <div className="mb-8 flex flex-col items-center lg:items-start">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src="/logo2.png"
                alt="POS Pro Logo"
                className="h-20 w-20 object-contain"
              />
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  <span className="text-primary-600">POS</span>Pro
                </h1>
                <p className="text-gray-600">Sistema de Punto de Venta</p>
              </div>
            </div>
          </div>
         
          <h2 className="text-4xl font-bold mb-4 text-center lg:text-left font-display">
            Sistema de Punto de Venta
          </h2>
         
          <p className="text-xl text-gray-600 mb-8 text-center lg:text-left">
            {mode === 'login'
              ? 'Controla tus ventas, inventario y más'
              : 'Gestiona el acceso de tu equipo'
            }
          </p>
         
          <div className="bg-white rounded-xl p-6 shadow-card w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Características principales
            </h3>
           
            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg bg-success-50">
                <div className="w-8 h-8 rounded-lg bg-success-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Ventas rápidas</h4>
                  <p className="text-sm text-gray-600">Procesa transacciones en segundos</p>
                </div>
              </div>
             
              <div className="flex items-center p-3 rounded-lg bg-primary-50">
                <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Control de inventario</h4>
                  <p className="text-sm text-gray-600">Gestión en tiempo real</p>
                </div>
              </div>
             
              <div className="flex items-center p-3 rounded-lg bg-warning-50">
                <div className="w-8 h-8 rounded-lg bg-warning-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Reportes detallados</h4>
                  <p className="text-sm text-gray-600">Análisis de ventas y métricas</p>
                </div>
              </div>
            </div>
           
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sistema activo</span>
                <span className="px-2 py-1 bg-success-100 text-success-800 rounded-full text-xs font-medium">
                  En línea
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Versión</span>
                <span className="font-medium">POS Pro 2.0</span>
              </div>
            </div>
          </div>
        </div>
       
        {/* Right Column - Auth Form con logo personalizado */}
        <div>
          <Card
            variant="default"
            hover
            className="relative overflow-hidden border-0 shadow-xl"
            padding="p-8"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-success-100 rounded-full opacity-50"></div>
           
            <div className="relative">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {mode === 'login' ? 'Ingreso al Sistema' : 'Registro de Empleado'}
                  </h3>
                  <p className="text-gray-600">
                    {mode === 'login'
                      ? 'Accede al panel de control'
                      : 'Agrega nuevo personal autorizado'
                    }
                  </p>
                </div>
               
                {/* Logo pequeño en formulario */}
                <div className="flex items-center">
                  <img
                    src="/logo2.png"
                    alt="POS Pro Logo"
                    className="h-10 w-10 object-contain"
                  />
                  <AuthIcon className="text-primary-500 ml-2" size={20} />
                </div>
              </div>
             
              {mode === 'login' ? (
                <LoginForm
                  onSubmit={handleLogin}
                  loading={loading}
                  error={error}
                  onSwitchToRegister={() => onModeChange('register')}
                />
              ) : (
                <RegisterForm
                  onSubmit={handleRegister}
                  loading={loading}
                  error={error}
                  success={success}
                  onSwitchToLogin={() => onModeChange('login')}
                />
              )}
             
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600">
                  {mode === 'login'
                    ? '¿Necesitas registrar un nuevo empleado? '
                    : '¿Ya tienes una cuenta? '
                  }
                 
                  <button
                    type="button"
                    onClick={() => {
                      onModeChange(mode === 'login' ? 'register' : 'login');
                    }}
                    className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    {mode === 'login' ? 'Registrar empleado' : 'Iniciar sesión'}
                  </button>
                </p>
              </div>
            </div>
          </Card>
         
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Sistema POS Pro v2.0 · {new Date().getFullYear()} ·{' '}
              <a href="#support" className="text-primary-500 hover:text-primary-600">
                Soporte Técnico
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;