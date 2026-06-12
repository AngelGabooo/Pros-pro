import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Loader from '../components/atoms/Loader';
import Input from '../components/atoms/Input';
import Alert from '../components/atoms/Alert';
import Modal from '../components/atoms/Modal';
import AlertModal from '../components/molecules/AlertModal';
import { getCategoryIcon, getCategoryColor } from '../data/categoryIcons';
import {
  IconArrowLeft,
  IconPlus,
  IconUpload as IconExport,
  IconDownload as IconImport,
  IconPackage,
  IconAlertTriangle,
  IconX,
  IconTag,
  IconSearch,
  IconFilter,
  IconRefresh as IconUndo,
  IconEdit,
  IconTruckDelivery as IconRestock,
  IconTrash,
  IconBarcode,
  IconDeviceFloppy as IconSave
} from '@tabler/icons-react';
import { productService } from '../services/productService';

const Products = ({ darkMode, onThemeToggle, isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filterCategory, setFilterCategory] = useState('todos');
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    categories: []
  });
  const [editProduct, setEditProduct] = useState({
    id: '',
    name: '',
    code: '',
    price: 0,
    category: '',
    stock: 0,
    minStock: 5,
    barcode: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    price: 0,
    category: '',
    stock: 0,
    minStock: 5,
    barcode: ''
  });
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // ==================== ESTADOS PARA PAGINACIÓN ====================
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Cantidad de productos por página

  const showAlert = ({ type = 'success', title = '', message = '' }) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  // Cargar productos desde la API
  useEffect(() => {
    loadProducts();
  }, []);

  // Calcular estadísticas cada vez que cambien los productos
  useEffect(() => {
    calculateStats(products);
  }, [products]);

  // Auto-refresh automático (polling + eventos)
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      loadProducts();
    }, 15000);

    const handleStockUpdate = () => {
      loadProducts();
    };
    window.addEventListener('stockUpdated', handleStockUpdate);

    const handleStorageChange = (e) => {
      if (e.key === 'lastSale') {
        loadProducts();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(pollingInterval);
      window.removeEventListener('stockUpdated', handleStockUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filtrar y ordenar productos (sin paginación aquí)
  useEffect(() => {
    filterAndSortProducts();
  }, [searchQuery, products, sortConfig, filterCategory]);

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
        calculateStats(mapped);
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
      if (error?.error) message = error.error;
      else if (error?.message) message = error.message;
      showAlert({
        type: 'error',
        title: 'Error cargando productos',
        message: message + '\nUsando datos locales como respaldo.',
        autoClose: 8000
      });
      const fallback = [];
      setProducts(fallback);
      calculateStats(fallback);
    } finally {
      setLoadingProducts(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchQuery))
      );
    }

    if (filterCategory !== 'todos') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortConfig.direction === 'ascending'
          ? aValue - bValue
          : bValue - aValue;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Resetear a primera página cuando cambian los filtros
  };

  const calculateStats = (productsList) => {
    const total = productsList.length;
    const lowStock = productsList.filter(p => p.stock <= p.minStock && p.stock > 0).length;
    const outOfStock = productsList.filter(p => p.stock === 0).length;
    const categories = [...new Set(productsList.map(p => p.category).filter(Boolean))];
    setStats({
      total,
      lowStock,
      outOfStock,
      categories
    });
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (product) => {
    setEditProduct({ ...product });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editProduct.name || !editProduct.price || !editProduct.code) {
      showAlert({
        type: 'warning',
        title: 'Campos requeridos',
        message: 'Por favor completa:\n• Nombre del producto\n• Código interno\n• Precio'
      });
      return;
    }
    setLoading(true);
    try {
      const apiProduct = {
        nombre: editProduct.name,
        codigoInterno: editProduct.code,
        precio: editProduct.price,
        categoria: editProduct.category,
        stock: editProduct.stock,
        stockMinimo: editProduct.minStock,
        codigoBarra: editProduct.barcode?.trim() || null
      };
    
      const response = await productService.update(editProduct.id, apiProduct);
      if (response.success) {
        await loadProducts();
        setShowEditModal(false);
        showAlert({
          type: 'success',
          title: '¡Actualizado!',
          message: `${editProduct.name}\nLos cambios se guardaron correctamente.`
        });
      }
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Error al actualizar',
        message: 'No se pudieron guardar los cambios. Intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await productService.delete(selectedProduct.id);
      if (response.success) {
        await loadProducts();
        setShowDeleteModal(false);
        setSelectedProduct(null);
        showAlert({
          type: 'success',
          title: '¡Eliminado!',
          message: `${selectedProduct.name} fue eliminado del inventario.`
        });
      }
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Error al eliminar',
        message: 'No se pudo eliminar el producto. Intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId, newStock) => {
    setLoading(true);
    try {
      await productService.updateStock(productId, { stock: parseInt(newStock) });
      await loadProducts();
      showAlert({
        type: 'success',
        title: 'Stock actualizado',
        message: 'La cantidad en inventario se actualizó correctamente.'
      });
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar el stock. Intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = (product) => {
    const newStock = prompt(`Ingresa la nueva cantidad de stock para ${product.name}:`, product.stock);
    if (newStock !== null && !isNaN(newStock) && newStock >= 0) {
      handleStockUpdate(product.id, newStock);
    }
  };

  const handleLowStockRestock = async () => {
    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    for (const product of lowStockProducts) {
      const suggestedStock = product.minStock * 2;
      const newStock = prompt(
        `Producto: ${product.name}\nStock actual: ${product.stock}\nStock mínimo: ${product.minStock}\nIngresa nuevo stock (sugerido: ${suggestedStock}):`,
        suggestedStock
      );
      if (newStock !== null && !isNaN(newStock) && newStock >= 0) {
        await handleStockUpdate(product.id, newStock);
      }
    }
    setShowLowStockModal(false);
  };

  const exportProducts = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `productos_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showAlert({
      type: 'success',
      title: 'Exportado correctamente',
      message: 'Tu inventario se descargó como archivo JSON.'
    });
  };

  const importProducts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const importedProducts = JSON.parse(event.target.result);
          if (Array.isArray(importedProducts)) {
            showAlert({
              type: 'info',
              title: 'Importación local',
              message: 'Archivo leído correctamente.\nPróximamente: envío automático a la base de datos.'
            });
          } else {
            showAlert({
              type: 'error',
              title: 'Formato inválido',
              message: 'El archivo no contiene una lista válida de productos.'
            });
          }
        } catch (error) {
          showAlert({
            type: 'error',
            title: 'Error de lectura',
            message: 'No se pudo leer el archivo. Asegúrate de que sea un JSON válido.'
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleBack = () => {
    navigate('/pos');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      showAlert({
        type: 'warning',
        title: 'Faltan datos obligatorios',
        message: 'Completa los campos:\n• Nombre del producto\n• Precio'
      });
      return;
    }
    setLoading(true);
    try {
      const apiProduct = {
        nombre: newProduct.name.trim(),
        codigoInterno: newProduct.code?.trim() || '',
        precio: parseFloat(newProduct.price),
        costo: 0,
        categoria: newProduct.category.trim() || 'General',
        stock: parseInt(newProduct.stock) || 0,
        stockMinimo: parseInt(newProduct.minStock) || 5,
        ...(newProduct.barcode?.trim() && {
          codigoBarra: newProduct.barcode.trim()
        })
      };
      const response = await productService.create(apiProduct);
     
      if (response.success) {
        await loadProducts();
        setShowAddModal(false);
        setNewProduct({
          name: '',
          code: '',
          price: 0,
          category: '',
          stock: 0,
          minStock: 5,
          barcode: ''
        });
       
        showAlert({
          type: 'success',
          title: '¡Producto agregado!',
          message: (
            <div className="text-left">
              <strong>{newProduct.name}</strong>
              <br />
              <span className="text-sm text-gray-600">
                Precio: {formatCurrency(newProduct.price)}
              </span>
            </div>
          )
        });
      }
    } catch (error) {
      console.error('Error completo:', error);
      let msg = error.error || 'No se pudo guardar el producto.';
      if (error.error?.includes('código interno')) {
        msg = 'Ya existe un producto con ese código interno.\nDeja el campo vacío para generar uno automático.';
      } else if (error.error?.includes('código de barras')) {
        msg = 'Ya existe un producto con ese código de barras.\nPrueba con otro o déjalo vacío.';
      }
      showAlert({
        type: 'error',
        title: 'Error al agregar',
        message: msg
      });
    } finally {
      setLoading(false);
    }
  };

  // ==================== LÓGICA DE PAGINACIÓN ====================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById('products-table')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loadingProducts && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
        onThemeToggle={onThemeToggle}
        darkMode={darkMode}
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={IconArrowLeft}
                  onClick={handleBack}
                  className="mr-3"
                >
                  Volver al POS
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de <span className="text-primary-500">Productos</span>
                </h1>
              </div>
              <p className="text-gray-600">
                Administra el inventario de tu tienda
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <Button
                variant="primary"
                size="md"
                icon={IconPlus}
                onClick={() => setShowAddModal(true)}
              >
                Agregar Nuevo
              </Button>
              <Button
                variant="outline"
                size="md"
                icon={IconExport}
                onClick={exportProducts}
              >
                Exportar
              </Button>
              <Button
                variant="outline"
                size="md"
                icon={IconImport}
                onClick={importProducts}
              >
                Importar
              </Button>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                  <IconPackage className="text-primary-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </Card>
            <Card className={`bg-white ${stats.lowStock > 0 ? 'border-warning-300' : ''}`}>
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${stats.lowStock > 0 ? 'bg-warning-100' : 'bg-success-100'}`}>
                  <IconAlertTriangle className={stats.lowStock > 0 ? 'text-warning-500' : 'text-success-500'} size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Bajo</p>
                  <p className={`text-2xl font-bold ${stats.lowStock > 0 ? 'text-warning-600' : 'text-success-600'}`}>
                    {stats.lowStock}
                  </p>
                </div>
              </div>
            </Card>
            <Card className={`bg-white ${stats.outOfStock > 0 ? 'border-red-300' : ''}`}>
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${stats.outOfStock > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                  <IconX className={stats.outOfStock > 0 ? 'text-red-500' : 'text-gray-500'} size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sin Stock</p>
                  <p className={`text-2xl font-bold ${stats.outOfStock > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {stats.outOfStock}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-white">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-accent-purple/10 flex items-center justify-center mr-4">
                  <IconTag className="text-accent-purple" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Categorías</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.categories.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filtros y búsqueda */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Buscar productos por nombre, código, categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="search"
                  icon={IconSearch}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex items-center space-x-2">
                  <IconFilter className="text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="todos">Todas las categorías</option>
                    {stats.categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  {stats.lowStock > 0 && (
                    <Button
                      variant="warning"
                      size="md"
                      icon={IconAlertTriangle}
                      onClick={() => setShowLowStockModal(true)}
                    >
                      Reabastecer ({stats.lowStock})
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="md"
                    icon={IconUndo}
                    onClick={loadProducts}
                  >
                    Actualizar
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabla de productos */}
          <Card
            title="Productos en Inventario"
            subtitle={`Mostrando ${filteredProducts.length} de ${products.length} productos (incluye agotados)`}
          >
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <IconPackage className="text-gray-400" size={24} />
                </div>
                <p className="text-gray-500">No hay productos en el inventario</p>
                <p className="text-sm text-gray-400 mt-1">Agrega productos para comenzar</p>
                <Button
                  variant="primary"
                  size="md"
                  className="mt-4"
                  onClick={() => setShowAddModal(true)}
                  icon={IconPlus}
                >
                  Agregar Primer Producto
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto" id="products-table">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('name')}>
                          Producto {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('code')}>
                          Código {sortConfig.key === 'code' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('category')}>
                          Categoría {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('price')}>
                          Precio {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('stock')}>
                          Stock {sortConfig.key === 'stock' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('minStock')}>
                          Mínimo {sortConfig.key === 'minStock' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map(product => {
                        const CategoryIcon = getCategoryIcon(product.category);
                        const categoryColor = getCategoryColor(product.category);
                        const isLowStock = product.stock <= product.minStock && product.stock > 0;
                        const isOutOfStock = product.stock === 0;
                        return (
                          <tr key={product.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isOutOfStock ? 'bg-red-50' : ''}`}>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${categoryColor}`}>
                                  <CategoryIcon size={18} />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{product.name}</div>
                                  {product.barcode && (
                                    <div className="text-xs text-gray-500 flex items-center">
                                      <IconBarcode className="mr-1" size={10} />
                                      {product.barcode}
                                    </div>
                                  )}
                                  {isOutOfStock && (
                                    <span className="inline-block mt-1 px-2 py-1 text-xs font-bold text-red-800 bg-red-200 rounded">
                                      AGOTADO
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                                {product.code}
                              </code>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span className={`px-2 py-1 rounded-full text-xs ${categoryColor}`}>
                                  {product.category || 'Sin categoría'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-primary-600">
                                {formatCurrency(product.price)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span className={`font-bold text-lg ${isOutOfStock ? 'text-red-600' :
                                    isLowStock ? 'text-orange-600' : 'text-green-600'
                                  }`}>
                                  {product.stock}
                                </span>
                                {isLowStock && !isOutOfStock && (
                                  <IconAlertTriangle className="ml-2 text-orange-500" size={16} />
                                )}
                                {isOutOfStock && (
                                  <IconX className="ml-2 text-red-500" size={18} />
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-gray-600">{product.minStock}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={IconEdit}
                                  onClick={() => handleEdit(product)}
                                  className="!p-2"
                                  title="Editar producto"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={IconRestock}
                                  onClick={() => handleRestock(product)}
                                  className="!p-2 text-green-600 hover:text-green-700"
                                  title="Reabastecer stock"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={IconTrash}
                                  onClick={() => handleDelete(product)}
                                  className="!p-2 text-red-500 hover:text-red-700"
                                  title="Eliminar producto"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ==================== PAGINACIÓN ==================== */}
                {filteredProducts.length > itemsPerPage && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-sm text-gray-600">
                        Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} de {filteredProducts.length} productos
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Anterior
                        </Button>
                        
                        <div className="flex space-x-1">
                          {(() => {
                            const pageNumbers = [];
                            const maxButtons = 5;
                            let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                            let endPage = Math.min(totalPages, startPage + maxButtons - 1);
                            
                            if (endPage - startPage + 1 < maxButtons) {
                              startPage = Math.max(1, endPage - maxButtons + 1);
                            }
                            
                            for (let i = startPage; i <= endPage; i++) {
                              pageNumbers.push(i);
                            }
                            
                            return pageNumbers.map(number => (
                              <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                  currentPage === number
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {number}
                              </button>
                            ));
                          })()}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>

          <Alert
            type="info"
            title="Información importante"
            className="mt-6"
          >
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Los productos con <strong>stock 0</strong> se muestran en rojo con etiqueta "AGOTADO"</li>
              <li>Puedes reabastecerlos haciendo clic en el ícono de camión</li>
              <li>No se eliminan automáticamente al agotarse</li>
              <li>Revisa regularmente los productos agotados para reponerlos</li>
            </ul>
          </Alert>
        </div>
      </main>

      {/* Modal de eliminar producto */}
      {showDeleteModal && selectedProduct && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Eliminación"
          size="sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <IconTrash className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              ¿Eliminar producto?
            </h3>
            <p className="text-gray-600 mb-4">
              Estás a punto de eliminar <span className="font-semibold">{selectedProduct.name}</span>.
              Esta acción no se puede deshacer.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <span className="text-gray-500">Código:</span>
                  <div className="font-medium">{selectedProduct.code}</div>
                </div>
                <div className="text-left">
                  <span className="text-gray-500">Stock:</span>
                  <div className="font-medium">{selectedProduct.stock} unidades</div>
                </div>
                <div className="text-left">
                  <span className="text-gray-500">Precio:</span>
                  <div className="font-medium">{formatCurrency(selectedProduct.price)}</div>
                </div>
                <div className="text-left">
                  <span className="text-gray-500">Categoría:</span>
                  <div className="font-medium">{selectedProduct.category || 'N/A'}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                icon={IconTrash}
                loading={loading}
              >
                Sí, Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ==================== MODAL PARA EDITAR PRODUCTO ==================== */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Editar Producto"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto *
                </label>
                <Input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  placeholder="Ej: Arroz Costeño 5kg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Interno *
                </label>
                <Input
                  type="text"
                  value={editProduct.code}
                  onChange={(e) => setEditProduct({ ...editProduct, code: e.target.value })}
                  placeholder="Código único"
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-400 mt-1">El código no se puede modificar</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio *
                </label>
                <Input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <Input
                  type="text"
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                  placeholder="Ej: Alimentos, Bebidas"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Actual
                </label>
                <Input
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Mínimo
                </label>
                <Input
                  type="number"
                  value={editProduct.minStock}
                  onChange={(e) => setEditProduct({ ...editProduct, minStock: parseInt(e.target.value) || 5 })}
                  placeholder="5"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Barras
                </label>
                <Input
                  type="text"
                  value={editProduct.barcode || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, barcode: e.target.value })}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                loading={loading}
                icon={IconSave}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para agregar nuevo producto */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Agregar Nuevo Producto"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto *
                </label>
                <Input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ej: Arroz Costeño 5kg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Interno (opcional)
                </label>
                <Input
                  type="text"
                  value={newProduct.code}
                  onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                  placeholder="Se generará automáticamente si se deja vacío"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio *
                </label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <Input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  placeholder="Ej: Alimentos, Bebidas"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Inicial
                </label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Mínimo
                </label>
                <Input
                  type="number"
                  value={newProduct.minStock}
                  onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) || 5 })}
                  placeholder="5"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Barras (opcional)
                </label>
                <Input
                  type="text"
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleAddProduct}
                loading={loading}
                icon={IconSave}
              >
                Guardar Producto
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de stock bajo */}
      {showLowStockModal && (
        <Modal
          isOpen={showLowStockModal}
          onClose={() => setShowLowStockModal(false)}
          title="Reabastecer Stock Bajo"
          size="md"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-warning-100 flex items-center justify-center mx-auto mb-4">
              <IconAlertTriangle className="text-warning-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Productos con Stock Bajo
            </h3>
            <p className="text-gray-600 mb-6">
              Tienes <span className="font-bold text-warning-600">{stats.lowStock} productos</span>
              con stock por debajo del mínimo.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {products
                  .filter(p => p.stock <= p.minStock)
                  .map(product => {
                    const CategoryIcon = getCategoryIcon(product.category);
                    const categoryColor = getCategoryColor(product.category);
                    return (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="text-left flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${categoryColor}`}>
                            <CategoryIcon size={14} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              Stock: {product.stock} • Mínimo: {product.minStock}
                            </div>
                          </div>
                        </div>
                        <div className="text-warning-600 font-bold">
                          {Math.round((product.stock / product.minStock) * 100)}%
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowLowStockModal(false)}
              >
                Más Tarde
              </Button>
              <Button
                variant="warning"
                onClick={handleLowStockRestock}
                icon={IconRestock}
              >
                Reabastecer Todo
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        autoClose={4000}
      />
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Products;