import React from 'react';

const Card = ({ 
  children, 
  title,
  subtitle,
  className = '', 
  variant = 'default',
  hover = false,
  padding = 'p-6',
  shadow = 'card',
  border = true,
  fixedHeight = false,
  scrollable = false
}) => {
  const baseClasses = 'rounded-xl transition-all duration-200';
  
  const variants = {
    default: 'bg-white',
    light: 'bg-gray-50',
    primary: 'bg-primary-50 border border-primary-100',
    success: 'bg-success-50 border border-success-100',
  };
  
  const borderClass = border ? 'border border-gray-200' : '';
  const hoverClass = hover ? 'hover:shadow-hover hover:-translate-y-0.5' : '';
  const shadowClass = `shadow-${shadow}`;
  const heightClass = fixedHeight ? 'h-full flex flex-col' : '';
  const scrollClass = scrollable ? 'overflow-hidden' : '';
  
  return (
    <div className={`
      ${baseClasses}
      ${variants[variant]}
      ${borderClass}
      ${shadowClass}
      ${hoverClass}
      ${heightClass}
      ${scrollClass}
      ${padding}
      ${className}
    `}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={scrollable ? 'h-full overflow-y-auto' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;