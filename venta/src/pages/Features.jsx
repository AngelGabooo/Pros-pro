import React from 'react';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import Alert from '../components/atoms/Alert'; // Asegúrate de tener este componente
import { useNavigate } from 'react-router-dom';
import {
  IconCashRegister,
  IconChartLine,
  IconPackage,
  IconUsers,
  IconReceipt,
  IconDeviceMobile,
  IconShieldCheck,
  IconRefresh,
  IconCloud,
  IconPrinter,
  IconBarcode,
  IconCreditCard,
  IconShoppingCart,
  IconBuildingStore,
  IconFileInvoice,
  IconHeadphones,
  IconClock,
  IconCircleCheckFilled,
  IconSparkles,
  IconRocket,
  IconTrendingUp,
  IconBolt,
  IconCheck,
  IconPlayerPlay,
  IconArrowRight,
  IconInfoCircle,
  IconX
} from '@tabler/icons-react';

const Features = ({ darkMode = false, onThemeToggle, isAuthenticated = false, user, onLogout }) => {
  const navigate = useNavigate();
  const [showVideoAlert, setShowVideoAlert] = React.useState(false);

  const heroFeatures = [
    { text: 'Facturación SUNAT en 1 clic', icon: IconCheck },
    { text: 'App móvil incluida', icon: IconCheck },
    { text: 'Soporte 24/7', icon: IconCheck },
    { text: 'Sin instalación', icon: IconCheck }
  ];

  const coreFeatures = [
    {
      icon: IconCashRegister,
      title: 'Ventas Ultra Rápidas',
      description: 'Interfaz optimizada que permite procesar transacciones en menos de 3 segundos',
      color: 'success',
      highlights: [
        'Escaneo de código de barras',
        'Búsqueda por voz o texto',
        'Múltiples métodos de pago',
        'Impresión instantánea'
      ],
      stats: '+85% velocidad'
    },
    {
      icon: IconChartLine,
      title: 'Inteligencia de Negocio',
      description: 'Dashboard con IA que predice tendencias y sugiere acciones',
      color: 'primary',
      highlights: [
        'Predicción de ventas',
        'Análisis de clientes',
        'Alertas inteligentes',
        'Reportes automáticos'
      ],
      stats: 'Toma decisiones en minutos'
    },
    {
      icon: IconPackage,
      title: 'Inventario Inteligente',
      description: 'Control automático con alertas predictivas y gestión multicanal',
      color: 'warning',
      highlights: [
        'Alertas de stock bajo',
        'Control de caducidad',
        'Sincronización multicanal',
        'Órdenes automáticas'
      ],
      stats: '-40% en mermas'
    }
  ];

  const advancedFeatures = [
    {
      icon: IconUsers,
      title: 'CRM Avanzado',
      description: 'Gestiona relaciones y fideliza clientes con marketing automatizado',
      color: 'purple',
      points: ['Segmentación automática', 'Campañas email/SMS', 'Programa de puntos', 'Historial completo']
    },
    {
      icon: IconReceipt,
      title: 'Facturación 100% Digital',
      description: 'Integración completa con SUNAT y múltiples formatos personalizables',
      color: 'cyan',
      points: ['Factura electrónica', 'Boletas electrónicas', 'Notas de crédito', 'Formatos personalizados']
    },
    {
      icon: IconDeviceMobile,
      title: 'Multiplataforma',
      description: 'Funciona perfecto en cualquier dispositivo, online y offline',
      color: 'success',
      points: ['App iOS/Android', 'Modo offline', 'Sincronización automática', 'Touch optimizado']
    },
    {
      icon: IconShieldCheck,
      title: 'Seguridad Bank-Level',
      description: 'Encriptación militar y backups automáticos en la nube',
      color: 'primary',
      points: ['SSL 256-bit', 'Backups diarios', '2FA opcional', 'Auditoría completa']
    },
    {
      icon: IconRefresh,
      title: 'Sincronización en Vivo',
      description: 'Todas tus sucursales actualizadas al instante',
      color: 'warning',
      points: ['Tiempo real', 'Multi-sucursal', 'Nube privada', 'Sin delays']
    },
    {
      icon: IconCreditCard,
      title: 'Pagos Integrados',
      description: 'Acepta todos los métodos de pago del mercado peruano',
      color: 'purple',
      points: ['Tarjetas crédito/débito', 'Yape/Plin', 'Transferencias', 'Efectivo digital']
    }
  ];

  const benefits = [
    {
      icon: IconTrendingUp,
      title: 'Aumenta Ventas',
      description: 'Clientes reportan incrementos del 30-50% en ventas',
      metric: '+40%'
    },
    {
      icon: IconBolt,
      title: 'Ahorra Tiempo',
      description: 'Automatiza procesos que tomaban horas',
      metric: '70% menos tiempo'
    },
    {
      icon: IconCloud,
      title: 'Reduce Costos',
      description: 'Elimina servidores y mantenimientos locales',
      metric: '-60% costos TI'
    },
    {
      icon: IconShieldCheck,
      title: 'Menos Errores',
      description: 'Control automático reduce errores humanos',
      metric: '-90% errores'
    }
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={onLogout}
          onThemeToggle={onThemeToggle}
          darkMode={darkMode}
        />

        {/* Alerta de video no disponible */}
        {showVideoAlert && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowVideoAlert(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mr-4">
                    <IconInfoCircle className="text-primary-600 text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Video en producción</h3>
                </div>
                <button
                  onClick={() => setShowVideoAlert(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IconX size={24} />
                </button>
              </div>
              <p className="text-gray-700 mb-6">
                ¡Estamos trabajando en un video demo profesional de alta calidad para mostrarte POS Pro en acción!
              </p>
              <p className="text-gray-600 text-sm mb-8">
                Mientras tanto, puedes probar la versión gratuita o explorar todas las funciones en detalle.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setShowVideoAlert(false);
                    navigate('/register');
                  }}
                >
                  Probar Gratis Ahora
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowVideoAlert(false)}
                >
                  Entendido
                </Button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-grow">
          {/* Hero Section con IMAGEN real en lugar de placeholder */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-success-500/5 to-purple-500/10"></div>
            <div className="container relative mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge variant="primary" className="mb-6">
                    <IconSparkles size={16} className="mr-2" />
                    #1 en Puntos de Venta Perú 2024
                  </Badge>

                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Más que un POS,
                    <span className="block text-primary-500">tu aliado de crecimiento</span>
                  </h1>

                  <p className="text-xl text-gray-600 mb-8">
                    Todo lo que necesitas para vender más, organizarte mejor y hacer crecer tu negocio en una sola plataforma.
                  </p>

                  <div className="space-y-3 mb-10">
                    {heroFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <feature.icon className="text-success-500 mr-3" size={20} />
                        <span className="text-gray-700 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant="primary"
                      size="xl"
                      onClick={() => navigate('/register')}
                      className="px-8 py-4"
                    >
                      Probar Gratis 30 Días
                      <IconRocket size={20} className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="xl"
                      onClick={() => document.getElementById('video-demo')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-4"
                    >
                      <IconPlayerPlay size={20} className="mr-2" />
                      Ver Demo en Video
                    </Button>
                  </div>
                </div>

                {/* IMAGEN REAL DE DEMO INTERACTIVA */}
                <div className="relative">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                    <img
                      src="/1.png"
                      alt="POS Pro - Interfaz de punto de venta moderna"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">Demo Interactiva</h3>
                      <p className="text-white/90">Así se ve POS Pro en acción</p>
                    </div>
                  </div>

                  {/* Elementos flotantes */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-success-100 rounded-2xl flex items-center justify-centeeer shadow-lg">
                    <IconTrendingUp className="text-success-600 text-2xl" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <IconBolt className="text-primary-600 text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Beneficios en números */}
          <section className="py-16 bg-gradient-to-r from-primary-50 to-success-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">{benefit.metric}</div>
                    <div className="font-medium text-gray-700 mb-1">{benefit.title}</div>
                    <div className="text-sm text-gray-500">{benefit.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Características Principales */}
          <section className="py-20" id="core-features">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Potencia cada aspecto de tu negocio
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Diseñado pensando en la rapidez, la simplicidad y los resultados
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                {coreFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    hover
                    className="h-full transform transition-all duration-300 hover:-translate-y-2"
                    padding="p-8"
                  >
                    <div className="flex flex-col h-full">
                      <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                        <feature.icon className={`text-${feature.color}-600 text-2xl`} />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600 mb-6 flex-grow">
                        {feature.description}
                      </p>

                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-2">Incluye:</div>
                        <ul className="space-y-2">
                          {feature.highlights.map((point, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-700">
                              <IconCircleCheckFilled className="text-success-500 mr-2" size={14} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-6 border-t border-gray-200">
                        <div className="text-lg font-bold text-gray-900">{feature.stats}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Todas las características */}
              <div className="mb-20">
                <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Más de 50 características diseñadas para ti
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advancedFeatures.map((feature, index) => (
                    <Card key={index} hover className="p-6">
                      <div className="flex items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mr-4 flex-shrink-0`}>
                          <feature.icon className={`text-${feature.color}-600 text-xl`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-1">{feature.title}</h4>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {feature.points.map((point, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sección de Video Demo con alerta */}
              <div className="mb-20" id="video-demo">
                <Card className="overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="p-12">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        Mira POS Pro en acción
                      </h3>
                      <p className="text-gray-600 mb-8 text-lg">
                        En 3 minutos, descubre cómo puedes transformar tu manera de vender.
                      </p>
                      <ul className="space-y-4 mb-8">
                        <li className="flex items-center">
                          <IconCheck className="text-success-500 mr-3" size={20} />
                          <span className="text-gray-700">Proceso de venta completo</span>
                        </li>
                        <li className="flex items-center">
                          <IconCheck className="text-success-500 mr-3" size={20} />
                          <span className="text-gray-700">Dashboard en tiempo real</span>
                        </li>
                        <li className="flex items-center">
                          <IconCheck className="text-success-500 mr-3" size={20} />
                          <span className="text-gray-700">Facturación electrónica</span>
                        </li>
                      </ul>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setShowVideoAlert(true)}
                      >
                        <IconPlayerPlay size={20} className="mr-2" />
                        Reproducir Video Demo
                      </Button>
                    </div>
                    <div className="bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center min-h-[400px]">
                      <div className="text-center text-white p-8">
                        <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                          <IconPlayerPlay className="text-white text-4xl" />
                        </div>
                        <h4 className="text-2xl font-bold mb-2">Video Demo Próximamente</h4>
                        <p>Estamos preparando un video profesional de alta calidad</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* CTA Final */}
              <div className="text-center">
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-4xl font-bold text-gray-900 mb-6">
                    ¿Listo para dar el siguiente paso?
                  </h3>
                  <p className="text-xl text-gray-600 mb-10">
                    Prueba POS Pro gratis por 30 días. Sin tarjeta de crédito, sin compromiso.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="success"
                      size="xl"
                      onClick={() => navigate('/register')}
                      className="px-12 py-4 text-lg font-bold"
                    >
                      Comenzar Prueba Gratis
                      <IconArrowRight size={20} className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="xl"
                      onClick={() => navigate('/pricing')}
                      className="px-12 py-4 text-lg"
                    >
                      Ver Planes y Precios
                    </Button>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <IconCheck className="text-success-500 mr-2" size={16} />
                      No requiere instalación
                    </div>
                    <div className="flex items-center">
                      <IconCheck className="text-success-500 mr-2" size={16} />
                      Soporte 24/7 incluido
                    </div>
                    <div className="flex items-center">
                      <IconCheck className="text-success-500 mr-2" size={16} />
                      Migración asistida
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Features;