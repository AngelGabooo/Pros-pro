// src/components/molecules/RegisterForm.jsx
import React, { useState } from 'react';
import FormField from './FormField';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert'; // ← Este es el Alert simple que ya usas
import {
  IconUser,
  IconPhone,
  IconMail,
  IconLock,
  IconBriefcase,
  IconUsers,
  IconBuildingBank
} from '@tabler/icons-react';

const RegisterForm = ({ onSubmit, loading = false, error = null, success = null, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    cargo: '',
    usuario: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
   
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
   
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'Mínimo 3 caracteres';
    }
   
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
   
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
   
    if (!formData.cargo) newErrors.cargo = 'El cargo es requerido';
   
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
   
    onSubmit(formData);
  };

  const cargos = ['Administrador', 'Gerente', 'Cajero', 'Almacén'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert type="error" title="Error en registro" message={error} />
      )}
     
      {success && (
        <Alert type="success" title="¡Empleado registrado!" message={success} />
      )}
     
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-pos mb-4">
          <IconUsers className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Registro de Nuevo Empleado</h2>
        <p className="text-gray-600 mt-2">Completa la información del empleado</p>
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          type="text"
          label="Nombre"
          name="nombre"
          placeholder="Juan"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
        />
       
        <FormField
          type="text"
          label="Apellido"
          name="apellido"
          placeholder="Pérez"
          value={formData.apellido}
          onChange={handleChange}
          error={errors.apellido}
          required
        />
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          type="tel"
          label="Teléfono"
          name="telefono"
          placeholder="+51 987654321"
          value={formData.telefono}
          onChange={handleChange}
          icon={IconPhone}
        />
       
        <FormField
          type="email"
          label="Email"
          name="email"
          placeholder="empleado@empresa.com"
          value={formData.email}
          onChange={handleChange}
          icon={IconMail}
        />
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cargo <span className="text-red-500">*</span>
          </label>
          <select
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border
              ${errors.cargo ? 'border-red-500' : 'border-gray-300'}
              bg-white text-gray-900
              focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
            `}
          >
            <option value="">Seleccionar cargo</option>
            {cargos.map((cargo) => (
              <option key={cargo} value={cargo}>{cargo}</option>
            ))}
          </select>
          {errors.cargo && (
            <p className="mt-2 text-sm text-red-500">{errors.cargo}</p>
          )}
        </div>
      </div>

      {/* ALERTA INFORMATIVA CLARA Y BONITA (SIN MODAL) */}
      <Alert type="info" className="my-6">
        <div className="flex items-start">
          <IconBuildingBank className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" size={22} />
          <div>
            <p className="font-semibold text-gray-900 mb-1">
              Datos bancarios para pagos por transferencia
            </p>
            <p className="text-sm text-gray-700">
              Por <strong>seguridad</strong>, los datos bancarios del empleado (banco, cuenta, CCI, etc.){' '}
              <strong>no se configuran en este formulario</strong>.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              El empleado podrá agregarlos o modificarlos de forma segura desde su{' '}
              <strong>perfil personal</strong> después de iniciar sesión por primera vez.
            </p>
          </div>
        </div>
      </Alert>
     
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Credenciales de Acceso</h3>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            type="text"
            label="Usuario"
            name="usuario"
            placeholder="juan.perez"
            value={formData.usuario}
            onChange={handleChange}
            error={errors.usuario}
            required
            description="Nombre de usuario para ingresar al sistema"
          />
         
          <div className="space-y-4">
            <FormField
              type="password"
              label="Contraseña"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={IconLock}
              required
            />
           
            <FormField
              type="password"
              label="Confirmar Contraseña"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={IconLock}
              required
            />
          </div>
        </div>
      </div>
     
      <div className="flex items-center pt-4">
        <input
          type="checkbox"
          id="terms"
          className="h-4 w-4 text-primary-500 focus:ring-primary-300 border-gray-300 rounded"
          required
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
          Confirmo que la información es correcta y autorizo el acceso al sistema
        </label>
      </div>
     
      <div className="flex space-x-4 pt-4">
        <Button
          type="submit"
          variant="success"
          size="lg"
          fullWidth
          loading={loading}
          icon={IconUser}
        >
          Registrar Empleado
        </Button>
       
        <Button
          type="button"
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => window.print()}
          icon={IconBriefcase}
        >
          Imprimir Credenciales
        </Button>
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-primary-500 hover:text-primary-600 cursor-pointer"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;