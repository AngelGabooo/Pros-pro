// src/pages/POS.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/organisms/Header';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Alert from '../components/atoms/Alert';
import Modal from '../components/atoms/Modal';
import PaymentMethods from '../components/organisms/PaymentMethods';
import ProductCard from '../components/molecules/ProductCard';
import CartSummary from '../components/organisms/CartSummary';
import AlertModal from '../components/molecules/AlertModal';
import { useNavigate } from 'react-router-dom';
import { saleService } from '../services/saleService';
import { productService } from '../services/productService';
import { authService } from '../services/api';
import {
  IconPrinter,
  IconReceipt,
  IconTrash,
  IconSearch,
  IconCamera,
  IconPackage as IconBox,
  IconShoppingCart,
  IconQrcode,
  IconNumber
} from '@tabler/icons-react';
import Quagga from 'quagga';

const POS = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [cashReceived, setCashReceived] = useState(0);
  const [scannerActive, setScannerActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [recentProducts, setRecentProducts] = useState([]);
  
  const [saleCounter, setSaleCounter] = useState(() => {
    const saved = localStorage.getItem('pos_sale_counter');
    return saved ? parseInt(saved) : 1;
  });
  
  const [currentSaleNumber, setCurrentSaleNumber] = useState(() => {
    const saved = localStorage.getItem('pos_current_sale_number');
    return saved ? saved : saleCounter.toString().padStart(5, '0');
  });

  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    autoClose: 3000
  });
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('pos_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastSale, setLastSale] = useState(null);

  const currentUser = authService.getCurrentUser();

  // === CORREGIDO: Verificación de autenticación sin bucle infinito ===
useEffect(() => {
  // Verificación simple y única al montar el componente
  if (!authService.isAuthenticated()) {
    console.log('Usuario no autenticado en POS, redirigiendo a login');
    authService.logout();
    navigate('/login', { replace: true });
  }
}, []); // Solo se ejecuta una vez al montar

  useEffect(() => {
    localStorage.setItem('pos_sale_counter', saleCounter.toString());
    localStorage.setItem('pos_current_sale_number', saleCounter.toString().padStart(5, '0'));
  }, [saleCounter]);

  useEffect(() => {
    const checkDateChange = () => {
      const today = new Date().toDateString();
      const lastSaleDate = localStorage.getItem('pos_last_sale_date');
      
      if (lastSaleDate !== today) {
        localStorage.setItem('pos_last_sale_date', today);
        localStorage.setItem('pos_sale_counter', '1');
        setSaleCounter(1);
        setCurrentSaleNumber('00001');
        
        showAlert({
          type: 'info',
          title: 'Nuevo día',
          message: 'El contador de ventas se ha reiniciado para hoy.',
          autoClose: 5000
        });
      }
    };

    checkDateChange();
    
    const interval = setInterval(checkDateChange, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('pos_notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  useEffect(() => {
    const savedRecent = localStorage.getItem('pos_recent_products');
    if (savedRecent) {
      setRecentProducts(JSON.parse(savedRecent).slice(0, 8));
    }
  }, []);
  
  const saveRecentProduct = (product) => {
    const updatedRecent = [product, ...recentProducts.filter(p => p.id !== product.id)].slice(0, 10);
    setRecentProducts(updatedRecent);
    localStorage.setItem('pos_recent_products', JSON.stringify(updatedRecent));
  };
  
  const removeRecentProductsFromCart = (cartItems) => {
    const cartProductIds = cartItems.map(item => item.id);
    const updatedRecent = recentProducts.filter(product => !cartProductIds.includes(product.id));
    setRecentProducts(updatedRecent);
    localStorage.setItem('pos_recent_products', JSON.stringify(updatedRecent));
  };
  
  const removeRecentProduct = (productId) => {
    const updatedRecent = recentProducts.filter(product => product.id !== productId);
    setRecentProducts(updatedRecent);
    localStorage.setItem('pos_recent_products', JSON.stringify(updatedRecent));
  };
  
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      console.log('Iniciando carga de productos...');
      const response = await productService.getAll();

      if (response.success && response.productos) {
        console.log(`${response.productos.length} productos cargados`);
        const mapped = response.productos.map(p => ({
          id: p._id,
          code: p.codigoInterno || '',
          name: p.nombre,
          price: p.precio,
          category: p.categoria || 'Sin categoría',
          stock: p.stock || 0,
          minStock: p.stockMinimo || 5,
          barcode: p.codigoBarra || ''
        }));
        setProducts(mapped);
      } else {
        console.error('Respuesta inválida del servidor:', response);
        showAlert({
          type: 'error',
          title: 'Error del servidor',
          message: response.error || 'Respuesta inválida del servidor'
        });
      }
    } catch (error) {
      console.error('Error completo al cargar productos:', error);

      let message = 'No se pudo conectar al servidor.';
      if (error?.error) {
        message = error.error;
      } else if (error?.message) {
        message = error.message;
      }
      showAlert({
        type: 'error',
        title: 'Error cargando productos',
        message: message + '\nUsando datos locales como respaldo.',
        autoClose: 8000
      });
      const fallback = [];
      setProducts(fallback);
    } finally {
      setLoadingProducts(false);
    }
  };
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  useEffect(() => {
    const checkLowStock = () => {
      const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0);

      const newNotifications = lowStockProducts.map(product => {
        const existingNotification = notifications.find(n =>
          n.type === 'stock' && n.productId === product.id && !n.read
        );

        if (existingNotification) return null;

        return {
          id: `stock-${product.id}-${Date.now()}`,
          type: 'stock',
          title: `Stock bajo: ${product.name}`,
          message: `Solo quedan ${product.stock} unidades. Stock mínimo: ${product.minStock}`,
          stock: product.stock,
          minStock: product.minStock,
          productId: product.id,
          productName: product.name,
          productLink: '/products',
          read: false,
          timestamp: new Date().toISOString(),
          priority: product.stock < 3 ? 'high' : 'medium'
        };
      }).filter(Boolean);
      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);

        newNotifications.forEach(notification => {
          if (notification.priority === 'high') {
            showAlert({
              type: 'warning',
              title: 'Stock CRÍTICO',
              message: `${notification.productName} está por agotarse.\nQuedan solo ${notification.stock} unidades.`,
              autoClose: 6000
            });
          }
        });
      }
    };
    const interval = setInterval(checkLowStock, 60000);
    checkLowStock();
    return () => clearInterval(interval);
  }, [products]);
  
  const showAlert = ({ type = 'success', title = '', message = '', autoClose = 3000 }) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message,
      autoClose
    });
  };
  
  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;
  
  const validateStock = (productId, quantityToAdd = 1) => {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    const currentInCart = cartItem ? cartItem.quantity : 0;
    return product && (currentInCart + quantityToAdd) <= product.stock;
  };
  
  const addToCart = (product) => {
    if (!validateStock(product.id)) {
      showAlert({
        type: 'warning',
        title: 'Stock insuficiente',
        message: `Solo quedan ${product.stock} unidades de ${product.name}`,
        autoClose: 4000
      });
      return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    saveRecentProduct(product);
  };
  
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    removeRecentProduct(productId);
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    if (!validateStock(productId, newQuantity - (cart.find(item => item.id === productId)?.quantity || 0))) {
      const product = products.find(p => p.id === productId);
      showAlert({
        type: 'warning',
        title: 'Stock insuficiente',
        message: `Stock disponible: ${product?.stock || 0}`,
        autoClose: 4000
      });
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };
  
  const clearCart = () => {
    removeRecentProductsFromCart(cart);
    setCart([]);
    setCashReceived(0);
    setPaymentMethod('efectivo');
  };

  const printTicket = () => {
    if (!lastSale) return;
    window.print();
  };

  const incrementSaleCounter = () => {
    setSaleCounter(prev => {
      const newCounter = prev + 1;
      const newSaleNumber = newCounter.toString().padStart(5, '0');
      setCurrentSaleNumber(newSaleNumber);
      return newCounter;
    });
  };

  const handleCheckout = async (paymentData) => {
    if (cart.length === 0) {
      showAlert({
        type: 'warning',
        title: 'Carrito vacío',
        message: 'Agrega productos al carrito primero para realizar una venta.',
        autoClose: 4000
      });
      return;
    }
    try {
      const items = cart.map(item => ({
        productoId: item.id,
        nombre: item.name,
        cantidad: item.quantity,
        precioUnitario: item.price,
        subtotal: item.price * item.quantity
      }));
      const customerName = 'Cliente ocasional';

      const salePayload = {
        items,
        cliente: customerName,
        metodoPago: paymentMethod,
        descuento: 0,
        impuestos: 0,
        subtotal: total,
        total: total,
        cambio: paymentData.change || 0,
        referenciaPago: paymentData.reference || null
      };
      console.log('Enviando venta:', salePayload);
      const result = await saleService.create(salePayload);
      if (result.success) {
        incrementSaleCounter();
        
        setLastSale({
          code: result.venta.codigo,
          saleNumber: currentSaleNumber,
          date: new Date().toLocaleString('es-MX'),
          items: cart,
          total: total,
          paymentMethod: paymentMethod,
          cashReceived: paymentData.cashReceived || 0,
          change: paymentData.change || 0,
          reference: paymentData.reference || null
        });

        showAlert({
          type: 'success',
          title: '¡Venta realizada!',
          message: `Venta #${currentSaleNumber}\nTotal: ${formatCurrency(total)}\nMétodo: ${paymentMethod.toUpperCase()}\nCódigo: ${result.venta.codigo}`,
          autoClose: 6000
        });
        
        const saleNotification = {
          id: `sale-${Date.now()}`,
          type: 'sale',
          title: `Venta #${currentSaleNumber} realizada`,
          message: `Total: ${formatCurrency(total)} • Método: ${paymentMethod}`,
          saleId: result.venta.id,
          amount: total,
          read: false,
          timestamp: new Date().toISOString(),
          priority: 'low'
        };

        setNotifications(prev => [saleNotification, ...prev]);
        clearCart();

        await loadProducts();

        window.dispatchEvent(new CustomEvent('saleCompleted', {
          detail: { saleId: result.venta.id }
        }));

        const recentSales = JSON.parse(localStorage.getItem('pos_recent_sales') || '[]');
        recentSales.unshift({
          id: result.venta.id,
          code: result.venta.codigo,
          saleNumber: currentSaleNumber,
          total: total,
          date: new Date().toISOString(),
          items: salePayload.items.length
        });
        localStorage.setItem('pos_recent_sales', JSON.stringify(recentSales.slice(0, 10)));
      } else {
        showAlert({
          type: 'error',
          title: 'Error en la venta',
          message: result.error || 'No se pudo completar la venta.',
          autoClose: 5000
        });
      }
    } catch (error) {
      console.error('Error registrando venta:', error);

      let errorMessage = 'No se pudo conectar al servidor. Intenta nuevamente.';

      if (error.error) {
        errorMessage = error.error;
        if (error.details) {
          errorMessage += `\nDetalles: ${error.details}`;
        }
      } else if (error.message && error.message.includes('404')) {
        errorMessage = 'Error: El servidor no tiene la ruta /api/sales configurada. Verifica tu backend.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert({
        type: 'error',
        title: 'Error de conexión',
        message: errorMessage,
        autoClose: 8000
      });
    }
  };
  
  const startScanner = () => {
    setShowScanner(true);
    setScannerActive(true);
    setScanning(true);
    setScanResult('');
    setTimeout(() => {
      const container = document.getElementById('scanner-container');
      if (!container) return;
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: container,
          constraints: {
            facingMode: "environment",
            width: { min: 640 },
            height: { min: 480 }
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 10,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "code_128_reader",
            "code_39_reader",
            "upc_reader",
            "codabar_reader"
          ]
        },
        locate: true
      }, (err) => {
        if (err) {
          console.error('Error iniciando cámara:', err);
          showAlert({
            type: 'error',
            title: 'Acceso a cámara denegado',
            message: 'Permite el acceso a la cámara para escanear códigos de barras.',
            autoClose: 6000
          });
          stopScanner();
          return;
        }
        Quagga.start();
      });
      Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        if (code) {
          Quagga.stop();
          handleBarcodeDetected(code);
        }
      });
    }, 500);
  };
  
  const handleBarcodeDetected = (code) => {
    setScanResult(code);
    setScanning(false);
    const foundProduct = products.find(p => p.barcode === code.trim());
    if (foundProduct) {
      addToCart(foundProduct);
      showAlert({
        type: 'success',
        title: '¡Producto encontrado!',
        message: `${foundProduct.name}\nAgregado al carrito`,
        autoClose: 4000
      });
      setTimeout(() => {
        stopScanner();
      }, 1500);
    } else {
      showAlert({
        type: 'warning',
        title: 'Producto no encontrado',
        message: `Código: ${code}\nNo está registrado en el inventario.`,
        autoClose: 6000
      });
      setTimeout(() => {
        setScanning(true);
        Quagga.start();
      }, 2500);
    }
  };
  
  const stopScanner = () => {
    if (typeof Quagga !== 'undefined') {
      Quagga.stop();
    }
    setShowScanner(false);
    setScannerActive(false);
    setScanning(false);
    setScanResult('');
  };
  
  const handleScan = () => {
    startScanner();
  };
  
  const filteredProducts = searchQuery.trim()
    ? products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery)
    )
    : recentProducts;
    
  const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0);
  const criticalStockProducts = products.filter(p => p.stock < 3 && p.stock > 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        isAuthenticated={authService.isAuthenticated()}
        user={currentUser}
        onLogout={() => {
          authService.logout();
          navigate('/login');
        }}
        cartCount={cart.length}
        notifications={notifications}
        onClearNotifications={() => setNotifications([])}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Punto de Venta <span className="text-primary-500">MXN</span>
              </h1>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg shadow-md">
                  <IconNumber className="mr-2" size={20} />
                  <div>
                    <p className="text-sm opacity-90">Venta actual</p>
                    <p className="text-xl font-bold tracking-wider">
                      #{currentSaleNumber}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="text-sm">
                    <p className="font-medium">{new Date().toLocaleDateString('es-MX', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}</p>
                    <p className="text-xs">{new Date().toLocaleTimeString('es-MX', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                {criticalStockProducts.length > 0 && (
                  <div className="flex items-start">
                    <Alert
                      type="error"
                      size="sm"
                      title={`${criticalStockProducts.length} productos en stock CRÍTICO`}
                      message="Revisa y reabastece inmediatamente"
                    />
                  </div>
                )}
                {unreadNotifications > 0 && (
                  <Alert
                    type="info"
                    size="sm"
                    title={`Tienes ${unreadNotifications} alertas de inventario`}
                    message="Revisa las notificaciones para más detalles"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                size="md"
                icon={IconPrinter}
                onClick={printTicket}
                disabled={!lastSale}
              >
                Imprimir Ticket
              </Button>
              <Button
                variant="outline"
                size="md"
                icon={IconReceipt}
                onClick={() => navigate('/dashboard')}
              >
                Ver Historial
              </Button>
              <Button
                variant="warning"
                size="md"
                icon={IconTrash}
                onClick={clearCart}
              >
                Cancelar Venta
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-ping mr-2"></div>
              <span className="text-sm font-medium">
                Ventas hoy: <span className="font-bold text-lg ml-1">{saleCounter - 1}</span>
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Buscar producto por nombre, código, categoría o código de barras..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      variant="search"
                      icon={IconSearch}
                    />
                    {searchQuery && (
                      <p className="text-sm text-gray-500 mt-2">
                        Resultados para: <span className="font-medium">{searchQuery}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="md"
                      icon={IconCamera}
                      onClick={handleScan}
                    >
                      Escanear
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      icon={IconBox}
                      onClick={() => navigate('/products')}
                    >
                      Gestionar Inventario
                    </Button>
                  </div>
                </div>
              </Card>
              <Card title={
                searchQuery
                  ? `Resultados de búsqueda (${filteredProducts.length})`
                  : "Productos recientes"
              } className="mb-6">
                {loadingProducts ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando productos...</p>
                  </div>
                ) : searchQuery && filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <IconSearch className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-500 font-medium text-lg mb-2">No se encontraron productos</p>
                    <p className="text-gray-400 mb-6">Ve a "Gestionar Inventario" para agregar nuevos productos</p>
                    <Button
                      variant="outline"
                      icon={IconBox}
                      onClick={() => navigate('/products')}
                    >
                      Ir a Inventario
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.slice(0, 12).map(product => {
                      const cartItem = cart.find(item => item.id === product.id);
                      const inCartQuantity = cartItem ? cartItem.quantity : 0;

                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={addToCart}
                          inCartQuantity={inCartQuantity}
                          formatCurrency={formatCurrency}
                          isCritical={product.stock < 3 && product.stock > 0}
                          isLowStock={product.stock <= product.minStock && product.stock > 0}
                          showStock={true}
                        />
                      );
                    })}
                  </div>
                )}

                {!searchQuery && filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <IconCamera className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-500 font-medium text-lg mb-2">¡Escanea tu primer producto!</p>
                    <p className="text-sm text-gray-400 text-center max-w-xs">
                      Los productos que escanees aparecerán aquí
                    </p>
                    <Button
                      variant="primary"
                      icon={IconCamera}
                      onClick={handleScan}
                    >
                      Comenzar a Escanear
                    </Button>
                  </div>
                )}
              </Card>
            </div>
            
            <div className="space-y-6">
              <div className="card-pos h-[650px] flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0 bg-white rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Carrito de Compra</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {cart.length > 0
                          ? `${cart.reduce((sum, item) => sum + item.quantity, 0)} productos`
                          : 'Añade productos para comenzar'}
                      </p>
                    </div>
                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <IconTrash size={14} />
                        Vaciar
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

                  <div className="h-full overflow-y-auto px-4 py-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full py-20">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                          <IconShoppingCart className="text-gray-400" size={40} />
                        </div>
                        <p className="text-gray-500 font-medium text-lg mb-2 text-center">
                          El carrito está vacío
                        </p>
                        <p className="text-sm text-gray-400 text-center max-w-xs">
                          Busca productos o escanea códigos de barras para agregar items
                        </p>
                      </div>
                    ) : (
                      <CartSummary
                        cart={cart}
                        products={products}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                        formatCurrency={formatCurrency}
                      />
                    )}
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0 rounded-b-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                      </div>

                      <div className="flex items-center justify-between text-lg font-bold pt-3 border-t border-gray-200">
                        <span className="text-gray-900">Total a pagar:</span>
                        <span className="text-primary-600 text-xl">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <PaymentMethods
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                total={total}
                cashReceived={cashReceived}
                setCashReceived={setCashReceived}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </main>

      <div id="print-ticket" className="hidden print:block">
        {lastSale && currentUser && (
          <div className="w-[80mm] mx-auto font-mono text-sm leading-tight p-4 bg-white">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold uppercase tracking-wider">
                {currentUser.tiendaNombre?.trim() || 'MI TIENDA'}
              </h1>

              {currentUser.tiendaDireccion?.trim() && (
                <p className="text-xs mt-2 max-w-full break-words">
                  {currentUser.tiendaDireccion.trim()}
                </p>
              )}

              <div className="text-xs mt-2 space-y-1">
                {currentUser.tiendaTelefono?.trim() && (
                  <p>Tel: {currentUser.tiendaTelefono.trim()}</p>
                )}
                {currentUser.tiendaRFC?.trim() && (
                  <p>RFC: {currentUser.tiendaRFC.trim()}</p>
                )}
              </div>

              <div className="my-4 border-t border-dashed border-black pt-3"></div>

              <p className="font-bold text-base">TICKET DE VENTA</p>
              <p className="text-xs">Venta: <strong>#{lastSale.saleNumber || currentSaleNumber}</strong></p>
              <p className="text-xs">Folio: <strong>{lastSale.code}</strong></p>
              <p className="text-xs">
                {new Date().toLocaleDateString('es-MX')} {new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs">
                Cajero: {currentUser.nombre} {currentUser.apellido}
              </p>

              <div className="my-4 border-t border-dashed border-black"></div>
            </div>

            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left py-1">Cant</th>
                  <th className="text-left py-1">Descripción</th>
                  <th className="text-right py-1">P.Unit</th>
                  <th className="text-right py-1">Importe</th>
                </tr>
              </thead>
              <tbody>
                {lastSale.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-1 text-center">{item.quantity}</td>
                    <td className="py-1 pr-2 break-words max-w-[160px]">{item.name}</td>
                    <td className="py-1 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-1 text-right">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t-2 border-dashed border-black pt-3 mb-4"></div>

            <div className="text-right text-sm space-y-1 mb-4">
              <p className="font-bold text-lg">
                TOTAL: {formatCurrency(lastSale.total)}
              </p>
            </div>

            <div className="text-xs space-y-1 mb-4">
              <p>Método: <strong>{lastSale.paymentMethod.toUpperCase()}</strong></p>
              {lastSale.paymentMethod === 'efectivo' && (
                <>
                  <p>Recibido: {formatCurrency(lastSale.cashReceived)}</p>
                  <p>Cambio: {formatCurrency(lastSale.change)}</p>
                </>
              )}
              {lastSale.reference && <p>Ref: {lastSale.reference}</p>}
            </div>

            <div className="border-t border-dashed border-black mb-4"></div>

            <div className="text-center text-xs leading-relaxed">
              <p className="font-medium">
                {currentUser.tiendaMensajeTicket?.trim() || '¡Gracias por su compra!'}
              </p>
              <p className="mt-2">Vuelva pronto 😊</p>
            </div>

            <div className="text-center mt-8 text-xs">
              <p>================================</p>
              <p className="mt-4 text-xs">Ticket generado por POS Pro</p>
              <p className="text-xs text-gray-600 mt-2">
                {new Date().toLocaleString('es-MX')}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #print-ticket, #print-ticket * {
            visibility: visible;
          }
          #print-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
          }
          html, body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        autoClose={alertState.autoClose}
      />
      {showScanner && (
        <Modal
          isOpen={showScanner}
          onClose={stopScanner}
          title="Escanear Código de Barras"
          size="lg"
        >
          <div className="text-center p-6">
            <div className="relative mx-auto max-w-md">
              <div id="scanner-container" className="w-full h-96 rounded-xl overflow-hidden border-4 border-primary-500 shadow-2xl bg-black">
              </div>

              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 pointer-events-none">
                  <div className="text-white text-xl font-bold animate-pulse">
                    Escaneando...
                  </div>
                </div>
              )}
              {scanResult && (
                <div className="mt-6 p-4 bg-success-100 border-2 border-success-500 rounded-lg">
                  <p className="text-success-800 font-bold text-lg">¡Código detectado!</p>
                  <p className="text-2xl font-mono mt-2">{scanResult}</p>
                </div>
              )}
            </div>
            <div className="mt-8 text-gray-600">
              <p className="font-medium">Apunta la cámara al código de barras</p>
              <p className="text-sm mt-2">Soportados: EAN, UPC, Code 128, Code 39</p>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={stopScanner}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default POS;