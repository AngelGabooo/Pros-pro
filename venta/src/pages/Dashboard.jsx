// src/pages/Dashboard.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Loader from '../components/atoms/Loader';
import Input from '../components/atoms/Input';
import Alert from '../components/atoms/Alert';
import { authService } from '../services/api';
import { dashboardService } from '../services/dashboardService';
import { reportService } from '../services/reportService';
import {
  IconCashRegister,
  IconShoppingCart,
  IconUsers,
  IconCreditCard,
  IconArrowRight,
  IconBuilding,
  IconCalendar,
  IconRefresh,
  IconSearch,
  IconPrinter,
  IconChartBar,
  IconReceipt,
  IconSettings,
  IconChartLine,
  IconMoneybag,
  IconCurrencyDollar,
  IconTags,
  IconPackage,
  IconBell,
  IconPackageImport,
  IconUser as IconUserTie,
  IconTrendingUp,
  IconTrendingDown,
  IconShoppingBag,
  IconPercentage,
  IconClock,
  IconCheck,
  IconAlertCircle,
  IconDownload,
  IconFileText,
  IconCalendar as IconCalendarEvent
} from '@tabler/icons-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ventas');
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [isSidebarFixed, setIsSidebarFixed] = useState(false);
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);
  const parentRef = useRef(null);

  // Cargar usuario desde authService (siempre actualizado)
  useEffect(() => {
    const loadUser = () => {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      } else {
        authService.logout();
        navigate('/login');
      }
    };

    loadUser();

    // Escuchar cambios en el usuario (desde Profile, login, etc.)
    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, [navigate]);

  // Efecto para sidebar fijo CORREGIDO
  useEffect(() => {
    if (!sidebarRef.current || !parentRef.current) return;

    const sidebar = sidebarRef.current;
    const parent = parentRef.current;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const parentOffsetTop = parent.offsetTop;
      const parentHeight = parent.offsetHeight;
      const sidebarHeight = sidebar.offsetHeight;
      const headerHeight = 80; // Altura del header
      
      // Calcular cuándo fijar el sidebar
      const shouldFix = scrollPosition > parentOffsetTop - headerHeight;
      
      if (shouldFix) {
        // Verificar que no se salga del contenedor padre
        const maxScroll = parentOffsetTop + parentHeight - sidebarHeight - headerHeight - 30;
        
        if (scrollPosition <= maxScroll) {
          if (!isSidebarFixed) {
            setIsSidebarFixed(true);
            sidebar.style.position = 'fixed';
            sidebar.style.top = `${headerHeight}px`;
            sidebar.style.width = `${sidebar.offsetWidth}px`;
          }
        } else {
          // Cuando llegue al fondo, dejar que se desplace con el contenido
          if (isSidebarFixed) {
            setIsSidebarFixed(false);
            sidebar.style.position = 'absolute';
            sidebar.style.top = 'auto';
            sidebar.style.bottom = '0';
          }
        }
      } else {
        // Restaurar posición original
        if (isSidebarFixed) {
          setIsSidebarFixed(false);
          sidebar.style.position = 'relative';
          sidebar.style.top = 'auto';
          sidebar.style.bottom = 'auto';
          sidebar.style.width = 'auto';
        }
      }
    };

    // Agregar margen inferior al contenido principal cuando el sidebar está fijo
    const updateMainContentMargin = () => {
      if (mainContentRef.current && sidebarRef.current) {
        if (isSidebarFixed) {
          mainContentRef.current.style.marginBottom = `${sidebarRef.current.offsetHeight}px`;
        } else {
          mainContentRef.current.style.marginBottom = '0';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar inicialmente
    updateMainContentMargin();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sidebarRef.current) {
        sidebarRef.current.style.position = 'relative';
        sidebarRef.current.style.top = 'auto';
        sidebarRef.current.style.width = 'auto';
      }
      if (mainContentRef.current) {
        mainContentRef.current.style.marginBottom = '0';
      }
    };
  }, [isSidebarFixed]);

  // Ajustar tamaño del sidebar cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (sidebarRef.current && isSidebarFixed) {
        sidebarRef.current.style.width = `${sidebarRef.current.parentElement.offsetWidth}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarFixed]);

  // Cargar datos del dashboard cuando haya usuario
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    }
  }, [currentUser]);

  // Auto-refresh cada 15 segundos + eventos
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      loadDashboardData(true); // refresh silencioso
    }, 15000);

    const handleUpdates = () => {
      loadDashboardData();
    };

    window.addEventListener('saleCompleted', handleUpdates);
    window.addEventListener('stockUpdated', handleUpdates);

    return () => {
      clearInterval(interval);
      window.removeEventListener('saleCompleted', handleUpdates);
      window.removeEventListener('stockUpdated', handleUpdates);
    };
  }, [currentUser]);

  const loadDashboardData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await dashboardService.getStats();
      if (response.success) {
        setStats(response.stats);
      } else {
        setError('Error al cargar datos del dashboard');
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('No se pudieron cargar los datos. Verifica tu conexión.');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    setLoading(true);
    authService.logout();
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const handleGenerateReport = async () => {
    if (!stats || !currentUser) {
      Alert.error('Error', 'No hay datos para generar el reporte');
      return;
    }

    setGeneratingReport(true);
    try {
      const reportData = {
        usuario: currentUser,
        fecha: new Date().toLocaleDateString('es-PE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        turno: getCurrentShift(),
        ventasHoy: stats.ventasHoy || { monto: 0, cantidad: 0 },
        productosVendidosHoy: stats.productosVendidosHoy || 0,
        ventasRecientes: stats.ventasRecientes || [],
        productosMasVendidos: stats.productosMasVendidos || []
      };

      await reportService.generateSalesReport(reportData);
    } catch (error) {
      console.error('Error generando reporte:', error);
      Alert.error('Error', 'No se pudo generar el reporte');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDownloadDetailedReport = async () => {
    if (!stats || !currentUser) {
      Alert.error('Error', 'No hay datos para el reporte');
      return;
    }

    setGeneratingReport(true);
    try {
      const reportData = {
        usuario: currentUser,
        estadisticas: {
          ventasTotales: stats.ventasHoy?.monto || 0,
          transacciones: stats.ventasHoy?.cantidad || 0,
          productosVendidos: stats.productosVendidosHoy || 0,
          clientesAtendidos: stats.clientesAtendidosHoy || 0,
          stockBajo: stats.productosStockBajo || 0
        },
        ventasDetalladas: stats.ventasRecientes || [],
        productosTop: stats.productosMasVendidos || [],
        metodosPago: stats.metodosPagoHoy || []
      };

      await reportService.generateDetailedReport(reportData);
    } catch (error) {
      console.error('Error descargando reporte:', error);
      Alert.error('Error', 'No se pudo generar el reporte detallado');
    } finally {
      setGeneratingReport(false);
    }
  };

  const getCurrentShift = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'Mañana';
    if (hour >= 14 && hour < 22) return 'Tarde';
    return 'Noche';
  };

  const getUserInitials = () => {
    if (currentUser?.nombre && currentUser?.apellido) {
      return `${currentUser.nombre.charAt(0)}${currentUser.apellido.charAt(0)}`.toUpperCase();
    }
    return currentUser?.usuario?.charAt(0).toUpperCase() || 'U';
  };

  const getRoleBadgeColor = (cargo) => {
    switch (cargo) {
      case 'Administrador': return 'bg-red-100 text-red-800';
      case 'Gerente': return 'bg-purple-100 text-purple-800';
      case 'Supervisor': return 'bg-blue-100 text-blue-800';
      case 'Cajero': return 'bg-green-100 text-green-800';
      case 'Almacén': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const mainStats = stats ? [
    {
      label: 'Ventas Hoy',
      value: formatCurrency(stats.ventasHoy.monto),
      icon: IconCashRegister,
      change: '+12.5%',
      changePositive: true,
      color: 'bg-success-500',
      details: `${stats.ventasHoy.cantidad} transacciones`,
      link: '/sales'
    },
    {
      label: 'Productos Vendidos',
      value: stats.productosVendidosHoy.toString(),
      icon: IconShoppingCart,
      change: '+8%',
      changePositive: true,
      color: 'bg-primary-500',
      details: 'Unidades vendidas hoy',
      link: '/products'
    },
    {
      label: 'Clientes Atendidos',
      value: stats.clientesAtendidosHoy.toString(),
      icon: IconUsers,
      change: '+5%',
      changePositive: true,
      color: 'bg-accent-purple',
      details: 'Clientes únicos hoy',
      link: '/clients'
    },
    {
      label: 'Stock Bajo',
      value: stats.productosStockBajo.toString(),
      icon: IconAlertCircle,
      change: '',
      changePositive: false,
      color: 'bg-warning-500',
      details: 'Necesitan reabastecimiento',
      link: '/inventory'
    }
  ] : [];

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader
          type="pos"
          size="xl"
          color="primary"
          fullWidth
          text="Cargando dashboard..."
          posTheme={true}
        />
      </div>
    );
  }

  const userData = currentUser || {
    nombre: 'Usuario',
    apellido: 'Sistema',
    cargo: 'Empleado',
    usuario: 'usuario'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        isAuthenticated={true}
        user={userData}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Header del Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de Control <span className="text-primary-500">POS</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <IconUserTie className="mr-2" size={16} />
                <span className="font-medium">
                  {userData.nombre} {userData.apellido}
                </span>
              </div>
              <div className="flex items-center">
                <IconBuilding className="mr-2" size={16} />
                <span>Cargo: {userData.cargo}</span>
              </div>
              <div className="flex items-center">
                <IconCalendar className="mr-2" size={16} />
                <span>Turno: {getCurrentShift()}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                <span>Sistema en línea</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <Link to="/pos">
              <Button
                variant="primary"
                size="lg"
                icon={IconCashRegister}
              >
                Ir al Punto de Venta
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              icon={IconRefresh}
              onClick={handleRefreshData}
              loading={refreshing}
            >
              Actualizar
            </Button>
          </div>
        </div>

        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            className="mb-6"
          />
        )}

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <Link to={stat.link} key={index}>
              <Card
                hover
                animation
                className="border-l-4 border-l-primary-500 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.details}</p>
                    {stat.change && (
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        stat.changePositive
                          ? 'bg-success-100 text-success-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {stat.changePositive ? (
                          <IconTrendingUp className="mr-1" size={10} />
                        ) : (
                          <IconTrendingDown className="mr-1" size={10} />
                        )}
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-primary-600">
                    <span>Ver detalles</span>
                    <IconArrowRight size={12} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Contenido Principal */}
        <div ref={parentRef} className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {/* Contenido principal - ocupa 3 columnas */}
          <div ref={mainContentRef} className="lg:col-span-3 space-y-8">
            <Card>
              <div className="border-b border-gray-200">
                <div className="flex">
                  {['ventas', 'inventario', 'clientes'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-medium text-sm transition-colors capitalize ${
                        activeTab === tab
                          ? 'text-primary-500 border-b-2 border-primary-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'ventas' && 'Ventas Recientes'}
                      {tab === 'inventario' && 'Control de Inventario'}
                      {tab === 'clientes' && 'Clientes Frecuentes'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'ventas' && stats?.ventasRecientes && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Ventas del Día</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          Total: {formatCurrency(stats.ventasHoy.monto)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={IconDownload}
                          onClick={handleDownloadDetailedReport}
                          loading={generatingReport}
                        >
                          Exportar
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {stats.ventasRecientes.slice(0, 5).map((venta, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                              <IconReceipt className="text-primary-500" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {venta.cliente || 'Cliente no registrado'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {venta.codigo} • {venta.items.length} productos
                              </div>
                              <div className="text-xs text-gray-400">
                                Cajero: {venta.usuarioNombre || 'No disponible'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {formatCurrency(venta.total)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(venta.fechaVenta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-xs text-gray-400 capitalize">
                              {venta.metodoPago}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Link to="/sales">
                        <Button variant="outline" size="md" fullWidth>
                          Ver Todas las Ventas
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 'inventario' && stats?.alertasStockBajo && (
                  <div>
                    {stats.alertasStockBajo.length > 0 ? (
                      <>
                        <Alert
                          type="warning"
                          title="Alertas de Inventario"
                          message={`${stats.alertasStockBajo.length} productos están por debajo del stock mínimo`}
                        />

                        <div className="space-y-4 mt-6">
                          {stats.alertasStockBajo.slice(0, 5).map((producto, index) => (
                            <Link to="/inventory" key={index}>
                              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full mr-3 bg-warning-500"></div>
                                  <div>
                                    <div className="font-medium text-gray-900">{producto.nombre}</div>
                                    <div className="text-sm text-gray-500">
                                      Categoría: {producto.categoria}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">
                                    Stock: <span className="font-medium">{producto.stock} / {producto.stockMinimo}</span>
                                  </div>
                                  <div className="text-primary-600 text-sm font-medium">
                                    Reabastecer
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                          <IconCheck className="text-success-500" size={24} />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Inventario en Orden
                        </h4>
                        <p className="text-gray-600 mb-6">
                          Todos los productos tienen stock suficiente
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'clientes' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                      <IconUsers className="text-primary-500" size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Gestión de Clientes
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Administra tu base de datos de clientes y programas de fidelidad
                    </p>
                    <Link to="/clients">
                      <Button variant="primary" size="md">
                        Ver Clientes
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {stats?.productosMasVendidos && stats.productosMasVendidos.length > 0 && (
              <Card
                title="Productos Más Vendidos"
                subtitle="Top productos del último mes"
              >
                <div className="space-y-4">
                  {stats.productosMasVendidos.slice(0, 5).map((producto, index) => (
                    <Link to="/products" key={index}>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center flex-1">
                          <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center mr-4">
                            <span className="font-bold text-success-600">#{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{producto.nombre}</div>
                            <div className="text-sm text-gray-500">
                              Ventas: {producto.totalVendido} unidades
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {formatCurrency(producto.totalIngresos)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Ingresos totales
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Link to="/products" className="flex-1">
                      <Button variant="outline" size="sm" fullWidth>
                        Ver Productos
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={IconFileText}
                      onClick={() => Alert.info('En desarrollo', 'Próximamente: Reporte de productos')}
                    >
                      Reporte
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar derecho - FIJO PERO CON ALTURA CONSTANTE */}
          <div className="lg:col-span-1 relative" style={{ height: 'fit-content' }}>
            <div ref={sidebarRef} className="space-y-6 transition-all duration-200">
              <Card>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-xl bg-gradient-pos mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {getUserInitials()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {userData.nombre} {userData.apellido}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {userData.email || userData.usuario}
                  </p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRoleBadgeColor(userData.cargo)}`}>
                    {userData.cargo}
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link to="/profile">
                      <Button variant="outline" size="md" fullWidth icon={IconSettings}>
                        Mi Perfil
                      </Button>
                    </Link>

                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      icon={generatingReport ? IconRefresh : IconPrinter}
                      onClick={handleGenerateReport}
                      loading={generatingReport}
                    >
                      {generatingReport ? 'Generando...' : 'Generar Reporte Diario'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      icon={IconDownload}
                      onClick={handleDownloadDetailedReport}
                      loading={generatingReport}
                    >
                      Descargar Reporte Detallado
                    </Button>

                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={handleLogout}
                      loading={loading}
                    >
                      Cerrar Sesión
                    </Button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 text-left">
                      Información del Turno
                    </h4>
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Usuario:</span>
                        <span className="font-medium text-gray-900">{userData.usuario}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Apertura:</span>
                        <div className="flex items-center">
                          <IconClock className="mr-1 text-primary-500" size={14} />
                          <span className="font-medium">08:00 AM</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ventas:</span>
                        <span className="font-medium text-success-600">
                          {formatCurrency(stats?.ventasHoy.monto || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transacciones:</span>
                        <span className="font-medium bg-primary-100 text-primary-800 px-2 py-0.5 rounded">
                          {stats?.ventasHoy.cantidad || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cierre estimado:</span>
                        <div className="flex items-center">
                          <IconCalendarEvent className="mr-1 text-amber-500" size={14} />
                          <span className="font-medium">04:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Cajeros activos */}
              {stats?.usuariosActivos && stats.usuariosActivos.length > 0 && (
                <Card title="Cajeros Activos Hoy" subtitle="Ventas por cajero">
                  <div className="space-y-4">
                    {stats.usuariosActivos.map((usuario, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <span className="text-primary-600 font-medium text-sm">
                              {usuario.nombre.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {usuario.nombre.split(' ')[0]}
                            </div>
                            <div className="text-xs text-gray-500">
                              {usuario.totalVentasHoy} ventas
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {formatCurrency(usuario.montoVentasHoy || 0)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Hoy
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Métodos de pago */}
              {stats?.metodosPagoHoy && stats.metodosPagoHoy.length > 0 && (
                <Card title="Métodos de Pago" subtitle="Distribución de hoy">
                  <div className="space-y-4">
                    {stats.metodosPagoHoy.map((metodo, index) => {
                      const porcentaje = stats.ventasHoy.monto > 0
                        ? ((metodo.monto / stats.ventasHoy.monto) * 100).toFixed(1)
                        : 0;

                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded bg-success-100 flex items-center justify-center mr-3">
                              {metodo._id === 'efectivo' && <IconMoneybag className="text-success-500" size={14} />}
                              {metodo._id === 'tarjeta' && <IconCreditCard className="text-primary-500" size={14} />}
                              {metodo._id === 'transferencia' && <IconCurrencyDollar className="text-cyan-500" size={14} />}
                              {metodo._id === 'mixto' && <IconPercentage className="text-warning-500" size={14} />}
                            </div>
                            <span className="text-gray-700 capitalize">{metodo._id}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{formatCurrency(metodo.monto)}</div>
                            <div className="text-sm text-gray-500">{porcentaje}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;