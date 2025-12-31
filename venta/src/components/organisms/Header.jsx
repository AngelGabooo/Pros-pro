// src/components/organisms/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import NotificationDropdown from './NotificationDropdown';
import {
  IconCash,
  IconShoppingCart,
  IconPackage,
  IconUsers,
  IconChartBar,
  IconReceipt,
  IconMenu2,
  IconBell,
  IconUser,
  IconSettings,
  IconLogout,
  IconX,
  IconHome,
  IconChevronDown,
  IconUserCircle,
  IconKey,
  IconHistory,
  IconHelp
} from '@tabler/icons-react';

const Header = ({
  isAuthenticated = false,
  user,
  onLogout,
  onToggleSidebar = null,
  cartCount = 0,
  notifications = [],
  onClearNotifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calcular notificaciones no leídas
  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      const unread = notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    }
  }, [notifications]);

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
    setUserMenuOpen(false); // Cerrar menú de usuario si está abierto
  };

  const handleUserMenuClick = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationOpen(false); // Cerrar notificaciones si están abiertas
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    } else if (onMarkAsRead) {
      notifications.forEach(notification => {
        onMarkAsRead(notification.id);
      });
    }
  };

  const handleClearAll = () => {
    if (onClearNotifications) {
      onClearNotifications();
    }
    setNotificationOpen(false);
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    onLogout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/settings');
  };

  // Módulos del sistema POS
  const posModules = [
    { name: 'POS', icon: IconCash, href: '/pos' },
    { name: 'Ventas', icon: IconShoppingCart, href: '/sales' },
    { name: 'Productos', icon: IconPackage, href: '/products' },
    { name: 'Clientes', icon: IconUsers, href: '/clients' },
    { name: 'Reportes', icon: IconChartBar, href: '/reports' },
    { name: 'Inventario', icon: IconReceipt, href: '/inventory' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            {/* Botón de toggle para sidebar */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                aria-label="Menú"
              >
                <IconMenu2 size={20} className="text-gray-700" />
              </button>
            )}

            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center">
                <img
                  src="/logo2.png"
                  alt="POS Pro Logo"
                  className="h-12 w-12 object-contain"
                />
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">
                    <span className="text-primary-500">POS</span>Pro
                  </h1>
                  <p className="text-xs text-gray-500">Sistema de Punto de Venta</p>
                </div>
              </div>
            </Link>

            {/* Quick Stats - Solo cuando está autenticado */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-6 ml-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">En línea</span>
                </div>
                {notifications && notifications.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Alertas: <span className="font-semibold text-warning-600">{unreadCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Botón principal para ir al POS */}
                <Link to="/pos">
                  <Button variant="primary" size="sm" icon={IconCash}>
                    Ir al POS
                  </Button>
                </Link>

                {/* Cart Button */}
                <Link to="/pos" className="relative">
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <IconShoppingCart className="text-gray-700" size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </Link>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 rounded-lg hover:bg-gray-100"
                  >
                    <IconBell className="text-gray-700" size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-warning-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse-subtle">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown de Notificaciones */}
                  {notificationOpen && (
                    <NotificationDropdown
                      notifications={notifications}
                      onClose={() => setNotificationOpen(false)}
                      onMarkAsRead={onMarkAsRead}
                      onClearAll={handleClearAll}
                      onMarkAllAsRead={handleMarkAllAsRead}
                    />
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleUserMenuClick}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-gradient-pos flex items-center justify-center mr-2">
                        <IconUser size={14} className="text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.name || 'Usuario'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user?.role || 'Cargo'}
                        </div>
                      </div>
                      <IconChevronDown
                        size={16}
                        className={`text-gray-500 ml-2 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Dropdown del Usuario */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                      {/* Header del dropdown */}
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-gradient-pos flex items-center justify-center mr-3">
                            <IconUser size={18} className="text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user?.name || 'Usuario'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user?.email || 'correo@ejemplo.com'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Opciones del menú */}
                      <div className="p-2">
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
                        >
                          <IconUserCircle className="mr-3" size={18} />
                          <span>Mi Perfil</span>
                        </button>

                        <button
                          onClick={handleSettingsClick}
                          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
                        >
                          <IconSettings className="mr-3" size={18} />
                          <span>Configuración</span>
                        </button>

                        <button
                          onClick={() => navigate('/dashboard')}
                          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-1"
                        >
                          <IconHistory className="mr-3" size={18} />
                          <span>Historial</span>
                        </button>

                        <button
                          onClick={() => navigate('/help')}
                          className="flex items-center w-full px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg mb-1"
                        >
                          <IconHelp className="mr-3" size={18} />
                          <span>Ayuda y Soporte</span>
                          <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                            Nuevo
                          </span>
                        </button>

                        {/* Divider */}
                        <hr className="my-2 border-gray-200" />

                        {/* Cambiar contraseña */}
                        <button
                          onClick={() => navigate('/change-password')}
                          className="flex items-center w-full px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg mb-1"
                        >
                          <IconKey className="mr-3" size={18} />
                          <span>Cambiar Contraseña</span>
                        </button>

                        {/* Divider */}
                        <hr className="my-2 border-gray-200" />

                        {/* Cerrar sesión */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <IconLogout className="mr-3" size={18} />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/features">
                  <Button variant="ghost" size="sm">
                    Características
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="ghost" size="sm">
                    Precios
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Ingresar
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            {isAuthenticated && cartCount > 0 && (
              <Link to="/pos" className="relative">
                <button className="p-2">
                  <IconShoppingCart className="text-gray-700" size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Menú"
            >
              {mobileMenuOpen ? (
                <IconX size={24} className="text-gray-700" />
              ) : (
                <IconMenu2 size={24} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            {isAuthenticated ? (
              <div className="space-y-4">
                {/* Información del usuario en móvil */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-gradient-pos flex items-center justify-center mr-3">
                    <IconUser size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.role}</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                  </div>
                </div>

                {/* Botón para ver perfil en móvil */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <IconUserCircle className="mr-3" size={18} />
                  <span>Ver Mi Perfil</span>
                </button>

                {/* Notificaciones en móvil */}
                {notifications && notifications.length > 0 && (
                  <div className="p-3 bg-warning-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <IconBell className="text-warning-600 mr-2" size={16} />
                        <span className="font-medium text-warning-800">
                          {unreadCount} alertas
                        </span>
                      </div>
                      <span className="text-xs text-warning-600">
                        Stock bajo
                      </span>
                    </div>
                    <p className="text-xs text-warning-700">
                      Revisa los productos que necesitan reabastecimiento
                    </p>
                  </div>
                )}

                {/* Botón principal para POS en móvil */}
                <Link to="/pos" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth icon={IconCash}>
                    Ir al Punto de Venta
                  </Button>
                </Link>

                {/* Módulos del sistema en móvil */}
                <div className="grid grid-cols-3 gap-2">
                  {posModules.slice(1).map((module, index) => (
                    <Link
                      key={index}
                      to={module.href}
                      className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {module.icon && (
                        <module.icon
                          className="text-gray-700 mb-1"
                          size={20}
                        />
                      )}
                      <span className="text-xs text-gray-700">
                        {module.name}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Sección de configuración en móvil */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <button
                      onClick={handleSettingsClick}
                      className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <IconSettings className="mr-3" size={18} />
                      <span>Configuración</span>
                    </button>

                    <button
                      onClick={() => navigate('/help')}
                      className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <IconHelp className="mr-3" size={18} />
                      <span>Ayuda y Soporte</span>
                    </button>

                    <button
                      onClick={() => navigate('/activity')}
                      className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <IconHistory className="mr-3" size={18} />
                      <span>Historial</span>
                    </button>
                  </div>
                </div>

                {/* Cerrar sesión en móvil */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={handleLogout}
                    icon={IconLogout}
                    className="text-red-500 hover:text-red-700 hover:border-red-300"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/features"
                  className="block text-gray-700 hover:text-primary-500 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Características
                </Link>
                <Link
                  to="/pricing"
                  className="block text-gray-700 hover:text-primary-500 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Precios
                </Link>

                <div className="pt-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" fullWidth>
                      Ingresar
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;