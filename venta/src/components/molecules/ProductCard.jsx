import React from 'react';
import { getCategoryIcon, getCategoryColor } from '../../data/categoryIcons';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  inCartQuantity = 0,
  formatCurrency 
}) => {
  const CategoryIcon = getCategoryIcon(product.category);
  const categoryColor = getCategoryColor(product.category);
  const isLowStock = product.stock <= product.minStock;
  const isOutOfStock = product.stock === 0;
  
  return (
    <button
      onClick={() => !isOutOfStock && onAddToCart(product)}
      disabled={isOutOfStock}
      className={`
        flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 
        group relative overflow-hidden
        ${isOutOfStock 
          ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
          : isLowStock
            ? 'border-amber-300 hover:border-amber-400 hover:bg-amber-50'
            : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50 hover:shadow-md'
        }
      `}
    >
      {/* Indicador de cantidad en carrito */}
      {inCartQuantity > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-7 h-7 bg-primary-500 text-white text-sm rounded-full flex items-center justify-center font-bold shadow-lg">
            {inCartQuantity}
          </div>
        </div>
      )}
      
      {/* Indicador de stock bajo */}
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-2 left-2 z-10">
          <div className="w-6 h-6 bg-amber-100 text-amber-600 text-xs rounded-full flex items-center justify-center">
            ⚠️
          </div>
        </div>
      )}
      
      {/* Indicador de sin stock */}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 z-10">
          <div className="w-6 h-6 bg-red-100 text-red-600 text-xs rounded-full flex items-center justify-center">
            ✕
          </div>
        </div>
      )}
      
      {/* Icono de categoría */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${categoryColor} transition-transform group-hover:scale-110`}>
        <CategoryIcon size={24} />
      </div>
      
      {/* Información del producto */}
      <div className="text-center space-y-1 w-full">
        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[40px] flex items-center justify-center">
          {product.name}
        </h4>
        
        {/* Categoría */}
        {product.category && (
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {product.category}
            </span>
          </div>
        )}
        
        {/* Precio */}
        <div className="font-bold text-primary-600 text-lg">
          {formatCurrency(product.price)}
        </div>
        
        {/* Stock */}
        <div className="text-xs mt-2">
          <span className={`font-medium ${
            isOutOfStock ? 'text-red-500' :
            isLowStock ? 'text-amber-500' : 'text-green-500'
          }`}>
            Stock: {product.stock} {isLowStock && !isOutOfStock && '⚠️'}
          </span>
        </div>
        
        {/* Códigos */}
        <div className="flex flex-col gap-1 mt-2">
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            Cód: {product.code}
          </div>
          {product.barcode && (
            <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
              <span className="inline-block mr-1">📟</span>
              {product.barcode}
            </div>
          )}
        </div>
      </div>
      
      {/* Efecto hover */}
      {!isOutOfStock && (
        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      )}
    </button>
  );
};

export default ProductCard;