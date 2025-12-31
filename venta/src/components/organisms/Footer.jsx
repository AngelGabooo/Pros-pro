import React, { useState, useEffect } from 'react';
import {
  IconShieldCheck as IconShieldAlt,
  IconHeadphones as IconHeadset,
  IconPhone,
  IconMail as IconEnvelope,
  IconCopyright,
  IconCreditCard,
  IconBrandWhatsapp
} from '@tabler/icons-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Estados para los indicadores visuales
  const [indicators, setIndicators] = useState({
    dashboard: true,
    sales: false,
    inventory: true,
    clients: false,
    reports: true,
    support: true,
    docs: false,
    tutorials: true,
    api: false,
    updates: true,
    terms: false,
    privacy: true,
    cookies: false,
    legal: true
  });

  // Cambio automático de indicadores
  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators(prev => {
        const newIndicators = { ...prev };
        const keys = Object.keys(newIndicators);
        const numToChange = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < numToChange; i++) {
          const randomKey = keys[Math.floor(Math.random() * keys.length)];
          newIndicators[randomKey] = !newIndicators[randomKey];
        }
        return newIndicators;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Items compactos
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'sales', name: 'Ventas' },
    { id: 'inventory', name: 'Inventario' },
    { id: 'clients', name: 'Clientes' },
    { id: 'reports', name: 'Reportes' },
  ];

  const companyItems = [
    { id: 'support', name: 'Soporte' },
    { id: 'docs', name: 'Documentación' },
    { id: 'tutorials', name: 'Tutoriales' },
    { id: 'api', name: 'API' },
    { id: 'updates', name: 'Updates' },
  ];

  const legalItems = [
    { id: 'terms', name: 'Términos' },
    { id: 'privacy', name: 'Privacidad' },
    { id: 'cookies', name: 'Cookies' },
    { id: 'legal', name: 'Legal' },
  ];

  // Componente de indicador ultra compacto
  const StatusIndicator = ({ isActive, size = 'sm' }) => {
    const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';
    
    return (
      <div className="relative">
        <div className={`${sizeClass} rounded-full transition-all duration-800 ${
          isActive 
            ? 'bg-gradient-to-r from-emerald-400 to-green-400 shadow-sm shadow-emerald-400/40' 
            : 'bg-gray-300'
        }`}>
          {isActive && (
            <div className="absolute inset-[1px] rounded-full bg-white/40 blur-[1px]"></div>
          )}
        </div>
        {isActive && (
          <div className="absolute -inset-0.5 rounded-full bg-emerald-400/20 animate-ping"></div>
        )}
      </div>
    );
  };

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50/80 text-gray-600 border-t border-gray-200/80 shadow-xs">
      {/* Main Footer distribuido en todo el ancho */}
      <div className="w-full px-4 py-4">
        <div className="flex flex-wrap justify-between items-start gap-x-6 gap-y-4">
          {/* Brand Column */}
          <div className="min-w-[160px]">
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-md flex items-center justify-center shadow-xs">
                  <span className="text-white font-bold text-xs">P</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <StatusIndicator isActive={true} size="sm" />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-800">
                  <span className="text-primary-600">POS</span>Pro
                </h1>
                <p className="text-[10px] text-gray-500">Sistema POS</p>
              </div>
            </div>
           
            <p className="text-[10px] text-gray-500 mb-3 line-clamp-2 leading-tight">
              Sistema profesional de punto de venta
            </p>
           
            {/* WhatsApp */}
            <div className="relative inline-block">
              <div className="flex items-center bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 py-1 rounded-md text-[10px] font-medium shadow-xs">
                <IconBrandWhatsapp className="mr-1" size={10} />
                <span>WhatsApp</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5">
                <StatusIndicator isActive={true} size="sm" />
              </div>
            </div>
          </div>

          {/* Separador visual */}
          <div className="w-px h-16 bg-gray-200/60 hidden md:block"></div>

          {/* Navigation Items */}
          <div className="min-w-[120px]">
            <h3 className="text-[10px] font-semibold text-gray-700 mb-1 uppercase tracking-wider">
              Navegación
            </h3>
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-600">{item.name}</span>
                  <StatusIndicator isActive={indicators[item.id]} size="sm" />
                </div>
              ))}
            </div>
            
            {/* Contador */}
            <div className="mt-2 pt-1 border-t border-gray-100/50">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-gray-400">Activos</span>
                <span className="text-[8px] font-medium text-emerald-600">
                  {navigationItems.filter(item => indicators[item.id]).length}
                </span>
              </div>
            </div>
          </div>

          {/* Separador visual */}
          <div className="w-px h-16 bg-gray-200/60 hidden md:block"></div>

          {/* Company Items */}
          <div className="min-w-[120px]">
            <h3 className="text-[10px] font-semibold text-gray-700 mb-1 uppercase tracking-wider">
              Empresa
            </h3>
            <div className="space-y-1">
              {companyItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-600">{item.name}</span>
                  <StatusIndicator isActive={indicators[item.id]} size="sm" />
                </div>
              ))}
            </div>
            
            {/* Contador */}
            <div className="mt-2 pt-1 border-t border-gray-100/50">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-gray-400">Activos</span>
                <span className="text-[8px] font-medium text-emerald-600">
                  {companyItems.filter(item => indicators[item.id]).length}
                </span>
              </div>
            </div>
          </div>

          {/* Separador visual */}
          <div className="w-px h-16 bg-gray-200/60 hidden md:block"></div>

          {/* Legal Items */}
          <div className="min-w-[100px]">
            <h3 className="text-[10px] font-semibold text-gray-700 mb-1 uppercase tracking-wider">
              Legal
            </h3>
            <div className="space-y-1">
              {legalItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-600">{item.name}</span>
                  <StatusIndicator isActive={indicators[item.id]} size="sm" />
                </div>
              ))}
            </div>
            
            {/* Contador */}
            <div className="mt-2 pt-1 border-t border-gray-100/50">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-gray-400">Activos</span>
                <span className="text-[8px] font-medium text-emerald-600">
                  {legalItems.filter(item => indicators[item.id]).length}
                </span>
              </div>
            </div>
          </div>

          {/* Separador visual */}
          <div className="w-px h-16 bg-gray-200/60 hidden md:block"></div>

          {/* Contact Info */}
          <div className="min-w-[140px]">
            <h3 className="text-[10px] font-semibold text-gray-700 mb-1 uppercase tracking-wider">
              Contacto
            </h3>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <IconPhone className="text-primary-500 mr-1.5 flex-shrink-0" size={9} />
                  <div>
                    <div className="text-[10px] text-gray-700 font-medium">814-438-4806</div>
                    <div className="text-[8px] text-gray-400">Soporte</div>
                  </div>
                </div>
                <StatusIndicator isActive={true} size="sm" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <IconEnvelope className="text-primary-500 mr-1.5 flex-shrink-0" size={9} />
                  <div>
                    <div className="text-[10px] text-gray-700 font-medium">soporte@pospro</div>
                    <div className="text-[8px] text-gray-400">Email</div>
                  </div>
                </div>
                <StatusIndicator isActive={indicators.support} size="sm" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <IconHeadset className="text-primary-500 mr-1.5 flex-shrink-0" size={9} />
                  <div>
                    <div className="text-[10px] text-gray-700 font-medium">24/7</div>
                    <div className="text-[8px] text-gray-400">Disponible</div>
                  </div>
                </div>
                <StatusIndicator isActive={true} size="sm" />
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded p-1.5 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-gray-500">Total activos</span>
                <div className="flex items-center">
                  <StatusIndicator isActive={true} size="sm" />
                  <span className="text-[8px] font-bold text-emerald-600 ml-0.5">
                    {Object.values(indicators).filter(Boolean).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar distribuido */}
        <div className="mt-4 pt-3 border-t border-gray-100/50">
          <div className="flex flex-wrap justify-between items-center gap-3">
            {/* Estado del sistema - Izquierda */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <StatusIndicator isActive={true} />
                <span className="text-[10px] text-gray-600 ml-1">Online</span>
              </div>
              
              <div className="flex items-center text-[10px] text-gray-500">
                <IconShieldAlt className="text-emerald-500 mr-0.5" size={9} />
                <span className="text-[9px]">SSL</span>
              </div>
              
              <div className="flex items-center text-[10px] text-gray-500">
                <IconCopyright className="mr-0.5" size={9} />
                <span>{currentYear} POS Pro v2.0</span>
              </div>
            </div>
            
            {/* Centro - Información del sistema */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-gray-50 to-white rounded border border-gray-100">
                <div className="flex items-center">
                  <StatusIndicator isActive={true} />
                  <span className="text-[10px] text-emerald-600 font-medium ml-1">
                    Sistema Operativo
                  </span>
                </div>
                <div className="text-[10px] text-gray-500">•</div>
                <div className="text-[10px] text-gray-500">
                  Uptime: 99.8%
                </div>
              </div>
            </div>
            
            {/* Derecha - Info adicional */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="text-[9px] text-gray-500">Activos:</div>
                <div className="flex items-center bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-1.5 py-0.5 rounded">
                  <StatusIndicator isActive={true} size="sm" />
                  <span className="text-[9px] font-bold text-emerald-600 ml-0.5">
                    {Object.values(indicators).filter(Boolean).length}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-[10px] text-gray-500">
                <IconCreditCard className="mr-0.5 text-gray-400" size={9} />
                <span className="text-[9px]">Pagos seguros</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;