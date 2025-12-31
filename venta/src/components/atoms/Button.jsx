import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  rounded = 'lg'
}) => {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-300',
    success: 'bg-success-500 hover:bg-success-600 text-white focus:ring-success-300',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-300',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-300',
    light: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    xl: 'px-8 py-5 text-xl',
  };
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-[0.98]';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${roundedClasses[rounded]}
        ${widthClass}
        ${disabledClass}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          <span className="ml-2">Cargando...</span>
        </div>
      ) : (
        <>
          {Icon && <Icon className="mr-2" size={size === 'sm' ? 16 : 20} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;