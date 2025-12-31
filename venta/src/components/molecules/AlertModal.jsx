import React, { useEffect } from 'react';
import { IconCheck, IconAlertCircle, IconInfoCircle, IconX } from '@tabler/icons-react';

const AlertModal = ({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  autoClose = 3000,
  showCloseButton = true 
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: IconCheck,
      iconColor: 'text-success-500',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      titleColor: 'text-success-800'
    },
    error: {
      icon: IconX,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800'
    },
    warning: {
      icon: IconAlertCircle,
      iconColor: 'text-warning-500',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      titleColor: 'text-warning-800'
    },
    info: {
      icon: IconInfoCircle,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-800'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay con blur */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal de alerta */}
      <div className={`relative w-full max-w-md ${config.bgColor} rounded-2xl border ${config.borderColor} shadow-2xl transform transition-all duration-300 animate-in zoom-in-95`}>
        <div className="p-6">
          <div className="flex items-start">
            {/* Icono */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${config.iconColor.replace('text-', 'bg-')} bg-opacity-10 mr-4`}>
              <Icon size={24} className={config.iconColor} />
            </div>
            
            {/* Contenido */}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className={`text-lg font-bold mb-2 ${config.titleColor}`}>
                  {title}
                </h3>
              )}
              
              {typeof message === 'string' ? (
                <p className="text-gray-700 whitespace-pre-line">{message}</p>
              ) : (
                <div className="text-gray-700">{message}</div>
              )}
            </div>
            
            {/* Botón de cerrar */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar"
              >
                <IconX size={20} />
              </button>
            )}
          </div>
          
          {/* Barra de progreso para auto-close */}
          {autoClose && (
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${config.iconColor.replace('text-', 'bg-')} transition-all duration-${autoClose} ease-linear`}
                style={{ 
                  animation: `shrink ${autoClose}ms linear forwards`,
                  transformOrigin: 'left center'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;