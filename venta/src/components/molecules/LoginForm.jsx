// src/components/molecules/LoginForm.jsx
import React, { useState } from 'react';
import FormField from './FormField';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import { useNavigate } from 'react-router-dom';
import {
  IconKey,
  IconUser,
  IconLock,
  IconBuildingStore
} from '@tabler/icons-react';

const LoginForm = ({ onSubmit, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleGoToPricing = () => {
    navigate('/pricing');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert 
          type="error" 
          title="Error de acceso" 
          message={error}
        />
      )}
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-pos mb-4">
          <IconKey className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Acceso al Sistema</h2>
        <p className="text-gray-600 mt-2">Ingresa tus credenciales para continuar</p>
      </div>
      
      <FormField
        type="text"
        label="Usuario"
        name="username"
        placeholder="Ingresa tu usuario"
        value={formData.username}
        onChange={handleChange}
        icon={IconUser}
        required
      />
      
      <FormField
        type="password"
        label="Contraseña"
        name="password"
        placeholder="Ingresa tu contraseña"
        value={formData.password}
        onChange={handleChange}
        icon={IconLock}
        required
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 text-primary-500 focus:ring-primary-300 border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
            Recordar usuario
          </label>
        </div>
        
        <a 
          href="#forgot-password" 
          className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
      
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        icon={IconBuildingStore}
      >
        Ingresar al Sistema
      </Button>
      
      <div className="pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          ¿Primera vez en el sistema?{' '}
          <button
            type="button"
            onClick={handleGoToPricing}
            className="font-medium text-primary-500 hover:text-primary-600 cursor-pointer"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;