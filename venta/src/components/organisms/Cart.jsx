import React from 'react';
import { FaMinus, FaPlus, FaTrash, FaShoppingCart } from 'react-icons/fa';
import Card from '../atoms/Card';

const Cart = ({ 
  cart, 
  products, 
  updateQuantity, 
  removeFromCart, 
  formatCurrency 
}) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Sin descuento

  return (
    <Card title="Carrito de Compra" className="sticky top-24">
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FaShoppingCart className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-500">El carrito está vacío</p>
          <p className="text-sm text-gray-400 mt-1">Agrega productos para comenzar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Lista de productos en carrito */}
          <div className="max-h-64 overflow-y-auto pr-2">
            {cart.map(item => {
              const productStock = products.find(p => p.id === item.id)?.stock || 0;
              
              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(item.price)} c/u • 
                      <span className={`ml-1 ${productStock < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                        Stock: {productStock}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="font-bold text-gray-900 min-w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity >= productStock}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                    
                    <div className="font-bold text-primary-600 min-w-16 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen SIMPLIFICADO - Sin descuento */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
              <span className="text-gray-900">Total:</span>
              <span className="text-primary-600">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Cart;