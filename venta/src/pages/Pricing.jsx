import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import {
  IconRocket,
  IconBuilding,
  IconCrown,
  IconShieldCheck,
  IconRefresh,
  IconCloud,
  IconDeviceMobile,
  IconCreditCard,
  IconClock,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconHeadphones,
  IconSparkles,
  IconCheck,
  IconChevronRight,
  IconStarFilled,
  IconHelpCircle,
  IconInfoCircle,
  IconX,
  IconTools,              // ← Reemplaza IconConstruction
  IconAlertTriangle       // ← Reemplaza IconProgressAlert
} from '@tabler/icons-react';

const Pricing = ({ darkMode = false, onThemeToggle, isAuthenticated = false, user, onLogout }) => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('annual');
  const [showComingSoonAlert, setShowComingSoonAlert] = useState(false);
  const [showBetaModal, setShowBetaModal] = useState(false);

  // Mostrar modal Beta solo la primera vez
  useEffect(() => {
    const hasSeenBetaModal = localStorage.getItem('hasSeenBetaModal-pricing');
    if (!hasSeenBetaModal) {
      setTimeout(() => {
        setShowBetaModal(true);
      }, 1000);
    }
  }, []);

  // Controlar alerta flotante: solo una vez por sesión del navegador
  useEffect(() => {
    const hasSeenAlert = localStorage.getItem('hasSeenComingSoonAlert');
    if (!hasSeenAlert) {
      setShowComingSoonAlert(true);

      // Cerrar automáticamente después de 10 segundos
      const timer = setTimeout(() => {
        setShowComingSoonAlert(false);
        localStorage.setItem('hasSeenComingSoonAlert', 'true');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseBetaModal = () => {
    setShowBetaModal(false);
    localStorage.setItem('hasSeenBetaModal-pricing', 'true');
  };

  const handleCloseComingSoonAlert = () => {
    setShowComingSoonAlert(false);
    localStorage.setItem('hasSeenComingSoonAlert', 'true');
  };

  const handleSelectFreePlan = () => {
    navigate('/register');
  };

  const handleShowComingSoon = () => {
    setShowComingSoonAlert(true);
  };

  const plans = [
    {
      name: 'Startup',
      icon: IconRocket,
      description: 'Para emprendedores que comienzan',
      price: { monthly: 'Gratis', annual: 'Gratis' },
      period: '30 días gratis',
      features: [
        { text: '100 transacciones/mes', included: true },
        { text: '1 usuario administrador', included: true },
        { text: 'Soporte por email', included: true },
        { text: 'Facturación básica', included: true },
        { text: 'Hasta 50 productos', included: true },
        { text: 'Reportes básicos', included: true },
        { text: 'App móvil incluida', included: true },
        { text: 'Dashboard simple', included: true },
        { text: 'Facturación electrónica', included: false },
        { text: 'Soporte prioritario', included: false },
      ],
      available: true,
      highlight: 'DISPONIBLE AHORA',
      buttonText: 'Comenzar Gratis',
      buttonVariant: 'success',
      onClick: handleSelectFreePlan,
      note: 'Versión Beta Activa'
    },
    {
      name: 'Negocio',
      icon: IconBuilding,
      description: 'Para negocios en crecimiento',
      price: { monthly: 'S/ 89', annual: 'S/ 79' },
      period: billingCycle === 'monthly' ? 'por mes' : 'por mes, facturado anualmente',
      features: [
        { text: 'Transacciones ilimitadas', included: true },
        { text: '5 usuarios incluidos', included: true },
        { text: 'Soporte email y chat', included: true },
        { text: 'Facturación completa', included: true },
        { text: 'Productos ilimitados', included: true },
        { text: 'Reportes avanzados', included: true },
        { text: 'Hasta 3 sucursales', included: true },
        { text: 'CRM básico', included: true },
        { text: 'Facturación electrónica', included: true },
        { text: 'Soporte prioritario', included: true },
      ],
      available: false,
      highlight: 'PRÓXIMAMENTE',
      buttonText: 'Notificar Disponibilidad',
      buttonVariant: 'outline',
      onClick: handleShowComingSoon,
      note: 'En Desarrollo'
    },
    {
      name: 'Empresarial',
      icon: IconCrown,
      description: 'Para empresas establecidas',
      price: { monthly: 'S/ 199', annual: 'S/ 169' },
      period: billingCycle === 'monthly' ? 'por mes' : 'por mes, facturado anualmente',
      features: [
        { text: 'Transacciones ilimitadas', included: true },
        { text: 'Usuarios ilimitados', included: true },
        { text: 'Soporte 24/7 telefónico', included: true },
        { text: 'Facturación avanzada', included: true },
        { text: 'Inventario con alertas', included: true },
        { text: 'Reportes en tiempo real', included: true },
        { text: 'Sucursales ilimitadas', included: true },
        { text: 'CRM avanzado + API', included: true },
        { text: 'Facturación SUNAT + PSE', included: true },
        { text: 'Soporte dedicado', included: true },
      ],
      available: false,
      highlight: 'PRÓXIMAMENTE',
      buttonText: 'Contactar para Beta',
      buttonVariant: 'outline',
      onClick: handleShowComingSoon,
      note: 'Planificado Q2 2024'
    }
  ];

  // Modal información Beta
  const BetaInfoModal = () => {
    if (!showBetaModal) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleCloseBetaModal} />
        <div className="relative w-full max-w-lg bg-white rounded-2xl border border-primary-200 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mr-4">
                  <IconTools className="text-primary-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">¡Importante!</h3>
                  <p className="text-gray-500">Información sobre nuestros planes</p>
                </div>
              </div>
              <button onClick={handleCloseBetaModal} className="text-gray-400 hover:text-gray-600">
                <IconX size={24} />
              </button>
            </div>

            <div className="mb-8">
              <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-gray-900 text-lg mb-3">
                  <IconInfoCircle className="inline mr-2 text-primary-500" size={20} />
                  Estado Actual del Servicio
                </h4>
                <p className="text-gray-700 mb-4">
                  Actualmente nos encontramos en <strong className="text-primary-600">fase Beta</strong> y solo tenemos disponible el <strong>plan Startup gratuito</strong>.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <IconCheck className="text-success-500 mr-2" size={18} />
                    <span className="text-gray-700">Plan Startup gratuito: <strong>DISPONIBLE</strong></span>
                  </div>
                  <div className="flex items-center">
                    <IconTools className="text-warning-500 mr-2" size={18} />
                    <span className="text-gray-700">Planes pagos: <strong className="text-warning-600">EN DESARROLLO</strong></span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 font-bold text-sm">i</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">¿Qué incluye el plan Beta?</h5>
                    <p className="text-gray-600 text-sm">Todas las funciones básicas para que puedas probar el sistema completamente gratis por 30 días.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center mr-3 mt-1">
                    <IconSparkles className="text-success-600" size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">Beneficios para usuarios Beta</h5>
                    <p className="text-gray-600 text-sm">Los usuarios que prueben ahora recibirán descuentos exclusivos cuando lancemos los planes pagos.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-lg bg-warning-100 flex items-center justify-center mr-3 mt-1">
                    <IconAlertTriangle className="text-warning-600" size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">¿Cuándo estarán los planes pagos?</h5>
                    <p className="text-gray-600 text-sm">Estamos trabajando activamente para lanzar los planes completos en los próximos meses.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" fullWidth onClick={() => { handleCloseBetaModal(); handleSelectFreePlan(); }}>
                <IconRocket className="mr-2" size={18} />
                Probar Gratis Ahora
              </Button>
              <Button variant="outline" fullWidth onClick={handleCloseBetaModal}>
                Entendido, Continuar
              </Button>
            </div>
            <p className="text-center text-gray-500 text-xs mt-4">Este mensaje solo se mostrará una vez</p>
          </div>
        </div>
      </div>
    );
  };

  // Alerta flotante sin parpadeo
  const ComingSoonAlert = () => {
    if (!showComingSoonAlert) return null;

    return (
      <div className="fixed inset-x-0 top-20 z-50 px-4 animate-in fade-in slide-in-from-top duration-500">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-warning-50 to-orange-50 border border-warning-200 rounded-xl shadow-lg p-4 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center mr-4">
                  <IconTools className="text-warning-600" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">¡Planes en Desarrollo!</h4>
                  <p className="text-gray-700 text-sm">
                    Los planes pagos estarán disponibles próximamente. Por ahora, disfruta de nuestra versión Beta gratuita.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseComingSoonAlert}
                className="text-gray-400 hover:text-gray-600 ml-4 transition-colors"
                aria-label="Cerrar"
              >
                <IconX size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

        <ComingSoonAlert />
        <BetaInfoModal />

        <main className="flex-grow">
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-success-500/5 to-purple-500/5"></div>

            <div className="absolute top-0 left-0 right-0">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4">
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <IconTools className="mr-2" size={18} />
                    <span className="font-bold">¡ESTAMOS EN BETA!</span>
                  </div>
                  <span className="sm:ml-4 text-sm opacity-90">
                    Solo el plan Startup gratuito está disponible actualmente. Trabajando en mejores versiones.
                  </span>
                </div>
              </div>
            </div>

            <div className="container relative mx-auto px-4 pt-16">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-4 py-2 rounded-full font-bold mb-4">
                  <IconSparkles size={16} className="mr-2" />
                  FASE BETA • PLAN GRATUITO DISPONIBLE
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Prueba nuestro POS Gratis
                  <span className="block text-primary-500">Planes Completos Próximamente</span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Actualmente ofrecemos nuestro <strong className="text-primary-600">plan Startup completamente gratis</strong> para que pruebes todas las funciones básicas.
                  <span className="block text-warning-600 font-medium mt-2">
                    Estamos desarrollando activamente los planes pagos para brindarte un mejor servicio.
                  </span>
                </p>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                      <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                        <IconTools className="text-yellow-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-900 text-lg">¡En Construcción!</h3>
                        <p className="text-gray-600 text-sm">Mejores planes en camino</p>
                      </div>
                    </div>
                    <div className="text-left md:text-center">
                      <p className="text-gray-700">
                        <strong>Solo el plan Startup está disponible actualmente.</strong> Estamos trabajando duro para lanzar los planes pagos con más funciones y mejor soporte.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center bg-white rounded-xl p-1 shadow-md mb-8 border border-gray-200">
                  <div className="px-6 py-3 rounded-lg font-medium bg-primary-500 text-white">
                    Versión Beta Gratuita
                  </div>
                  <button
                    onClick={() => setShowBetaModal(true)}
                    className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center"
                  >
                    <IconInfoCircle className="mr-2" size={18} />
                    Más Información
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="py-10">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nuestros Planes (Estado Actual)
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  <strong className="text-primary-600">✓ Plan Startup:</strong> Disponible ahora •
                  <strong className="text-warning-600 ml-4">🔄 Planes Negocio y Empresarial:</strong> En desarrollo
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                {plans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`relative h-full transition-all duration-300 ${
                      plan.available
                        ? 'border-2 border-success-500 shadow-lg'
                        : 'border border-gray-200 opacity-90'
                    } ${index === 0 ? 'lg:scale-105 lg:-translate-y-2' : ''}`}
                    padding="p-6"
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`px-4 py-1.5 rounded-full font-bold text-xs ${
                        plan.available
                          ? 'bg-gradient-to-r from-success-500 to-success-600 text-white'
                          : 'bg-gradient-to-r from-warning-500 to-warning-600 text-white'
                      }`}>
                        {plan.highlight}
                      </div>
                    </div>

                    {!plan.available && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
                        <div className="text-center p-6">
                          <IconTools className="text-warning-600 text-4xl mx-auto mb-4" />
                          <h4 className="font-bold text-gray-900 text-lg mb-2">En Desarrollo</h4>
                          <p className="text-gray-600 text-sm max-w-xs">
                            Estamos trabajando en este plan para ofrecerte un mejor servicio
                          </p>
                        </div>
                      </div>
                    )}

                    <div className={`${!plan.available ? 'opacity-50' : ''}`}>
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                          plan.available ? 'bg-success-100' : 'bg-gray-100'
                        }`}>
                          <plan.icon className={`${plan.available ? 'text-success-600' : 'text-gray-400'} text-xl`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                          <p className="text-gray-500 text-sm">{plan.description}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline mb-1">
                          <span className="text-3xl font-bold text-gray-900">{plan.price[billingCycle]}</span>
                          {plan.price[billingCycle] !== 'Gratis' && <span className="text-gray-500 ml-1">/mes</span>}
                        </div>
                        <p className="text-gray-500 text-sm">{plan.period}</p>
                        {plan.note && (
                          <div className={`mt-2 text-xs px-2 py-1 rounded ${
                            plan.available ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                          }`}>
                            {plan.note}
                          </div>
                        )}
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            {feature.included ? (
                              <IconCircleCheckFilled
                                className={`mr-2 mt-0.5 flex-shrink-0 ${plan.available ? 'text-success-500' : 'text-gray-300'}`}
                                size={18}
                              />
                            ) : (
                              <IconCircleXFilled className="text-gray-300 mr-2 mt-0.5 flex-shrink-0" size={18} />
                            )}
                            <span className={`text-sm ${
                              feature.included && plan.available ? 'text-gray-700' : 'text-gray-400'
                            } ${!plan.available && feature.included ? 'line-through' : ''}`}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      variant={plan.buttonVariant}
                      size="lg"
                      fullWidth
                      onClick={plan.onClick}
                      disabled={!plan.available}
                      className={`py-3 font-medium ${!plan.available ? 'opacity-50' : ''}`}
                    >
                      {plan.buttonText}
                      {plan.available && <IconChevronRight size={18} className="ml-1" />}
                    </Button>

                    {plan.available && (
                      <p className="text-center text-gray-500 text-xs mt-2">
                        Sin tarjeta de crédito • Cancelación en 1 clic
                      </p>
                    )}
                  </Card>
                ))}
              </div>

              <Card className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="mb-4 md:mb-0 md:mr-8">
                      <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
                        <IconTools className="text-blue-600 text-2xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        ¿Por qué solo el plan gratuito está disponible?
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Estamos en <strong>fase Beta</strong> perfeccionando nuestro sistema. Queremos asegurarnos de ofrecerte la mejor experiencia posible antes de lanzar los planes pagos. Tu feedback como usuario beta nos ayuda a mejorar.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/50 rounded-lg p-3">
                          <div className="font-bold text-primary-600 mb-1">1. Calidad Primero</div>
                          <p className="text-gray-600 text-sm">Queremos ofrecerte un producto estable y confiable</p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                          <div className="font-bold text-primary-600 mb-1">2. Tu Feedback</div>
                          <p className="text-gray-600 text-sm">Tus comentarios nos ayudan a mejorar las funciones</p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                          <div className="font-bold text-primary-600 mb-1">3. Lanzamiento Próximo</div>
                          <p className="text-gray-600 text-sm">Planes pagos en desarrollo para Q2 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  Preguntas sobre nuestra fase Beta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-5">
                    <h4 className="font-bold text-gray-900 mb-3">
                      <IconHelpCircle className="inline mr-2 text-primary-500" size={20} />
                      ¿Cuándo estarán disponibles los planes pagos?
                    </h4>
                    <p className="text-gray-600">
                      Estamos trabajando para lanzar los planes Negocio y Empresarial en los próximos meses.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <h4 className="font-bold text-gray-900 mb-3">
                      <IconHelpCircle className="inline mr-2 text-primary-500" size={20} />
                      ¿El plan gratuito tendrá límite de tiempo?
                    </h4>
                    <p className="text-gray-600">
                      El plan Startup gratuito seguirá disponible durante toda nuestra fase Beta.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <h4 className="font-bold text-gray-900 mb-3">
                      <IconHelpCircle className="inline mr-2 text-primary-500" size={20} />
                      ¿Habrá descuentos para usuarios beta?
                    </h4>
                    <p className="text-gray-600">
                      ¡Sí! Los usuarios que prueben nuestra versión beta recibirán descuentos exclusivos.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <h4 className="font-bold text-gray-900 mb-3">
                      <IconHelpCircle className="inline mr-2 text-primary-500" size={20} />
                      ¿Puedo sugerir funciones para los planes pagos?
                    </h4>
                    <p className="text-gray-600">
                      ¡Absolutamente! Tu feedback es invaluable. Envía tus sugerencias desde tu panel de control.
                    </p>
                  </Card>
                </div>
              </div>

              <div className="text-center mb-12">
                <Card className="bg-gradient-to-r from-primary-500 to-success-500 p-8 text-white">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0 md:mr-8 text-left">
                      <h3 className="text-2xl font-bold mb-2">¡Sé parte de nuestra Beta!</h3>
                      <p className="text-white/90">
                        Prueba POS Pro gratis ahora y ayuda a dar forma al futuro de nuestro sistema.
                      </p>
                    </div>
                    <div>
                      <Button variant="light" size="lg" onClick={handleSelectFreePlan} className="px-8 py-3 font-bold">
                        <IconRocket size={18} className="mr-2" />
                        Probar Beta Gratis
                      </Button>
                      <p className="text-white/80 text-xs mt-2">
                        Sin compromiso • Sin tarjeta • Solo versión Beta por ahora
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="mt-6 bg-gray-50 rounded-xl p-4 max-w-2xl mx-auto">
                  <p className="text-gray-600 text-sm">
                    <strong>Estado del servicio:</strong> Fase Beta • Solo plan gratuito disponible •
                    <span className="text-success-600 font-medium ml-2">
                      ¡Prueba ahora y obtén beneficios exclusivos!
                    </span>
                  </p>
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

export default Pricing;