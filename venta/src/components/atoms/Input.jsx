import React, { useState } from 'react';

import {
  IconCurrencyDollar as IconDollarSign, // ← símbolo de dólar
  IconBarcode,
  IconSearch,
  IconTag,
  IconEye as IconEyeVisible,           // ← ojo abierto (mostrar contraseña)
  IconEyeOff as IconEyeHidden          // ← ojo tachado (ocultar contraseña)
} from '@tabler/icons-react';

const Input = ({
  type = 'text',
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  prefix,
  suffix,
  className = '',
  variant = 'default', // default, search, price, barcode
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const iconMap = {
    price: IconDollarSign,
    barcode: IconBarcode,
    search: IconSearch,
    tag: IconTag,
  };

  const IconComponent = iconMap[variant] || Icon;

  // Calcular padding izquierdo dinámico
  const getLeftPadding = () => {
    if (variant === 'search') return 'pl-4';
    
    let padding = 'pl-4';
    if (prefix) padding = 'pl-10';
    if (IconComponent && variant !== 'search') padding = 'pl-10';
    if (prefix && IconComponent) padding = 'pl-14';
    
    return padding;
  };

  // Calcular padding derecho dinámico
  const getRightPadding = () => {
    if (variant === 'search') return 'pr-12';
    
    let padding = 'pr-4';
    if (type === 'password') padding = 'pr-10';
    if (suffix) padding = 'pr-10';
    if ((type === 'password' && suffix) || (type === 'password' && variant === 'search')) {
      padding = 'pr-16';
    }
    
    return padding;
  };

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Prefijo (como símbolo de moneda $) */}
        {prefix && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium ${
            IconComponent && variant !== 'search' ? 'left-10' : ''
          }`}>
            {prefix}
          </div>
        )}
        
        {/* Icono (si existe) */}
        {IconComponent && variant !== 'search' && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
            prefix ? 'left-8' : ''
          }`}>
            <IconComponent size={20} />
          </div>
        )}
        
        {/* Input principal */}
        <input
          type={inputType}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full py-3 rounded-lg border
            ${getLeftPadding()}
            ${getRightPadding()}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
            }
            bg-white text-gray-900
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            placeholder:text-gray-400
            ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-70' : ''}
            ${className}
          `}
          {...props}
        />
        
        {/* Botón de búsqueda (solo para variant='search') */}
        {variant === 'search' && (
          <button
            type="button"
            className="absolute right-0 top-0 h-full px-4 flex items-center justify-center bg-primary-500 text-white rounded-r-lg hover:bg-primary-600 transition-colors"
          >
            <IconSearch size={18} />
          </button>
        )}
        
        {/* Sufijo (texto después del input) */}
        {suffix && variant !== 'search' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {suffix}
          </div>
        )}
        
        {/* Botón para mostrar/ocultar contraseña */}
        {type === 'password' && variant !== 'search' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
              suffix ? 'right-10' : 'right-3'
            }`}
          >
            {showPassword ? <IconEyeHidden size={20} /> : <IconEyeVisible size={20} />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;