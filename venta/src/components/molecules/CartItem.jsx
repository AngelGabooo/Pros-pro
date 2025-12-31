import React from 'react';
import { getCategoryIcon } from '../../data/categoryIcons';

const CartItem = ({ 
  item, 
  productStock, 
  onUpdateQuantity, 
  onRemove, 
  formatCurrency 
}) => {
  const CategoryIcon = getCategoryIcon(item.category);
  const isLowStock = productStock < 10;
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white mb-2 border border-gray-100 hover:border-gray-200 transition-colors">
      {/* Icono y nombre */}
      <div className="flex items-center flex-1 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-3 flex-shrink-0">
          <CategoryIcon className="text-primary-600" size={16} />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>{formatCurrency(item.price)} c/u</span>
            <span className={`${isLowStock ? 'text-red-500' : 'text-gray-500'}`}>
              Stock: {productStock}
            </span>
            {item.category && (
              <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                {item.category}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Controles de cantidad y precio */}
      <div className="flex items-center space-x-4">
        {/* Cantidad */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={item.quantity <= 1}
            aria-label="Reducir cantidad"
          >
            <FaMinus size={12} />
          </button>
          <span className="font-bold text-gray-900 min-w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={item.quantity >= productStock}
            aria-label="Aumentar cantidad"
          >
            <FaPlus size={12} />
          </button>
        </div>
        
        {/* Precio total */}
        <div className="font-bold text-primary-600 min-w-20 text-right">
          {formatCurrency(item.price * item.quantity)}
        </div>
        
        {/* Botón eliminar */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Eliminar producto"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;