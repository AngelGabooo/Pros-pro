import React, { useState } from 'react';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import { 
  IconPhone, 
  IconMail, 
  IconBrandWhatsapp,
  IconHeadphones,
  IconMessageCircle,
  IconClock,
  IconHelp,
  IconUserCircle,
  IconArrowLeft
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const Help = ({ darkMode, onThemeToggle, isAuthenticated, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('soporte');

  const contactInfo = {
    phone: '8144384806',
    email: 'a20624646@gmail.com',
    whatsapp: 'https://wa.me/528144384806',
    supportHours: 'Lunes a Viernes: 9:00 AM - 6:00 PM',
    emergencyHours: 'Sábados: 10:00 AM - 2:00 PM'
  };

  const faqs = [
    {
      question: '¿Cómo registro un nuevo producto?',
      answer: 'Ve a la sección de Productos > Haz clic en "Agregar Nuevo" > Completa los datos del producto > Guarda.'
    },
    {
      question: '¿Cómo realizo una venta?',
      answer: 'En el POS, selecciona los productos > Agrega al carrito > Configura método de pago > Procesa la venta.'
    },
    {
      question: '¿Cómo veo mis reportes de ventas?',
      answer: 'Ve a la sección de Reportes > Selecciona el período deseado > Visualiza gráficos y estadísticas.'
    },
    {
      question: '¿Puedo usar el sistema en múltiples dispositivos?',
      answer: 'Sí, el sistema es web y puedes acceder desde cualquier dispositivo con internet.'
    },
    {
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a tu Perfil > Configuración > Cambiar Contraseña > Ingresa tu nueva contraseña.'
    }
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={onLogout}
          onThemeToggle={onThemeToggle}
          darkMode={darkMode}
        />
        
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            {/* Botón de regreso */}
            <div className="mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm" icon={IconArrowLeft}>
                  Volver al inicio
                </Button>
              </Link>
            </div>

            {/* Encabezado */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                <IconHeadphones className="text-white" size={28} />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Centro de <span className="text-blue-600">Ayuda</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Estamos aquí para ayudarte. Encuentra respuestas a tus preguntas o contacta directamente a nuestro equipo de soporte.
              </p>
            </div>

            {/* Tarjetas de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white hover:shadow-xl transition-shadow duration-300">
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <IconBrandWhatsapp className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp Directo</h3>
                  <p className="text-gray-600 mb-4">Respuesta inmediata</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {contactInfo.phone}
                    </div>
                  </div>
                  <a 
                    href={contactInfo.whatsapp} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="success" 
                      size="md" 
                      fullWidth
                      icon={IconBrandWhatsapp}
                    >
                      Enviar Mensaje
                    </Button>
                  </a>
                  <p className="text-sm text-gray-500 mt-3">
                    Soporte 24/7 para emergencias
                  </p>
                </div>
              </Card>

              <Card className="bg-white hover:shadow-xl transition-shadow duration-300">
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <IconMail className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Correo Electrónico</h3>
                  <p className="text-gray-600 mb-4">Soporte detallado</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="text-lg font-medium text-gray-900 break-all">
                      {contactInfo.email}
                    </div>
                  </div>
                  <a href={`mailto:${contactInfo.email}`}>
                    <Button 
                      variant="primary" 
                      size="md" 
                      fullWidth
                      icon={IconMail}
                    >
                      Enviar Correo
                    </Button>
                  </a>
                  <p className="text-sm text-gray-500 mt-3">
                    Respuesta en menos de 24 horas
                  </p>
                </div>
              </Card>

              <Card className="bg-white hover:shadow-xl transition-shadow duration-300">
                <div className="text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <IconPhone className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Llamada Telefónica</h3>
                  <p className="text-gray-600 mb-4">Atención personalizada</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {contactInfo.phone}
                    </div>
                  </div>
                  <a href={`tel:${contactInfo.phone}`}>
                    <Button 
                      variant="outline" 
                      size="md" 
                      fullWidth
                      icon={IconPhone}
                    >
                      Llamar Ahora
                    </Button>
                  </a>
                  <p className="text-sm text-gray-500 mt-3">
                    {contactInfo.supportHours}
                  </p>
                </div>
              </Card>
            </div>

            {/* Pestañas de contenido */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-2 mb-8">
                <Button
                  variant={activeTab === 'soporte' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setActiveTab('soporte')}
                  icon={IconHeadphones}
                >
                  Soporte Técnico
                </Button>
                <Button
                  variant={activeTab === 'faq' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setActiveTab('faq')}
                  icon={IconHelp}
                >
                  Preguntas Frecuentes
                </Button>
                <Button
                  variant={activeTab === 'horarios' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setActiveTab('horarios')}
                  icon={IconClock}
                >
                  Horarios de Atención
                </Button>
              </div>

              {/* Contenido de pestañas */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {activeTab === 'soporte' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Soporte Técnico</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                            <IconUserCircle className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Propietario del Soporte</h3>
                            <p className="text-gray-600">
                              Angel Gabriel Garcia Samayoa<br/>
                              Desarrollador y Soporte Técnico
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                            <IconBrandWhatsapp className="text-green-600" size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Soporte Prioritario</h3>
                            <p className="text-gray-600">
                              Para problemas urgentes, contacta por WhatsApp para respuesta inmediata.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                            <IconMessageCircle className="text-purple-600" size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Tipo de Soporte Ofrecido</h3>
                            <ul className="text-gray-600 list-disc pl-5 space-y-1">
                              <li>Configuración del sistema</li>
                              <li>Problemas técnicos</li>
                              <li>Capacitación de uso</li>
                              <li>Soporte de actualizaciones</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                              <span className="text-blue-600 font-bold">Q</span>
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'horarios' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Horarios de Atención</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                        <div className="flex items-center mb-4">
                          <IconClock className="mr-3" size={24} />
                          <h3 className="text-xl font-bold">Horario Regular</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-white/20">
                            <span>Lunes - Viernes</span>
                            <span className="font-bold">9:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span>Respuesta por Email</span>
                            <span className="font-bold">24 horas</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white">
                        <div className="flex items-center mb-4">
                          <IconBrandWhatsapp className="mr-3" size={24} />
                          <h3 className="text-xl font-bold">Soporte de Emergencia</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-white/20">
                            <span>Sábados</span>
                            <span className="font-bold">10:00 AM - 2:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span>WhatsApp</span>
                            <span className="font-bold">24/7 para emergencias</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-5 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-yellow-600 font-bold">!</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-yellow-800 mb-1">Nota Importante</h4>
                          <p className="text-yellow-700">
                            Para problemas críticos que afecten el funcionamiento de tu tienda, 
                            utiliza WhatsApp para atención inmediata incluso fuera del horario laboral.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de respuesta rápida */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                  <h2 className="text-2xl font-bold mb-3">¿Necesitas ayuda inmediata?</h2>
                  <p className="text-blue-100">
                    Nuestro equipo está listo para resolver tus problemas lo más rápido posible.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer">
                    <Button 
                      variant="success" 
                      size="lg"
                      icon={IconBrandWhatsapp}
                      className="bg-white text-green-600 hover:bg-gray-100"
                    >
                      WhatsApp Rápido
                    </Button>
                  </a>
                  <a href={`tel:${contactInfo.phone}`}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      icon={IconPhone}
                      className="border-white text-white hover:bg-white/10"
                    >
                      Llamar Ahora
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Help;