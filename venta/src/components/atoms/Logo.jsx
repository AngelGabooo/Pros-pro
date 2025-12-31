import React from 'react';
import { FaCashRegister, FaShoppingCart, FaStore } from 'react-icons/fa';

const Logo = ({ 
  size = 'md', 
  variant = 'default', 
  withText = true,
  iconType = 'register',
  className = '' 
}) => {
  const sizes = {
    sm: { container: 'h-8 w-8', icon: 16, text: 'text-lg' },
    md: { container: 'h-12 w-12', icon: 24, text: 'text-xl' },
    lg: { container: 'h-16 w-16', icon: 32, text: 'text-2xl' },
    xl: { container: 'h-24 w-24', icon: 48, text: 'text-4xl' },
  };

  const icons = {
    register: FaCashRegister,
    cart: FaShoppingCart,
    store: FaStore,
  };

  const Icon = icons[iconType];
  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`
        ${sizeConfig.container} 
        rounded-xl
        bg-gradient-pos
        flex items-center justify-center
        shadow-md
      `}>
        <Icon className="text-white" size={sizeConfig.icon} />
      </div>
      
      {withText && (
        <div className="ml-3">
          <h1 className={`
            font-display font-bold 
            ${sizeConfig.text}
            text-gray-900
          `}>
            POS<span className="text-primary-500">Pro</span>
          </h1>
          <p className={`
            text-xs text-gray-500
          `}>
            Punto de Venta
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;