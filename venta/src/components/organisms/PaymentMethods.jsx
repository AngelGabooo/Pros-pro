// src/components/molecules/PaymentMethods.jsx
import React, { useState, useEffect } from 'react';
import Input from '../atoms/Input';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import { authService } from '../../services/api';
import {
  IconCash,
  IconCreditCard,
  IconTransferIn as IconExchangeAlt,
  IconBuildingBank,
  IconUser,
  IconWallet,
  IconCurrencyDollar
} from '@tabler/icons-react';

const PaymentMethods = ({ 
  paymentMethod, 
  setPaymentMethod, 
  total,
  cashReceived,
  setCashReceived,
  onCheckout
}) => {
  const [loading, setLoading] = useState(false); // ← AÑADIDO
  const [referenceNumber, setReferenceNumber] = useState('');
  const [cardType, setCardType] = useState('');
  const [userBankData, setUserBankData] = useState(null);

  // Cargar datos bancarios del usuario actual
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserBankData({
        banco: currentUser.banco || 'No configurado',
        tipoCuenta: currentUser.tipoCuenta || 'No configurado',
        numeroCuenta: currentUser.numeroCuenta || 'No configurado',
        cci: currentUser.cci || 'No configurado',
        titularCuenta: currentUser.titularCuenta || `${currentUser.nombre} ${currentUser.apellido}`,
        monedaCuenta: currentUser.monedaCuenta || 'PEN'
      });
    }
  }, []);

  const cardTypes = [
    { id: 'visa', name: 'Visa', color: 'text-blue-600' },
    { id: 'mastercard', name: 'Mastercard', color: 'text-red-600' },
    { id: 'amex', name: 'American Express', color: 'text-blue-500' },
    { id: 'discover', name: 'Discover', color: 'text-orange-600' }
  ];

  const paymentMethods = [
    { id: 'efectivo', name: 'Efectivo', icon: IconCash, description: 'Pago en efectivo' },
    { id: 'tarjeta', name: 'Tarjeta', icon: IconCreditCard, description: 'Procesado en terminal' },
    { id: 'transferencia', name: 'Transferencia', icon: IconExchangeAlt, description: 'Transferencia bancaria' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: userBankData?.monedaCuenta || 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const change = paymentMethod === 'efectivo' ? cashReceived - total : 0;

  const validateTransfer = () => {
    if (!referenceNumber || referenceNumber.trim().length < 6) {
      alert('Ingresa el número de referencia de la transferencia (mínimo 6 caracteres)');
      return false;
    }
    return true;
  };

  const validateCash = () => {
    if (cashReceived < total) {
      alert(`El efectivo recibido es menor al total`);
      return false;
    }
    return true;
  };

  const validateCard = () => {
    if (!cardType) {
      alert('Por favor selecciona el tipo de tarjeta');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    switch (paymentMethod) {
      case 'efectivo': return validateCash();
      case 'tarjeta': return validateCard();
      case 'transferencia': return validateTransfer();
      default:
        alert('Selecciona un método de pago');
        return false;
    }
  };

  const handleCheckout = () => {
  if (validatePayment()) {
    setLoading(true); // ← Mostrar loading

    const paymentData = {
      method: paymentMethod,
      amount: total,
      date: new Date().toISOString(),
      cashierBankInfo: userBankData
    };

    if (paymentMethod === 'tarjeta') {
      paymentData.cardInfo = { type: cardType };
    } else if (paymentMethod === 'transferencia') {
      paymentData.reference = referenceNumber.trim();
    } else if (paymentMethod === 'efectivo') {
      paymentData.cashReceived = cashReceived;
      paymentData.change = change;
    }

    // Llamar al checkout y quitar loading después (aunque sea async)
    onCheckout(paymentData);
    setLoading(false); // ← Quitar loading (puedes moverlo al finally si quieres)
  }
};

  const getButtonText = () => {
    if (total === 0) return 'Agregar productos primero';
    
    switch (paymentMethod) {
      case 'efectivo':
        return `Confirmar pago en efectivo ${formatCurrency(total)}`;
      case 'tarjeta':
        return `Procesar con tarjeta ${formatCurrency(total)}`;
      case 'transferencia':
        return `Confirmar transferencia ${formatCurrency(total)}`;
      default:
        return `Pagar ${formatCurrency(total)}`;
    }
  };

  return (
    <Card title="Método de Pago" className="payment-methods-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Selecciona método de pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => {
                setPaymentMethod(method.id);
                if (method.id !== 'efectivo') setCashReceived(0);
                if (method.id !== 'tarjeta') setCardType('');
                if (method.id !== 'transferencia') setReferenceNumber('');
              }}
              className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                paymentMethod === method.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <method.icon className={paymentMethod === method.id ? 'text-primary-500' : 'text-gray-400'} size={24} />
              <span className="text-sm font-medium mt-2">{method.name}</span>
              <span className="text-xs text-gray-500 mt-1 text-center">{method.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Efectivo */}
        {paymentMethod === 'efectivo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Efectivo Recibido
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={cashReceived}
                onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                prefix={userBankData?.monedaCuenta === 'MXN' ? '$' : 'S/ '}
                variant="price"
                step="0.01"
                min="0"
              />
            </div>

            {cashReceived > 0 && total > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Total a pagar:</span>
                  <span className="text-lg font-bold text-primary-600">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Efectivo recibido:</span>
                  <span className="text-lg font-medium text-gray-900">{formatCurrency(cashReceived)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-700 font-medium">Cambio:</span>
                  <span className={`text-xl font-bold ${change >= 0 ? 'text-success-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(change))}
                  </span>
                </div>
                {change < 0 && (
                  <Alert type="warning" size="sm">
                    Faltan {formatCurrency(Math.abs(change))} para completar el pago
                  </Alert>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tarjeta */}
        {paymentMethod === 'tarjeta' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de tarjeta
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cardTypes.map(card => (
                  <button
                    key={card.id}
                    onClick={() => setCardType(card.id)}
                    className={`p-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                      cardType === card.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <IconCreditCard className={`${card.color} ${cardType === card.id ? 'text-3xl' : 'text-2xl'}`} />
                    <span className={`text-sm font-medium mt-2 ${cardType === card.id ? 'text-primary-600' : 'text-gray-700'}`}>
                      {card.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {cardType && (
              <Alert type="info">
                Procesar pago con {cardTypes.find(c => c.id === cardType)?.name} en terminal externa
              </Alert>
            )}
          </div>
        )}

        {/* Transferencia - AHORA MUESTRA LOS DATOS REALES DEL CAJERO */}
        {paymentMethod === 'transferencia' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Referencia / Operación
              </label>
              <Input
                type="text"
                placeholder="Ej: 0012345678"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                icon={IconExchangeAlt}
              />
            </div>

            {/* Datos bancarios del cajero */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-5">
              <h4 className="text-lg font-semibold text-primary-800 mb-4 flex items-center">
                <IconBuildingBank className="mr-2" size={20} />
                Datos para la transferencia
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Titular:</span>
                  <span className="font-medium text-gray-900">{userBankData?.titularCuenta || 'No configurado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Banco:</span>
                  <span className="font-medium text-gray-900">{userBankData?.banco || 'No configurado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de cuenta:</span>
                  <span className="font-medium text-gray-900">{userBankData?.tipoCuenta || 'No configurado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de cuenta:</span>
                  <span className="font-mono font-medium text-gray-900">{userBankData?.numeroCuenta || 'No configurado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CCI:</span>
                  <span className="font-mono font-medium text-gray-900">{userBankData?.cci || 'No configurado'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-primary-200">
                  <span className="text-gray-700 font-medium">Moneda:</span>
                  <span className="font-bold text-primary-700 flex items-center">
                    <IconCurrencyDollar className="mr-1" size={16} />
                    {userBankData?.monedaCuenta === 'MXN' ? 'Pesos (MXN)' : 'Dolares (USD)'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-primary-200">
                  <span className="text-gray-700 font-medium">Monto a transferir:</span>
                  <span className="text-xl font-bold text-primary-800">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <Alert type="info">
              <p className="text-sm">
                <strong>Importante:</strong> El cliente debe realizar la transferencia usando los datos mostrados arriba.
                Una vez recibida la confirmación, ingresa el número de operación.
              </p>
            </Alert>
          </div>
        )}
      </div>

      {/* Resumen y botón final */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 font-medium">Total a pagar:</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrency(total)}
          </span>
        </div>

        <Button
          variant="success"
          size="lg"
          fullWidth
          icon={paymentMethod === 'tarjeta' ? IconCreditCard : IconCash}
          onClick={handleCheckout}
          disabled={total === 0 || loading}
        >
          {getButtonText()}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Al confirmar, aceptas los términos de venta del establecimiento.
        </p>
      </div>
    </Card>
  );
};

export default PaymentMethods;