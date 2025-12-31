import React, { useState } from 'react';
import {
  IconBell,
  IconPackage,
  IconAlertTriangle,
  IconCheck,
  IconTrash,
  IconChecks,
  IconClock,
  IconX
} from '@tabler/icons-react';

const NotificationDropdown = ({
  notifications = [],
  onClose,
  onMarkAsRead,
  onClearAll,
  onMarkAllAsRead
}) => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'stock') return notification.type === 'stock';
    return true; // 'all'
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'stock':
        return <IconPackage className="text-warning-500" size={18} />;
      case 'warning':
        return <IconAlertTriangle className="text-warning-500" size={18} />;
      default:
        return <IconBell className="text-blue-500" size={18} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'stock':
        return 'bg-warning-100';
      case 'warning':
        return 'bg-red-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} d`;
    
    return new Date(timestamp).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-slide-down">
      {/* Header del dropdown */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IconBell className="text-gray-700 mr-2" size={20} />
            <h3 className="font-bold text-gray-900">Notificaciones</h3>
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <IconX size={18} className="text-gray-500" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex mt-4 space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === 'unread'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            No leídas
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === 'stock'
                ? 'bg-warning-100 text-warning-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Stock
          </button>
        </div>
      </div>
      
      {/* Lista de notificaciones */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <IconBell className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 font-medium">No hay notificaciones</p>
            <p className="text-sm text-gray-400 mt-1">
              {activeTab === 'all' 
                ? 'Todo está al día' 
                : activeTab === 'unread' 
                ? 'No hay notificaciones sin leer' 
                : 'No hay alertas de stock'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start">
                  {/* Icono */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    getNotificationColor(notification.type)
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      
                      {/* Estado y tiempo */}
                      <div className="flex items-center space-x-2 ml-2">
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        )}
                        <span className="text-xs text-gray-500 flex items-center">
                          <IconClock size={12} className="mr-1" />
                          {getTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Información específica para stock */}
                    {notification.type === 'stock' && (
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs">
                          <span className="font-medium">Stock actual: </span>
                          <span className="text-warning-600">{notification.stock}</span>
                          <span className="mx-1">•</span>
                          <span className="text-gray-500">Mínimo: {notification.minStock}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (notification.priority === 'high') {
                              const newStock = prompt(`¿Cuántas unidades de "${notification.productName}" quieres agregar?`, notification.minStock * 3);
                              if (newStock && !isNaN(newStock)) {
                                // Esto se manejará desde el componente padre
                                onClose();
                              }
                            }
                          }}
                          className={`text-xs px-3 py-1 rounded-lg ${
                            notification.priority === 'high'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-warning-100 text-warning-700 hover:bg-warning-200'
                          }`}
                        >
                          {notification.priority === 'high' ? 'Urgente!' : 'Reabastecer'}
                        </button>
                      </div>
                    )}
                    
                    {/* Acciones generales */}
                    <div className="flex justify-end mt-2 space-x-2">
                      {!notification.read && onMarkAsRead && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                          title="Marcar como leída"
                        >
                          <IconCheck size={12} className="mr-1" />
                          Leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer con acciones */}
      {filteredNotifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between">
            <button
              onClick={onMarkAllAsRead}
              disabled={filteredNotifications.filter(n => !n.read).length === 0}
              className={`px-3 py-1.5 text-sm rounded-lg flex items-center ${
                filteredNotifications.filter(n => !n.read).length === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary-600 hover:bg-primary-100'
              }`}
            >
              <IconChecks size={16} className="mr-1.5" />
              Marcar todas
            </button>
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center"
            >
              <IconTrash size={16} className="mr-1.5" />
              Limpiar todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;