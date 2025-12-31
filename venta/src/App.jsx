// src/App.js - VERSIÓN CORREGIDA CON BOTONES FUNCIONALES Y DRAG
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import Maintenance from './pages/Maintenance';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Help from './pages/Help';
import { 
  IconBell, 
  IconX, 
  IconCalendar, 
  IconClock, 
  IconAlertTriangle,
  IconSettings,
  IconInfoCircle,
  IconMinus,
  IconMaximize,
  IconCloud,
  IconShield,
  IconChecklist,
  IconCalendarEvent,
  IconGripVertical
} from '@tabler/icons-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [windowVisible, setWindowVisible] = useState(true);
  const [windowMinimized, setWindowMinimized] = useState(false);
  const [windowPosition, setWindowPosition] = useState({ x: 30, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [windowStart, setWindowStart] = useState({ x: 0, y: 0 });

  // Referencias para el contador
  const windowRef = useRef(null);
  const dragAreaRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ======================================================
  // CONFIGURACIÓN DE MANTENIMIENTO
  // ======================================================
  const FORCE_FULL_MAINTENANCE = false;

  // Fechas del mantenimiento
  const MAINTENANCE_START = new Date('2025-12-31T23:00:00');
  const MAINTENANCE_END = new Date('2026-01-01T03:00:00');
  const SHOW_WARNING_DAYS_BEFORE = 3;

  // ======================================================
  // CÁLCULOS DEL COUNTDOWN
  // ======================================================
  // Actualizar la hora actual cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const now = currentTime;
  const isInMaintenance = FORCE_FULL_MAINTENANCE || (now >= MAINTENANCE_START && now < MAINTENANCE_END);
  
  const warningStartDate = new Date(MAINTENANCE_START.getTime() - SHOW_WARNING_DAYS_BEFORE * 24 * 60 * 60 * 1000);
  const isWarningPeriod = !FORCE_FULL_MAINTENANCE && now >= warningStartDate && now < MAINTENANCE_START;
  
  // Calcular tiempo restante
  const timeUntilMaintenance = MAINTENANCE_START.getTime() - now.getTime();
  const hoursUntil = Math.max(0, Math.floor(timeUntilMaintenance / (1000 * 60 * 60)));
  const minutesUntil = Math.max(0, Math.floor((timeUntilMaintenance % (1000 * 60 * 60)) / (1000 * 60)));
  const secondsUntil = Math.max(0, Math.floor((timeUntilMaintenance % (1000 * 60)) / 1000));
  const daysUntil = Math.floor(hoursUntil / 24);

  // ======================================================
  // REAPARECER AL RECARGAR LA PÁGINA
  // ======================================================
  useEffect(() => {
    // Siempre mostrar la ventana al recargar
    setWindowVisible(true);
    setWindowMinimized(false);
  }, []);

  // ======================================================
  // VERIFICACIÓN DE AUTENTICACIÓN
  // ======================================================
  useEffect(() => {
    if (isInMaintenance) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          try {
            const data = await authService.getProfile();
            if (data.success && data.user) {
              setUser(data.user);
            } else {
              authService.logout();
            }
          } catch {
            authService.logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [isInMaintenance]);

  // ======================================================
  // HANDLERS SIMPLIFICADOS
  // ======================================================
  const handleLogin = () => {
    const currentUser = authService.getCurrentUser();
    setIsAuthenticated(true);
    setUser(currentUser);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const closeWindow = () => {
    console.log('Cerrando ventana');
    setWindowVisible(false);
  };

  const toggleMinimize = () => {
    console.log('Minimizando ventana');
    setWindowMinimized(!windowMinimized);
  };

  // ======================================================
  // DRAG & DROP SIMPLIFICADO
  // ======================================================
  const handleDragStart = (e) => {
    // Solo permitir arrastrar desde el área designada
    if (e.target.closest('.no-drag')) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setWindowStart({ x: windowPosition.x, y: windowPosition.y });
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = windowStart.x + deltaX;
    const newY = windowStart.y + deltaY;
    
    // Limitar a los bordes de la ventana
    const maxX = window.innerWidth - (windowMinimized ? 300 : 380);
    const maxY = window.innerHeight - (windowMinimized ? 60 : 450);
    
    setWindowPosition({
      x: Math.max(10, Math.min(newX, maxX)),
      y: Math.max(10, Math.min(newY, maxY))
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleDragMove(e);
    const handleMouseUp = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  // ======================================================
  // PANTALLA DE CARGA
  // ======================================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                 style={{
                   background: `conic-gradient(from 0deg, #0ea5e9, #38bdf8, #7dd3fc, #0ea5e9)`,
                   WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), white 0)'
                 }}>
            </div>
            <div className="absolute inset-4 flex items-center justify-center">
              <IconShield className="h-8 w-8 text-sky-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
            FastPOS
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Iniciando aplicación...</p>
        </div>
      </div>
    );
  }

  // ======================================================
  // MANTENIMIENTO COMPLETO
  // ======================================================
  if (isInMaintenance) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Maintenance />} />
        </Routes>
      </Router>
    );
  }

  // ======================================================
  // VENTANA FLOTANTE - COMPONENTE SIMPLIFICADO
  // ======================================================
  const FloatingMaintenanceWindow = () => {
    if (!isWarningPeriod || !windowVisible) return null;

    const formatDate = (date) => {
      return date.toLocaleString('es-MX', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    // Ventana minimizada
    if (windowMinimized) {
      return (
        <div
          ref={windowRef}
          className={`fixed z-50 rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 shadow-2xl shadow-sky-200/50 backdrop-blur-sm transition-all duration-300 ${isDragging ? 'cursor-grabbing shadow-lg' : 'cursor-move'}`}
          style={{
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            width: '300px'
          }}
          onMouseDown={handleDragStart}
        >
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-sky-100">
                  <IconBell className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-800">
                    Mantenimiento Programado
                  </h3>
                  <p className="text-xs text-gray-600">
                    {hoursUntil > 0 ? `${hoursUntil}h ${minutesUntil}m` : '¡Pronto!'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 no-drag">
                <button
                  onClick={toggleMinimize}
                  className="p-1 hover:bg-sky-100 rounded-md transition-colors"
                  aria-label="Maximizar"
                  title="Maximizar"
                >
                  <IconMaximize className="h-3.5 w-3.5 text-gray-600 hover:text-sky-600" />
                </button>
                <button
                  onClick={closeWindow}
                  className="p-1 hover:bg-red-50 rounded-md transition-colors"
                  aria-label="Cerrar"
                  title="Cerrar"
                >
                  <IconX className="h-3.5 w-3.5 text-gray-600 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Ventana expandida completa
    return (
      <div
        ref={windowRef}
        className={`fixed z-50 rounded-xl bg-gradient-to-br from-white to-sky-50 border border-sky-200/80 shadow-2xl shadow-sky-200/40 backdrop-blur-sm transition-all duration-300 ${isDragging ? 'cursor-grabbing shadow-lg' : 'cursor-move'}`}
        style={{
          left: `${windowPosition.x}px`,
          top: `${windowPosition.y}px`,
          width: '380px'
        }}
        onMouseDown={handleDragStart}
      >
        {/* Header - Área de arrastre */}
        <div className="p-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 shadow-md">
                <IconCalendarEvent className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Mantenimiento Programado
                </h3>
                <p className="text-sm text-gray-600">Sistema FastPOS</p>
              </div>
            </div>
            
            {/* Controles de ventana - NO son área de arrastre */}
            <div className="flex items-center gap-1 no-drag">
              <button
                onClick={toggleMinimize}
                className="p-2 hover:bg-sky-100 rounded-lg transition-colors group"
                aria-label="Minimizar"
                title="Minimizar"
              >
                <IconMinus className="h-4 w-4 text-gray-600 group-hover:text-sky-600" />
              </button>
              <button
                onClick={closeWindow}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                aria-label="Cerrar"
                title="Cerrar"
              >
                <IconX className="h-4 w-4 text-gray-600 group-hover:text-red-500 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Badge informativo - también área de arrastre */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-sky-200 rounded-full">
            <IconCloud className="h-3.5 w-3.5 text-sky-500" />
            <span className="text-xs font-medium text-gray-700">
              {daysUntil > 0 ? `Falta${daysUntil > 1 ? 'n' : ''} ${daysUntil} día${daysUntil > 1 ? 's' : ''}` : '¡Hoy!'}
            </span>
          </div>
        </div>

        {/* Contenido principal - NO es área de arrastre */}
        <div className="p-5 max-h-[350px] overflow-y-auto scrollbar-light no-drag">
          {/* Timer principal */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <IconClock className="h-5 w-5 text-sky-500 animate-pulse" />
              <span className="text-sm font-semibold text-gray-700">Tiempo restante</span>
            </div>
            
            {timeUntilMaintenance > 0 ? (
              <div className="flex items-center justify-center gap-4 mb-4">
                {hoursUntil > 0 && (
                  <>
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                        {hoursUntil.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">HORAS</div>
                    </div>
                    <div className="text-2xl text-gray-300">:</div>
                  </>
                )}
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    {minutesUntil.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">MINUTOS</div>
                </div>
                <div className="text-2xl text-gray-300">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                    {secondsUntil.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">SEGUNDOS</div>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <div className="text-xl font-bold text-amber-600">¡Mantenimiento inicia pronto!</div>
                <div className="text-sm text-gray-600 mt-1">Prepárate para la actualización</div>
              </div>
            )}
            
            {/* Barra de progreso */}
            <div className="mt-4">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, 100 - (timeUntilMaintenance / (MAINTENANCE_START.getTime() - warningStartDate.getTime()) * 100))}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Anuncio</span>
                <span>Inicio</span>
              </div>
            </div>
          </div>

          {/* Detalles del horario */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <IconCalendar className="h-5 w-5 text-sky-500" />
              <span className="text-sm font-semibold text-gray-700">Horario detallado</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  INICIO
                </div>
                <div className="text-sm font-medium text-gray-800">{formatDate(MAINTENANCE_START)}</div>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  FIN ESTIMADO
                </div>
                <div className="text-sm font-medium text-gray-800">{formatDate(MAINTENANCE_END)}</div>
              </div>
              
              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">DURACIÓN TOTAL</div>
                <div className="text-sm font-semibold text-sky-700">
                  {Math.ceil((MAINTENANCE_END - MAINTENANCE_START) / (1000 * 60 * 60))} horas
                </div>
              </div>
            </div>
          </div>

          
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white/50 rounded-b-xl">
          <div className="text-xs text-gray-500 text-center">
            <span className="flex items-center justify-center gap-1">
              <IconSettings className="h-3 w-3" />
              FastPOS Maintenance • Actualizado hace {minutesUntil % 60} min
            </span>
          </div>
        </div>

        {/* Indicador de arrastre */}
        {!isDragging && (
          <div className="absolute top-2 right-2">
            <div className="text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md border border-gray-200">
              <IconGripVertical className="h-3 w-3 inline mr-1" />
              Arrastrar
            </div>
          </div>
        )}
      </div>
    );
  };

  // ======================================================
  // BOTÓN PARA REABRIR LA VENTANA
  // ======================================================
  const ReopenWindowButton = () => {
    if (!isWarningPeriod || windowVisible) return null;

    return (
      <button
        onClick={() => {
          setWindowVisible(true);
          setWindowMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-sky-400 rounded-full animate-ping opacity-20"></div>
          
          <div className="relative bg-gradient-to-r from-sky-500 to-blue-500 text-white p-4 rounded-xl shadow-xl shadow-sky-300/40 backdrop-blur-sm border border-white/30 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <IconBell className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm font-bold">Mantenimiento</div>
                <div className="text-xs opacity-90">
                  {hoursUntil > 0 ? `${hoursUntil}h ${minutesUntil}m` : '¡Pronto!'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -top-2 -right-2 bg-white text-sky-600 text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {hoursUntil > 0 ? `${hoursUntil}h` : '!'}
          </div>
        </div>
      </button>
    );
  };

  // ======================================================
  // ESTILOS CSS PERSONALIZADOS
  // ======================================================
  const customStyles = `
    .scrollbar-light::-webkit-scrollbar {
      width: 6px;
    }
    
    .scrollbar-light::-webkit-scrollbar-track {
      background: #f0f9ff;
      border-radius: 10px;
    }
    
    .scrollbar-light::-webkit-scrollbar-thumb {
      background: #bae6fd;
      border-radius: 10px;
    }
    
    .scrollbar-light::-webkit-scrollbar-thumb:hover {
      background: #7dd3fc;
    }
    
    /* Clase para elementos que NO deben activar el drag */
    .no-drag {
      user-select: none;
      -webkit-user-drag: none;
    }
    
    .no-drag button {
      cursor: pointer !important;
    }
  `;

  // ======================================================
  // APP NORMAL
  // ======================================================
  return (
    <Router>
      <style>{customStyles}</style>
      
      <div className="App min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <FloatingMaintenanceWindow />
        <ReopenWindowButton />

        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/pos" replace /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/pos" replace /> : <Register />}
          />
          <Route
            path="/features"
            element={<Features darkMode={darkMode} onThemeToggle={handleThemeToggle} isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />}
          />
          <Route
            path="/pricing"
            element={<Pricing darkMode={darkMode} onThemeToggle={handleThemeToggle} isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />}
          />
          <Route
            path="/pos"
            element={isAuthenticated ? <POS darkMode={darkMode} onThemeToggle={handleThemeToggle} isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard darkMode={darkMode} onThemeToggle={handleThemeToggle} isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/products"
            element={isAuthenticated ? <Products darkMode={darkMode} onThemeToggle={handleThemeToggle} isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile darkMode={darkMode} onThemeToggle={handleThemeToggle} isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/help"
            element={<Help darkMode={darkMode} onThemeToggle={handleThemeToggle} isAuthenticated={isAuthenticated} user={isAuthenticated ? user : null} onLogout={handleLogout} />}
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/pos" : "/login"} replace />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/pos" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;