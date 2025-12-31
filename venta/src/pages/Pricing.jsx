// src/pages/Pricing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Alert from '../components/atoms/Alert';
import Badge from '../components/atoms/Badge';

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
  IconHelpCircle
} from '@tabler/icons-react';

const Pricing = ({ darkMode = false, onThemeToggle, isAuthenticated = false, user, onLogout }) => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('annual'); // Default a anual para mejor conversión

  const handleSelectFreePlan = () => {
    navigate('/register');
  };

  const plans = [
    {
      name: 'Startup',
      icon: IconRocket,
      description: 'Para emprendedores que comienzan',
      price: {
        monthly: 'Gratis',
        annual: 'Gratis'
      },
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
      popular: true,
      highlight: 'MÁS POPULAR',
      buttonText: 'Comenzar Gratis',
      buttonVariant: 'success',
      onClick: handleSelectFreePlan
    },
    {
      name: 'Negocio',
      icon: IconBuilding,
      description: 'Para negocios en crecimiento',
      price: {
        monthly: 'S/ 89',
        annual: 'S/ 79'
      },
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
      popular: false,
      highlight: 'MEJOR VALOR',
      buttonText: 'Probar Gratis 30 Días',
      buttonVariant: 'primary',
      disabled: false
    },
    {
      name: 'Empresarial',
      icon: IconCrown,
      description: 'Para empresas establecidas',
      price: {
        monthly: 'S/ 199',
        annual: 'S/ 169'
      },
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
      popular: false,
      highlight: 'POTENCIA TOTAL',
      buttonText: 'Contactar Ventas',
      buttonVariant: 'accent',
      disabled: false
    }
  ];

  const savings = {
    basic: 12,
    professional: 15,
    enterprise: 20
  };

  const testimonials = [
    {
      name: "Carlos Mendoza",
      business: "Supermercado El Ahorro",
      text: "Desde que implementamos POS Pro, nuestras ventas aumentaron 40%. La facturación electrónica es impecable.",
      rating: 5
    },
    {
      name: "Ana Torres",
      business: "Boutique Moda Elegante",
      text: "El control de inventario me salvó de quedarme sin stock en temporada alta. ¡Imprescindible!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "¿Puedo cambiar de plan cuando quiera?",
      answer: "Sí, puedes mejorar o degradar tu plan en cualquier momento. Los cambios se reflejan inmediatamente."
    },
    {
      question: "¿Qué pasa si supero los límites de mi plan?",
      answer: "Te notificaremos con anticipación y podrás mejorar tu plan fácilmente desde tu panel de control."
    },
    {
      question: "¿Ofrecen migración de datos?",
      answer: "Sí, nuestro equipo te ayuda a migrar tus datos desde otros sistemas sin costo en planes Empresarial y Negocio."
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
          {/* Hero con efecto gradient */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-success-500/5 to-accent-purple/5"></div>
            <div className="container relative mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <Badge variant="success" className="mb-4">
                  <IconSparkles size={16} className="mr-1" />
                  Sin tarjeta de crédito para empezar
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Elige tu plan
                  <span className="block text-primary-500">y escala sin límites</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                  Todo lo que necesitas para vender más, organizarte mejor y crecer rápido.
                  <span className="block text-success-500 font-medium mt-2">
                    Prueba gratis 30 días - Sin compromiso
                  </span>
                </p>
                
                {/* Billing Toggle mejorado */}
                <div className="inline-flex items-center bg-white rounded-2xl p-1 shadow-lg mb-12 border border-gray-200">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      billingCycle === 'monthly' 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                      billingCycle === 'annual' 
                      ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Anual 
                    <span className="ml-2 px-2 py-1 bg-success-500/20 text-success-600 text-xs font-bold rounded-full">
                      AHORRA {savings.professional}%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Planes con diseño de cards mejorado */}
          <section className="py-10 -mt-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                {plans.map((plan, index) => (
                  <Card 
                    key={index}
                    className={`relative h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                      plan.popular 
                      ? 'border-2 border-success-500 shadow-xl' 
                      : 'border border-gray-200'
                    } ${index === 1 ? 'lg:-translate-y-4' : ''}`}
                    padding="p-0"
                  >
                    {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                          plan.popular 
                          ? 'bg-gradient-to-r from-success-500 to-success-600 text-white' 
                          : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                        }`}>
                          {plan.highlight}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-8">
                      <div className="flex items-center mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 ${
                          plan.popular ? 'bg-success-100' : 'bg-primary-100'
                        }`}>
                          <plan.icon className={`${
                            plan.popular ? 'text-success-600' : 'text-primary-600'
                          } text-2xl`} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                          <p className="text-gray-500">{plan.description}</p>
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <div className="flex items-baseline mb-2">
                          <span className="text-5xl font-bold text-gray-900">
                            {plan.price[billingCycle]}
                          </span>
                          {plan.price[billingCycle] !== 'Gratis' && (
                            <span className="text-gray-500 ml-2 text-lg">/mes</span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">
                          {plan.period}
                        </p>
                        {billingCycle === 'annual' && plan.price[billingCycle] !== 'Gratis' && (
                          <p className="text-success-600 font-bold mt-2">
                            <IconCheck size={16} className="inline mr-1" />
                            Ahorras S/ {(parseInt(plan.price.monthly.replace('S/ ', '')) * 12 - parseInt(plan.price.annual.replace('S/ ', '')) * 12)} al año
                          </p>
                        )}
                      </div>
                      
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            {feature.included ? (
                              <IconCircleCheckFilled className="text-success-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                            ) : (
                              <IconCircleXFilled className="text-gray-300 mr-3 mt-0.5 flex-shrink-0" size={20} />
                            )}
                            <span className={feature.included ? 'text-gray-800' : 'text-gray-400 line-through'}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="px-8 pb-8">
                      <Button
                        variant={plan.buttonVariant}
                        size="xl"
                        fullWidth
                        onClick={plan.onClick}
                        disabled={plan.disabled}
                        className={`py-4 rounded-xl font-bold text-lg ${
                          plan.popular ? 'shadow-lg hover:shadow-xl' : ''
                        }`}
                      >
                        {plan.buttonText}
                        {!plan.disabled && <IconChevronRight size={20} className="ml-2" />}
                      </Button>
                      {plan.name === 'Startup' && (
                        <p className="text-center text-gray-500 text-sm mt-3">
                          Sin tarjeta de crédito • Cancelación en 1 clic
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Comparativa de planes */}
              <div className="mb-20">
                <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Compara todos los planes
                </h3>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-6 font-bold text-gray-900">Características</th>
                        {plans.map((plan, idx) => (
                          <th key={idx} className="p-6 text-center">
                            <div className="font-bold text-gray-900">{plan.name}</div>
                            <div className="text-sm text-gray-500">{plan.description}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        'Transacciones mensuales',
                        'Usuarios incluidos',
                        'Sucursales',
                        'Facturación electrónica',
                        'Soporte 24/7',
                        'Reportes avanzados',
                        'API acceso',
                        'Backups automáticos'
                      ].map((feature, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/50' : ''}>
                          <td className="p-6 font-medium text-gray-700">{feature}</td>
                          {plans.map((plan, pIdx) => (
                            <td key={pIdx} className="p-6 text-center">
                              {pIdx === 0 ? '100' : 
                               pIdx === 1 ? 'Ilimitadas' : 
                               'Ilimitadas'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Testimonios */}
              <div className="mb-20">
                <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Lo que dicen nuestros clientes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {testimonials.map((testimonial, idx) => (
                    <Card key={idx} className="p-8">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <IconStarFilled key={i} className="text-yellow-400 mr-1" size={20} />
                        ))}
                      </div>
                      <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.text}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                          <span className="font-bold text-primary-600">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{testimonial.name}</div>
                          <div className="text-gray-500">{testimonial.business}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* FAQ mejorado */}
              <div className="mb-16">
                <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  Preguntas frecuentes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {faqs.map((faq, idx) => (
                    <Card key={idx} hover className="p-6">
                      <div className="flex items-start mb-4">
                        <IconHelpCircle className="text-primary-500 mr-3 mt-1 flex-shrink-0" size={24} />
                        <h4 className="font-bold text-gray-900 text-lg">{faq.question}</h4>
                      </div>
                      <p className="text-gray-600">{faq.answer}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CTA final */}
              <div className="text-center mb-16">
                <Card className="bg-gradient-to-r from-primary-500 to-success-500 p-12">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    ¿Listo para transformar tu negocio?
                  </h3>
                  <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
                    Únete a más de 5,000 negocios que ya confían en POS Pro
                  </p>
                  <Button 
                    variant="light" 
                    size="xl"
                    onClick={handleSelectFreePlan}
                    className="px-12 py-4 text-lg font-bold"
                  >
                    Comenzar Prueba Gratis 30 Días
                    <IconRocket size={20} className="ml-2" />
                  </Button>
                  <p className="text-white/80 text-sm mt-4">
                    Sin compromiso • Sin tarjeta de crédito • Cancelación inmediata
                  </p>
                </Card>
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