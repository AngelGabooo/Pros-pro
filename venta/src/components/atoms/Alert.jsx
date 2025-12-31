// src/components/atoms/Alert.jsx
import React from 'react';
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconAlertTriangleFilled,
  IconInfoCircleFilled,
  IconCash,
  IconReceipt,
  IconX
} from '@tabler/icons-react';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  children,        // ← Añadido para contenido personalizado
  onClose,
  dismissible = true,
  icon: CustomIconComponent
}) => {
  const variants = {
    success: {
      bg: 'bg-success-50',
      border: 'border-success-200',
      defaultIcon: <IconCircleCheckFilled className="text-success-500" size={20} />,
      titleColor: 'text-success-800',
      textColor: 'text-success-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      defaultIcon: <IconCircleXFilled className="text-red-500" size={20} />,
      titleColor: 'text-red-800',
      textColor: 'text-red-700'
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-200',
      defaultIcon: <IconAlertTriangleFilled className="text-warning-500" size={20} />,
      titleColor: 'text-warning-800',
      textColor: 'text-warning-700'
    },
    info: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      defaultIcon: <IconInfoCircleFilled className="text-primary-500" size={20} />,
      titleColor: 'text-primary-800',
      textColor: 'text-primary-700'
    },
    sale: {
      bg: 'bg-gradient-to-r from-success-50 to-primary-50',
      border: 'border-success-200',
      defaultIcon: <IconCash className="text-success-500" size={20} />,
      titleColor: 'text-success-800',
      textColor: 'text-success-700'
    },
    receipt: {
      bg: 'bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10',
      border: 'border-accent-cyan',
      defaultIcon: <IconReceipt className="text-accent-purple" size={20} />,
      titleColor: 'text-accent-purple',
      textColor: 'text-gray-700'
    }
  };

  const variant = variants[type] || variants.info;

  // Icono: prioridad → CustomIconComponent → defaultIcon
  const iconToRender = CustomIconComponent ? (
    <CustomIconComponent 
      size={20} 
      className={variant.textColor.replace('700', '500').replace('800', '500')} 
    />
  ) : variant.defaultIcon;

  return (
    <div className={`
      ${variant.bg} ${variant.border}
      border rounded-lg p-4 mb-4
      animate-slide-up
    `}>
      <div className="flex items-start">
        {/* Icono */}
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {iconToRender}
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1">
          {/* Título si existe */}
          {title && (
            <h3 className={`font-semibold ${variant.titleColor} mb-2`}>
              {title}
            </h3>
          )}
          
          {/* Contenido personalizado (children) tiene prioridad */}
          {children ? (
            <div className="text-sm text-gray-700">
              {children}
            </div>
          ) : message ? (
            /* Si no hay children, usar message simple */
            <p className={`text-sm ${variant.textColor}`}>
              {message}
            </p>
          ) : null}
        </div>
        
        {/* Botón cerrar */}
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar alerta"
          >
            <IconX size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;