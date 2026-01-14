import React, { useState } from 'react';
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
  IconArrowRight,
  IconCurrencyPeso,
  IconTrendingUp,
  IconBuildingStore,
  IconReceipt2,
  IconChartBar,
  IconUsers,
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconCalendar,
  IconCalendarEvent
} from '@tabler/icons-react';

const Pricing = ({ darkMode = false, onThemeToggle, isAuthenticated = false, user, onLogout }) => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('startup');

  const handleSelectFreePlan = () => {
    navigate('/register');
  };

  const handleSelectPaidPlan = (planName) => {
    setSelectedPlan(planName);
    // En un entorno real, aquí redirigirías al checkout/pago
    alert(`Redirigiendo al checkout para el plan ${planName.toUpperCase()}`);
  };

  const plans = [
    {
      id: 'startup',
      name: 'Startup',
      icon: IconRocket,
      description: 'Perfecto para pequeños negocios y emprendedores',
      price: { 
        monthly: 'Gratis', 
        annual: 'Gratis'
      },
      period: billingCycle === 'monthly' ? '14 días de prueba gratis' : '14 días de prueba gratis',
      features: [
        { text: 'Hasta 500 transacciones/mes', included: true },
        { text: '1 usuario administrador', included: true },
        { text: 'Soporte por email', included: true },
        { text: 'Facturación básica CFDI 4.0', included: true },
        { text: 'Hasta 100 productos', included: true },
        { text: 'Reportes de ventas básicos', included: true },
        { text: 'App móvil incluida', included: true },
        { text: 'Dashboard simple', included: true },
        { text: 'Inventario básico', included: true },
        { text: 'Facturación electrónica SAT', included: false },
        { text: 'Soporte prioritario WhatsApp', included: false },
        { text: 'Múltiples sucursales', included: false },
      ],
      available: true,
      highlight: 'GRATIS',
      buttonText: 'Comenzar Gratis',
      buttonVariant: 'success',
      onClick: handleSelectFreePlan,
      trial: '14 días gratis',
      popular: true,
      free: true
    },
    {
      id: 'negocio',
      name: 'Negocio',
      icon: IconBuilding,
      description: 'Ideal para negocios en crecimiento establecido',
      price: { 
        monthly: '$899', 
        annual: '$899',
        save: '0%'
      },
      period: billingCycle === 'monthly' ? 'por mes (30 días)' : 'por año (12 meses)',
      annualPrice: '$10,788',
      features: [
        { text: 'Transacciones ilimitadas', included: true },
        { text: 'Hasta 5 usuarios incluidos', included: true },
        { text: 'Soporte email y WhatsApp', included: true },
        { text: 'Facturación completa CFDI 4.0', included: true },
        { text: 'Productos ilimitados', included: true },
        { text: 'Reportes avanzados con gráficos', included: true },
        { text: 'Hasta 3 sucursales', included: true },
        { text: 'CRM básico de clientes', included: true },
        { text: 'Facturación electrónica SAT', included: true },
        { text: 'Soporte prioritario 12/5', included: true },
        { text: 'Integración con bancos mexicanos', included: true },
        { text: 'Backup automático diario', included: true },
      ],
      available: true,
      highlight: 'MEJOR VALOR',
      buttonText: 'Contratar Plan',
      buttonVariant: 'primary',
      onClick: () => handleSelectPaidPlan('negocio'),
      trial: '14 días de prueba',
      popular: false
    },
    {
      id: 'empresarial',
      name: 'Empresarial',
      icon: IconCrown,
      description: 'Solución completa para empresas establecidas',
      price: { 
        monthly: '$1,999', 
        annual: '$1,999',
        save: '0%'
      },
      period: billingCycle === 'monthly' ? 'por mes (30 días)' : 'por año (12 meses)',
      annualPrice: '$23,988',
      features: [
        { text: 'Transacciones ilimitadas', included: true },
        { text: 'Usuarios ilimitados', included: true },
        { text: 'Soporte 24/7 telefónico y WhatsApp', included: true },
        { text: 'Facturación avanzada con complementos', included: true },
        { text: 'Inventario inteligente con alertas', included: true },
        { text: 'Reportes en tiempo real con IA', included: true },
        { text: 'Sucursales ilimitadas', included: true },
        { text: 'CRM avanzado + API', included: true },
        { text: 'Facturación SAT + pagos en línea', included: true },
        { text: 'Soporte dedicado personalizado', included: true },
        { text: 'Integración con contabilidad (Contpaq)', included: true },
        { text: 'Conexión POS físico (Ingenico, Verifone)', included: true },
      ],
      available: true,
      highlight: 'PROFESIONAL',
      buttonText: 'Contactar Ventas',
      buttonVariant: 'outline',
      onClick: () => handleSelectPaidPlan('empresarial'),
      trial: 'Demo personalizada',
      popular: false
    }
  ];

  const pricingComparison = [
    {
      category: 'Facturación',
      features: [
        { name: 'CFDI 3.3 Básico', startup: true, negocio: true, empresarial: true },
        { name: 'CFDI 4.0 Completo', startup: false, negocio: true, empresarial: true },
        { name: 'Complementos de pago', startup: false, negocio: true, empresarial: true },
        { name: 'Facturación global', startup: false, negocio: false, empresarial: true }
      ]
    },
    {
      category: 'Soporte',
      features: [
        { name: 'Email', startup: true, negocio: true, empresarial: true },
        { name: 'WhatsApp 12/5', startup: false, negocio: true, empresarial: true },
        { name: 'Teléfono 24/7', startup: false, negocio: false, empresarial: true },
        { name: 'Soporte dedicado', startup: false, negocio: false, empresarial: true }
      ]
    },
    {
      category: 'Integraciones',
      features: [
        { name: 'Bancos Mexicanos', startup: false, negocio: true, empresarial: true },
        { name: 'Contpaq / Aspel', startup: false, negocio: false, empresarial: true },
        { name: 'POS Físico', startup: false, negocio: false, empresarial: true },
        { name: 'API Completa', startup: false, negocio: true, empresarial: true }
      ]
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

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative py-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-green-500/5 to-purple-500/5"></div>
            
            <div className="container relative mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-4 py-2 rounded-full font-bold mb-4">
                  <IconCurrencyPeso size={16} className="mr-2" />
                  PRECIOS EN PESOS MEXICANOS • SIN COMISIONES OCULTAS
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Elige el plan perfecto para
                  <span className="block text-blue-500">tu negocio mexicano</span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Desde una prueba gratuita hasta soluciones empresariales completas. 
                  <span className="block text-green-600 font-medium mt-2">
                    Facturación CFDI 4.0 • Integración con bancos • Soporte en español
                  </span>
                </p>

                {/* Billing Toggle */}
                <Card className="inline-block p-1 mb-12">
                  <div className="flex items-center">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${billingCycle === 'monthly' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                      <IconCalendarEvent className="inline mr-2" size={16} />
                      Mensual
                    </button>
                    <button
                      onClick={() => setBillingCycle('annual')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${billingCycle === 'annual' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                      <IconCalendar className="inline mr-2" size={16} />
                      Anual
                    </button>
                  </div>
                </Card>
              </div>

              {/* Pricing Cards - TAMAÑO UNIFORME */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                {plans.map((plan, index) => (
                  <Card
                    key={plan.id}
                    className={`relative h-full transition-all duration-300 ${
                      plan.popular 
                        ? 'border-2 border-green-500 shadow-lg lg:scale-105 lg:-translate-y-2' 
                        : 'border border-gray-200'
                    }`}
                    padding="p-6"
                  >
                    {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <div className={`px-4 py-1.5 rounded-full font-bold text-xs ${
                          plan.free 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : plan.popular 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        }`}>
                          {plan.highlight}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                        plan.free ? 'bg-green-100' : plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <plan.icon className={`${
                          plan.free ? 'text-green-600' : plan.popular ? 'text-blue-600' : 'text-gray-600'
                        } text-xl`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-gray-500 text-sm">{plan.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline mb-1">
                        <span className={`${plan.free ? 'text-4xl' : 'text-3xl'} font-bold text-gray-900`}>
                          {plan.price[billingCycle]}
                        </span>
                        {!plan.free && <span className="text-gray-500 ml-1">/mes</span>}
                      </div>
                      <p className="text-gray-500 text-sm">{plan.period}</p>
                      
                      {!plan.free && billingCycle === 'annual' && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 text-sm">Precio total anual:</span>
                            <span className="font-bold text-blue-600">{plan.annualPrice}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-center">
                            Equivalente a {plan.price.annual}/mes × 12 meses
                          </div>
                        </div>
                      )}
                      
                      {plan.trial && !plan.free && (
                        <div className="mt-2 inline-flex items-center bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded">
                          <IconClock size={12} className="mr-1" />
                          {plan.trial}
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          {feature.included ? (
                            <IconCircleCheckFilled
                              className="mr-2 mt-0.5 flex-shrink-0 text-green-500"
                              size={18}
                            />
                          ) : (
                            <IconCircleXFilled className="text-gray-300 mr-2 mt-0.5 flex-shrink-0" size={18} />
                          )}
                          <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={plan.buttonVariant}
                      size="lg"
                      fullWidth
                      onClick={plan.onClick}
                      className="py-3 font-medium"
                    >
                      {plan.buttonText}
                      <IconChevronRight size={18} className="ml-1" />
                    </Button>

                    {plan.free && (
                      <p className="text-center text-gray-500 text-xs mt-2">
                        Sin tarjeta de crédito • Cancelación en 1 clic • Solo 14 días
                      </p>
                    )}
                    {!plan.free && plan.id === 'negocio' && (
                      <p className="text-center text-gray-500 text-xs mt-2">
                        Pago mensual/anual • Cancelación cuando quieras
                      </p>
                    )}
                    {!plan.free && plan.id === 'empresarial' && (
                      <p className="text-center text-gray-500 text-xs mt-2">
                        Contrato personalizado • Soporte dedicado
                      </p>
                    )}
                  </Card>
                ))}
              </div>

              {/* Información de períodos */}
              <div className="text-center max-w-4xl mx-auto mb-8">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0 md:mr-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                        <IconCalendar className="mr-2 text-blue-500" />
                        Información sobre períodos
                      </h3>
                      <p className="text-gray-600">
                        Entiende cómo funcionan nuestros períodos de facturación
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="font-bold text-green-600 mb-1">Prueba Gratis</div>
                        <div className="text-gray-700 text-sm">14 días completos</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="font-bold text-blue-600 mb-1">Plan Mensual</div>
                        <div className="text-gray-700 text-sm">30 días naturales</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="font-bold text-purple-600 mb-1">Plan Anual</div>
                        <div className="text-gray-700 text-sm">12 meses completos</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Garantía */}
              <div className="text-center max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0 md:mr-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                        <IconShieldCheck className="mr-2 text-green-500" />
                        Garantía de satisfacción
                      </h3>
                      <p className="text-gray-600">
                        Si no estás satisfecho en tus primeros 14 días, puedes cancelar sin costo alguno.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <IconCurrencyPeso size={28} className="text-green-500 mr-2" />
                      <div>
                        <div className="font-bold text-gray-900">100% sin riesgo</div>
                        <div className="text-gray-500 text-sm">Garantía de 14 días</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Comparación detallada de planes
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Encuentra el plan perfecto comparando todas las características
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-xl shadow-md">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="text-left p-6 font-bold text-gray-900 text-lg">Característica</th>
                      <th className="text-center p-6">
                        <div className="font-bold text-gray-900">Startup</div>
                        <div className="text-green-500 font-bold text-xl">Gratis</div>
                        <div className="text-gray-500 text-sm">14 días de prueba</div>
                      </th>
                      <th className="text-center p-6">
                        <div className="font-bold text-gray-900">Negocio</div>
                        <div className="text-blue-500 font-bold text-xl">$899/mes</div>
                        <div className="text-gray-500 text-sm">Mismo precio anual</div>
                      </th>
                      <th className="text-center p-6">
                        <div className="font-bold text-gray-900">Empresarial</div>
                        <div className="text-purple-500 font-bold text-xl">$1,999/mes</div>
                        <div className="text-gray-500 text-sm">Mismo precio anual</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingComparison.map((category, catIdx) => (
                      <React.Fragment key={catIdx}>
                        <tr className="bg-gray-50">
                          <td colSpan="4" className="p-4 font-bold text-gray-900 text-lg">
                            {category.category}
                          </td>
                        </tr>
                        {category.features.map((feature, featIdx) => (
                          <tr key={featIdx} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-4 text-gray-700">{feature.name}</td>
                            <td className="text-center p-4">
                              {feature.startup ? (
                                <IconCheck className="text-green-500 mx-auto" size={20} />
                              ) : (
                                <IconX className="text-gray-300 mx-auto" size={20} />
                              )}
                            </td>
                            <td className="text-center p-4">
                              {feature.negocio ? (
                                <IconCheck className="text-blue-500 mx-auto" size={20} />
                              ) : (
                                <IconX className="text-gray-300 mx-auto" size={20} />
                              )}
                            </td>
                            <td className="text-center p-4">
                              {feature.empresarial ? (
                                <IconCheck className="text-purple-500 mx-auto" size={20} />
                              ) : (
                                <IconX className="text-gray-300 mx-auto" size={20} />
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Preguntas frecuentes
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Todo lo que necesitas saber sobre nuestros planes y precios
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                <Card className="p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <IconHelpCircle className="mr-2 text-blue-500" size={20} />
                    ¿El plan Startup tiene algún costo?
                  </h4>
                  <p className="text-gray-600">
                    No, el plan Startup es completamente gratuito por 14 días. Después del período de prueba, puedes decidir si continuar con un plan de pago.
                  </p>
                </Card>

                <Card className="p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <IconHelpCircle className="mr-2 text-blue-500" size={20} />
                    ¿Por qué el precio es el mismo mensual y anual?
                  </h4>
                  <p className="text-gray-600">
                    Ofrecemos el mismo precio para facilitar tu decisión. Pagando anualmente obtienes 12 meses por el precio de 12, sin cambios.
                  </p>
                </Card>

                <Card className="p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <IconHelpCircle className="mr-2 text-blue-500" size={20} />
                    ¿Puedo cambiar de plan después?
                  </h4>
                  <p className="text-gray-600">
                    Sí, puedes cambiar entre planes en cualquier momento. La diferencia se prorratea en tu próxima factura.
                  </p>
                </Card>

                <Card className="p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <IconHelpCircle className="mr-2 text-blue-500" size={20} />
                    ¿Qué métodos de pago aceptan?
                  </h4>
                  <p className="text-gray-600">
                    Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), transferencias SPEI, y pago en OXXO.
                  </p>
                </Card>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <Card className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-white">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0 md:mr-8 text-left">
                      <h3 className="text-2xl font-bold mb-2">¡Comienza tu prueba gratuita hoy!</h3>
                      <p className="text-white/90">
                        Más de 5,000 negocios en México ya confían en nuestro sistema POS
                      </p>
                      <div className="flex items-center mt-4 space-x-6">
                        <div className="flex items-center">
                          <IconBuildingStore className="mr-2 text-white/80" />
                          <div>
                            <div className="font-bold">+5,000</div>
                            <div className="text-white/80 text-sm">Negocios</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <IconReceipt2 className="mr-2 text-white/80" />
                          <div>
                            <div className="font-bold">+2M</div>
                            <div className="text-white/80 text-sm">Facturas</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <IconUsers className="mr-2 text-white/80" />
                          <div>
                            <div className="font-bold">24/7</div>
                            <div className="text-white/80 text-sm">Soporte</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button 
                        variant="light" 
                        size="lg" 
                        onClick={handleSelectFreePlan}
                        className="px-8 py-3 font-bold"
                      >
                        <IconRocket size={18} className="mr-2" />
                        Comenzar Prueba Gratis
                      </Button>
                      <p className="text-white/80 text-xs mt-2">
                        14 días gratis • Sin tarjeta requerida • Cancelación inmediata
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="mt-6 bg-gray-50 rounded-xl p-4 max-w-2xl mx-auto">
                  <p className="text-gray-600 text-sm">
                    <strong>¿Necesitas ayuda para elegir?</strong> Contáctanos: 
                    <span className="text-blue-600 font-medium ml-2">
                      <IconBrandWhatsapp className="inline mr-1" size={14} /> WhatsApp: 55 1234 5678 • 
                      <IconPhone className="inline mx-2" size={14} /> Teléfono: 800 123 4567 • 
                      <IconMail className="inline mx-2" size={14} /> Email: ventas@pospro.mx
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