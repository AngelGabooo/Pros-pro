// src/components/atoms/Loader.jsx
import React from 'react';

// Si no tienes react-icons instalado, vamos a crear iconos personalizados
const CashRegisterIcon = ({ size = 24, className = "" }) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="6" y1="9" x2="18" y2="9" />
    <line x1="6" y1="13" x2="18" y2="13" />
    <line x1="6" y1="17" x2="12" y2="17" />
    <circle cx="16" cy="17" r="1" />
  </svg>
);

const ReceiptIcon = ({ size = 24, className = "" }) => (
  <svg 
    className={className}
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M6 2v20l3-2 3 2 3-2 3 2V2H6z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="15" y2="11" />
    <line x1="9" y1="15" x2="13" y2="15" />
  </svg>
);

const Loader = ({ 
  type = 'spinner', 
  size = 'md', 
  color = 'primary', 
  fullScreen = false,
  text = 'Procesando...',
  className = '',
  posTheme = false
}) => {
  const sizeClasses = {
    sm: { loader: 'h-4 w-4', text: 'text-sm', icon: 16 },
    md: { loader: 'h-8 w-8', text: 'text-base', icon: 24 },
    lg: { loader: 'h-12 w-12', text: 'text-lg', icon: 32 },
    xl: { loader: 'h-16 w-16', text: 'text-xl', icon: 48 },
  };

  const colorClasses = {
    primary: 'border-primary-500 text-primary-500',
    success: 'border-success-500 text-success-500',
    warning: 'border-warning-500 text-warning-500',
    white: 'border-white text-white',
  };

  // Clases para colores en Tailwind (evitar interpolación dinámica)
  const getColorClass = (colorName) => {
    switch(colorName) {
      case 'primary': return 'text-primary-500';
      case 'success': return 'text-success-500';
      case 'warning': return 'text-warning-500';
      case 'white': return 'text-white';
      default: return 'text-primary-500';
    }
  };

  const sizeConfig = sizeClasses[size];

  const spinner = (
    <div className={`${sizeConfig.loader} animate-spin rounded-full border-2 ${colorClasses[color]} border-t-transparent`}></div>
  );

  const pulse = (
    <div className={`${sizeConfig.loader} animate-pulse rounded-full ${color === 'primary' ? 'bg-primary-500' : 
                     color === 'success' ? 'bg-success-500' : 
                     color === 'warning' ? 'bg-warning-500' : 
                     'bg-primary-500'} opacity-75`}></div>
  );

  const posIcons = (
    <div className="relative">
      <CashRegisterIcon 
        className={`animate-pulse-slow ${getColorClass(color)}`} 
        size={sizeConfig.icon} 
      />
      <ReceiptIcon 
        className={`absolute top-0 left-0 animate-bounce-slow ${color === 'primary' ? 'text-success-500' : 'text-primary-500'}`} 
        size={sizeConfig.icon * 0.6} 
      />
    </div>
  );

  const loaders = {
    spinner,
    pulse,
    pos: posIcons
  };

  const loader = posTheme ? posIcons : loaders[type];

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-50">
        <div className={`${className} flex flex-col items-center`}>
          {loader}
          {text && (
            <p className={`mt-4 font-medium text-gray-700 ${sizeConfig.text}`}>
              {text}
            </p>
          )}
          {posTheme && (
            <p className="mt-2 text-sm text-gray-500">
              Sistema de Punto de Venta
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {loader}
      {text && (
        <p className={`mt-2 ${sizeConfig.text} text-gray-600`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;