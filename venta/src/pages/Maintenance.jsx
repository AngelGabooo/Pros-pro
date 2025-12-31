// src/pages/Maintenance.jsx
import React, { useState, useEffect } from 'react';
import { 
  IconTools, 
  IconClock, 
  IconAlertTriangle, 
  IconMail,
  IconBrandWhatsapp,
  IconRefresh,
  IconProgressAlert,
  IconShieldCheck,
  IconCloud,
  IconRocket,
  IconChecklist,
  IconDatabase
} from '@tabler/icons-react';
import Button from '../components/atoms/Button';

const Maintenance = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Simular cuenta regresiva
  useEffect(() => {
    const totalSeconds = 2 * 3600 + 30 * 60; // 2 horas y 30 minutos
    let secondsLeft = totalSeconds;

    const interval = setInterval(() => {
      secondsLeft--;
      
      if (secondsLeft <= 0) {
        clearInterval(interval);
        // Auto recargar cuando termine
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;
        
        setTimeLeft({ hours, minutes, seconds });
        setProgress(((totalSeconds - secondsLeft) / totalSeconds) * 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const contactInfo = {
    whatsapp: 'https://wa.me/528144384806',
    email: 'a20624646@gmail.com',
    phone: '814-438-4806'
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const features = [
    { icon: IconDatabase, text: 'Backup completo de datos' },
    { icon: IconRocket, text: 'Optimización de rendimiento' },
    { icon: IconShieldCheck, text: 'Seguridad mejorada' },
    { icon: IconCloud, text: 'Actualización en la nube' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
        
        {/* Patrón de puntos sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header elegante */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-sky-500 to-blue-500 rounded-3xl shadow-xl shadow-blue-200/50 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              <IconTools className="relative text-white" size={40} />
            </div>
          </div>
          
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent mb-4 leading-tight">
              Sistema en Mantenimiento
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Estamos trabajando en mejoras para ofrecerte una experiencia aún mejor
            </p>
          </div>

          {/* Etiqueta de estado */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full mb-8">
            <IconProgressAlert className="text-blue-600" size={18} />
            <span className="text-blue-700 font-semibold">Actualización en curso</span>
          </div>
        </div>

        {/* Tarjeta principal moderna */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/90 rounded-3xl shadow-2xl shadow-blue-100/50 overflow-hidden mb-12">
          <div className="p-8 md:p-10">
            {/* Timer circular elegante */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg">
                      <IconClock className="text-white" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Volvemos en</h2>
                  </div>
                  
                  <div className="relative inline-flex items-center justify-center">
                    {/* Timer circular */}
                    <div className="relative w-64 h-64">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="128"
                          cy="128"
                          r="116"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="128"
                          cy="128"
                          r="116"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 116}
                          strokeDashoffset={2 * Math.PI * 116 * (1 - progress / 100)}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
                          {timeLeft.hours.toString().padStart(2, '0')}:
                          {timeLeft.minutes.toString().padStart(2, '0')}
                        </div>
                        <div className="text-gray-500 text-sm mt-2">
                          Horas : Minutos
                        </div>
                        <div className="text-xl font-semibold text-blue-600 mt-2">
                          {timeLeft.seconds.toString().padStart(2, '0')}s
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de actualización */}
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <IconChecklist className="text-blue-500" />
                      ¿Qué estamos mejorando?
                    </h3>
                    
                    <div className="space-y-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white transition-colors">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <feature.icon className="text-blue-600" size={20} />
                          </div>
                          <span className="text-gray-700 font-medium">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-blue-100">
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between mb-1">
                          <span>Progreso</span>
                          <span className="font-semibold text-blue-600">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerta importante */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <IconAlertTriangle className="text-amber-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-800 mb-3">Información importante</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        '✅ Todos los datos están respaldados y seguros',
                        '🔒 Las ventas anteriores están protegidas',
                        '⚡ Mejoras significativas en velocidad',
                        '📱 Interfaz más intuitiva y moderna'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-white/50 rounded-lg">
                          <span className="text-amber-700 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de contacto */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">¿Necesitas ayuda inmediata?</h3>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <div className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <button className="relative w-full py-4 px-6 bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3">
                      <IconBrandWhatsapp size={24} />
                      <span>Contactar por WhatsApp</span>
                    </button>
                  </div>
                </a>
                
                <a href={`mailto:${contactInfo.email}`} className="flex-1">
                  <button className="w-full py-4 px-6 bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold rounded-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3">
                    <IconMail size={24} />
                    <span>Enviar Correo</span>
                  </button>
                </a>
              </div>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <IconRefresh className="animate-spin-slow" />
                      <span>Verificar estado actual</span>
                    </>
                  )}
                </button>
                
                <p className="text-gray-500 text-sm mt-4">
                  Puedes recargar la página en cualquier momento para verificar el estado
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-white/90 rounded-2xl px-6 py-4 shadow-lg">
            <div className="text-left">
              <p className="text-gray-700 font-medium">
                <span className="text-blue-600">⏰ Horario estimado:</span> 2 horas y 30 minutos
              </p>
              <p className="text-gray-600 text-sm">
                <span className="text-gray-500">📍 Soporte:</span> {contactInfo.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Firma moderna */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600">
                <span className="font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  FastPOS Pro System
                </span>
              </p>
              <p className="text-gray-500 text-sm">
                Tu sistema de punto de venta confiable
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Todos los derechos reservados
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Versión 3.0 • Actualización en progreso
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Maintenance;