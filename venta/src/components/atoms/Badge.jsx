// src/components/atoms/Badge.jsx
import React from 'react';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-all';
  
  const variants = {
    primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    success: 'bg-success-100 text-success-700 hover:bg-success-200',
    warning: 'bg-warning-100 text-warning-700 hover:bg-warning-200',
    danger: 'bg-danger-100 text-danger-700 hover:bg-danger-200',
    info: 'bg-info-100 text-info-700 hover:bg-info-200',
    accent: 'bg-accent-purple-100 text-accent-purple-700 hover:bg-accent-purple-200',
    gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    light: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
  };
  
  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  return (
    <span 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;