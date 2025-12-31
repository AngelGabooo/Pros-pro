import React, { useState } from 'react';
import {
  IconTrash,
  IconMinus,
  IconPlus,
  IconCirclePlus,
  IconShoppingCart
} from '@tabler/icons-react';

const CartSummary = ({
  cart,
  products,
  updateQuantity,
  removeFromCart,
  formatCurrency
}) => {
  const [quickAdd, setQuickAdd] = useState({});
  
  const handleQuickAdd = (productId, amount) => {
    const cartItem = cart.find(item => item.id === productId);
    const product = products?.find(p => p.id === productId);
    
    if (cartItem && product) {
      const newQuantity = cartItem.quantity + amount;
      if (newQuantity <= product.stock && newQuantity >= 1) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleAddMultiple = (productId, count) => {
    const product = products?.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (product && cartItem) {
      const currentQuantity = cartItem.quantity;
      const availableStock = product.stock - currentQuantity;
      const quantityToAdd = Math.min(count, availableStock);
      
      if (quantityToAdd > 0) {
        updateQuantity(productId, currentQuantity + quantityToAdd);
      }
      setQuickAdd(prev => ({ ...prev, [productId]: false }));
    }
  };

  const quickAmountOptions = [2, 3, 5];

  if (cart.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <IconShoppingCart className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 font-medium">El carrito está vacío</p>
          <p className="text-sm text-gray-400 mt-1">Agrega productos para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.map(item => {
        const productStock = products?.find(p => p.id === item.id)?.stock || 0;

        return (
          <div
            key={`${item.id}-${item.quantity}`}
            className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow duration-200"
          >
            {/* Nombre y eliminar */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatCurrency(item.price)} c/u
                </div>
                {productStock > 0 && (
                  <div className="text-xs mt-1">
                    <span className={`font-medium ${productStock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                      Stock: {productStock}
                    </span>
                    <span className="text-gray-400 ml-2">
                      • Disponible: {productStock - item.quantity}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Eliminar producto"
              >
                <IconTrash size={16} />
              </button>
            </div>

            {/* Controles de cantidad */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <IconMinus size={14} />
                </button>

                <div className="relative">
                  <span className="font-bold text-gray-900 text-base min-w-10 text-center inline-block px-3 py-1.5 bg-gray-50 border rounded-lg">
                    {item.quantity}
                  </span>
                  {item.quantity > 1 && (
                    <span className="absolute -top-2 -right-2 text-xs font-medium bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center animate-pulse-subtle">
                      +{item.quantity - 1}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= productStock}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <IconPlus size={14} />
                </button>
              </div>

              <div className="font-bold text-primary-600 text-base">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>

            {/* Botones rápidos */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex space-x-1.5">
                {quickAmountOptions.map(amount => {
                  const canAdd = amount <= (productStock - item.quantity);
                  return (
                    <button
                      key={amount}
                      onClick={() => handleQuickAdd(item.id, amount)}
                      disabled={!canAdd}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                        canAdd
                          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      +{amount}
                    </button>
                  );
                })}
                <button
                  onClick={() => setQuickAdd(prev => ({ ...prev, [item.id]: true }))}
                  className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 hover:scale-105 flex items-center"
                >
                  <IconCirclePlus size={14} className="mr-1" />
                  Más
                </button>
              </div>

              {productStock - item.quantity < 5 && productStock - item.quantity > 0 && (
                <div className="text-xs text-amber-600 font-medium">
                  ¡Quedan {productStock - item.quantity}!
                </div>
              )}
            </div>

            {/* Modal añadir múltiples */}
            {quickAdd[item.id] && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Añadir más unidades</span>
                  <button
                    onClick={() => setQuickAdd(prev => ({ ...prev, [item.id]: false }))}
                    className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max={productStock - item.quantity}
                    defaultValue="1"
                    className="flex-1 px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMultiple(item.id, parseInt(e.target.value) || 1)}
                  />
                  <button
                    onClick={(e) => {
                      const value = parseInt(e.target.closest('div').querySelector('input').value) || 1;
                      handleAddMultiple(item.id, value);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <IconCirclePlus size={16} className="mr-1.5" />
                    Añadir
                  </button>
                </div>
                <div className="text-xs text-blue-600 mt-2 font-medium">
                  Máximo disponible: {productStock - item.quantity} unidades
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CartSummary;