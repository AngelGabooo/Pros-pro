import React, { useState, useEffect } from 'react';
import Header from '../components/organisms/Header';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Alert from '../components/atoms/Alert';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconId,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconEdit,
  IconDeviceFloppy,
  IconLock,
  IconShield,
  IconHistory,
  IconLogout,
  IconArrowLeft,
  IconCamera,
  IconCheck,
  IconKey,
  IconBuildingBank,
  IconCreditCard,
  IconChevronDown,
  IconChevronUp,
  IconWallet,
  IconCurrencyDollar,
  IconBuildingStore // Icono para la tienda
} from '@tabler/icons-react';

const Profile = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showBankData, setShowBankData] = useState(false);

  useEffect(() => {
  const loadUserData = async () => {
    setLoading(true);
    
    // Siempre carga el usuario desde localStorage (que ya actualizaste)
    const currentUser = authService.getCurrentUser();
    
    if (currentUser) {
      initializeProfileData(currentUser);
    } else {
      navigate('/login');
    }
    
    setLoading(false);
  };

  if (isAuthenticated) {
    loadUserData();
  } else {
    navigate('/login');
  }
}, [isAuthenticated, navigate]); // ← Quita 'user' de las dependencias

  const initializeProfileData = (userData) => {
    const profile = {
      id: userData.id || `UID-${Math.floor(Math.random() * 10000)}`,
      nombre: userData.nombre || 'Usuario',
      apellido: userData.apellido || 'Sistema',
      nombreCompleto: `${userData.nombre || ''} ${userData.apellido || ''}`.trim() || 'Usuario Sistema',
      email: userData.email || userData.usuario || 'usuario@sistema.com',
      telefono: userData.telefono || 'No especificado',
      dni: userData.dni || 'No especificado',
      cargo: userData.cargo || 'Empleado',
      sucursal: userData.sucursal || 'Principal',
      usuario: userData.usuario || 'usuario',
      fechaRegistro: userData.fechaRegistro || new Date().toISOString(),
      ultimoAcceso: new Date().toLocaleString('es-PE'),
      turno: determinarTurno(),
      permisos: determinarPermisos(userData.cargo),
      activo: true,
      datosBancarios: {
        banco: userData.banco || '',
        tipoCuenta: userData.tipoCuenta || 'Ahorros',
        numeroCuenta: userData.numeroCuenta || '',
        cci: userData.cci || '',
        titularCuenta: userData.titularCuenta || '',
        monedaCuenta: userData.monedaCuenta || 'PEN'
      },
      // === DATOS DE LA TIENDA ===
      tiendaNombre: userData.tiendaNombre || 'Mi Tienda',
      tiendaDireccion: userData.tiendaDireccion || '',
      tiendaTelefono: userData.tiendaTelefono || '',
      tiendaRFC: userData.tiendaRFC || '',
      tiendaMensajeTicket: userData.tiendaMensajeTicket || '¡Gracias por su compra! Vuelva pronto :)'
    };
    setProfileData(profile);
  };

  const determinarTurno = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'Mañana (08:00 - 16:00)';
    if (hour >= 14 && hour < 22) return 'Tarde (16:00 - 00:00)';
    return 'Noche (00:00 - 08:00)';
  };

  const determinarPermisos = (cargo) => {
    const permisosBase = ['ventas'];
    switch (cargo) {
      case 'Administrador':
        return [...permisosBase, 'admin', 'inventario', 'reportes', 'usuarios', 'configuracion'];
      case 'Gerente':
        return [...permisosBase, 'inventario', 'reportes', 'usuarios'];
      case 'Supervisor':
        return [...permisosBase, 'inventario', 'reportes'];
      case 'Cajero':
        return [...permisosBase];
      case 'Almacén':
        return ['inventario'];
      default:
        return permisosBase;
    }
  };

  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [bankEditData, setBankEditData] = useState({});

  useEffect(() => {
    if (profileData) {
      setEditData({ ...profileData });
      setBankEditData({ ...profileData.datosBancarios });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    setBankEditData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
  setLoading(true);

  if (!editData.nombre?.trim()) {
    alert('El nombre es obligatorio');
    setLoading(false);
    return;
  }
  if (!editData.apellido?.trim()) {
    alert('El apellido es obligatorio');
    setLoading(false);
    return;
  }
  if (!editData.email?.trim()) {
    alert('El email es obligatorio');
    setLoading(false);
    return;
  }

  try {
    // Preparar datos para enviar al servidor
    const datosParaEnviar = {
      nombre: editData.nombre.trim(),
      apellido: editData.apellido.trim(),
      email: editData.email.trim(),
      telefono: editData.telefono || '',
      sucursal: editData.sucursal || 'Principal',
      cargo: editData.cargo,
      banco: bankEditData.banco || '',
      tipoCuenta: bankEditData.tipoCuenta || 'Ahorros',
      numeroCuenta: bankEditData.numeroCuenta || '',
      cci: bankEditData.cci || '',
      titularCuenta: bankEditData.titularCuenta || '',
      monedaCuenta: bankEditData.monedaCuenta || 'PEN',
      // === DATOS DE LA TIENDA ===
      tiendaNombre: editData.tiendaNombre?.trim() || 'Mi Tienda',
      tiendaDireccion: editData.tiendaDireccion?.trim() || '',
      tiendaTelefono: editData.tiendaTelefono?.trim() || '',
      tiendaRFC: editData.tiendaRFC?.trim() || '',
      tiendaMensajeTicket: editData.tiendaMensajeTicket?.trim() || '¡Gracias por su compra! Vuelva pronto :)'
    };

    console.log('📤 Enviando datos al servidor:', datosParaEnviar);

    // Usar la función actualizada de authService
    const result = await authService.updateUserInfo(datosParaEnviar);
    
    if (result.success && result.user) {
      console.log('✅ Respuesta del servidor:', result);
      
      // Actualizar estado local con los datos del servidor
      const updatedProfile = {
        ...profileData,
        ...result.user,
        nombreCompleto: `${result.user.nombre} ${result.user.apellido}`,
        datosBancarios: {
          banco: result.user.banco || '',
          tipoCuenta: result.user.tipoCuenta || 'Ahorros',
          numeroCuenta: result.user.numeroCuenta || '',
          cci: result.user.cci || '',
          titularCuenta: result.user.titularCuenta || '',
          monedaCuenta: result.user.monedaCuenta || 'PEN'
        },
        tiendaNombre: result.user.tiendaNombre || 'Mi Tienda',
        tiendaDireccion: result.user.tiendaDireccion || '',
        tiendaTelefono: result.user.tiendaTelefono || '',
        tiendaRFC: result.user.tiendaRFC || '',
        tiendaMensajeTicket: result.user.tiendaMensajeTicket || '¡Gracias por su compra! Vuelva pronto :)',
        ultimoAcceso: new Date().toLocaleString('es-PE')
      };
      
      setProfileData(updatedProfile);
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Forzar recarga de usuario en toda la app
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('userUpdated', {
          detail: { user: result.user }
        }));
      }, 1000);
      
      // Ocultar mensaje después de 4 segundos
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      alert('Error al guardar: ' + (result.error || 'Respuesta inválida del servidor'));
    }
  } catch (error) {
    console.error('❌ Error guardando perfil:', error);
    alert('Error al guardar los cambios: ' + (error.message || 'Verifica tu conexión'));
  } finally {
    setLoading(false);
  }
};

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Contraseña cambiada exitosamente (simulado - ruta pendiente)');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    authService.logout();
    setTimeout(() => {
      onLogout();
      navigate('/login');
    }, 500);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({ ...profileData });
      setBankEditData({ ...profileData.datosBancarios });
    }
    setIsEditing(!isEditing);
    setSaveSuccess(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const bancosPeru = [
    'BCP', 'BBVA', 'Interbank', 'Scotiabank', 'BanBif',
    'Banco de la Nación', 'Banco Pichincha', 'Banco GNB',
    'Banco Falabella', 'Banco Ripley', 'Banco Azteca',
    'MiBanco', 'Caja Huancayo', 'Caja Arequipa',
    'Caja Sullana', 'Caja Trujillo', 'Caja Piura', 'Caja Ica'
  ];

  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full border border-gray-100">
            <div className="relative mx-auto mb-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-xl animate-pulse">
                <IconUser className="text-white" size={56} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Cargando tu perfil
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Preparando toda tu información personal...
            </p>
            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <IconKey className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar perfil</h3>
            <p className="text-gray-600 mb-6">No se pudieron cargar los datos</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={isAuthenticated} user={profileData} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <IconArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Perfil de Usuario</h1>
                <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant={isEditing ? "outline" : "primary"}
                size="md"
                icon={isEditing ? IconArrowLeft : IconEdit}
                onClick={handleEditToggle}
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </Button>
              {isEditing && (
                <Button
                  variant="success"
                  size="md"
                  icon={IconDeviceFloppy}
                  onClick={handleSaveProfile}
                  loading={loading}
                >
                  Guardar Cambios
                </Button>
              )}
            </div>
          </div>
          {saveSuccess && (
            <Alert
              type="success"
              title="¡Perfil actualizado!"
              message="Tus cambios han sido guardados correctamente en el servidor."
              className="mt-4"
            />
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            <Card title="Información Personal" variant="light">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    {isEditing ? (
                      <Input type="text" name="nombre" value={editData.nombre || ''} onChange={handleInputChange} placeholder="Nombre" icon={IconUser} />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <IconUser className="text-gray-400 mr-3" size={20} />
                        <span className="font-medium">{profileData.nombre}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                    {isEditing ? (
                      <Input type="text" name="apellido" value={editData.apellido || ''} onChange={handleInputChange} placeholder="Apellido" icon={IconUser} />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <IconUser className="text-gray-400 mr-3" size={20} />
                        <span className="font-medium">{profileData.apellido}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <Input type="email" name="email" value={editData.email || ''} onChange={handleInputChange} placeholder="correo@empresa.com" icon={IconMail} />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <IconMail className="text-gray-400 mr-3" size={20} />
                        <span className="font-medium">{profileData.email}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    {isEditing ? (
                      <Input type="tel" name="telefono" value={editData.telefono || ''} onChange={handleInputChange} placeholder="+51 987654321" icon={IconPhone} />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <IconPhone className="text-gray-400 mr-3" size={20} />
                        <span className="font-medium">{profileData.telefono}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <IconId className="text-gray-400 mr-3" size={20} />
                      <span className="font-medium">{profileData.dni}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <IconUser className="text-gray-400 mr-3" size={20} />
                      <span className="font-medium">{profileData.usuario}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Información Laboral" variant="light">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
                    {isEditing ? (
                      <div className="relative">
                        <select
                          name="cargo"
                          value={editData.cargo || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        >
                          <option value="Cajero">Cajero</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Administrador">Administrador</option>
                          <option value="Almacén">Almacén</option>
                          <option value="Gerente">Gerente</option>
                        </select>
                        <IconBriefcase className="absolute left-3 top-3.5 text-gray-400" size={20} />
                      </div>
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <IconBriefcase className="text-gray-400 mr-3" size={20} />
                        <span className="font-medium">{profileData.cargo}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sucursal</label>
                    {isEditing ? (
                      <Input type="text" name="sucursal" value={editData.sucursal || ''} onChange={handleInputChange} placeholder="Sucursal Principal" icon={IconBuilding} />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <IconBuilding className="text-gray-400 mr-3" size={20} />
                        <span className="font-medium">{profileData.sucursal}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Turno Actual</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <IconCalendar className="text-gray-400 mr-3" size={20} />
                      <span className="font-medium">{profileData.turno}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mr-3 ${profileData.activo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{profileData.activo ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Registro</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <IconCalendar className="text-gray-400 mr-3" size={20} />
                      <span className="font-medium">{formatDate(profileData.fechaRegistro)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Último Acceso</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <IconHistory className="text-gray-400 mr-3" size={20} />
                      <span className="font-medium">{profileData.ultimoAcceso}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Datos Bancarios" variant="light">
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowBankData(!showBankData)}
                  className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-300 hover:border-primary-400 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-3">
                      <IconBuildingBank className="text-primary-600" size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Información bancaria para pagos</h3>
                      <p className="text-sm text-gray-600">
                        {profileData.datosBancarios?.numeroCuenta
                          ? 'Cuenta configurada - haz clic para ver/editar'
                          : 'Configura tus datos para recibir pagos'}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {showBankData ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                  </div>
                </button>
                {showBankData && (
                  <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="mb-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Información para transferencias</h4>
                      <p className="text-sm text-gray-600">
                        Estos datos se utilizan para realizar transferencias internas.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
                          {isEditing ? (
                            <div className="relative">
                              <select
                                name="banco"
                                value={bankEditData.banco || ''}
                                onChange={handleBankInputChange}
                                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                              >
                                <option value="">Seleccionar banco</option>
                                {bancosPeru.map((banco) => (
                                  <option key={banco} value={banco}>{banco}</option>
                                ))}
                              </select>
                              <IconBuildingBank className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <IconBuildingBank className="text-gray-400 mr-3" size={20} />
                              <span className="font-medium">
                                {profileData.datosBancarios?.banco || 'No especificado'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Cuenta</label>
                          {isEditing ? (
                            <div className="relative">
                              <select
                                name="tipoCuenta"
                                value={bankEditData.tipoCuenta || 'Ahorros'}
                                onChange={handleBankInputChange}
                                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                              >
                                <option value="Ahorros">Ahorros</option>
                                <option value="Corriente">Corriente</option>
                                <option value="Sueldo">Sueldo</option>
                                <option value="Vista">Vista</option>
                              </select>
                              <IconWallet className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <IconWallet className="text-gray-400 mr-3" size={20} />
                              <span className="font-medium">
                                {profileData.datosBancarios?.tipoCuenta || 'No especificado'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Número de Cuenta</label>
                          {isEditing ? (
                            <Input
                              type="text"
                              name="numeroCuenta"
                              value={bankEditData.numeroCuenta || ''}
                              onChange={handleBankInputChange}
                              placeholder="Ej: 191-12345678-0-12"
                              icon={IconCreditCard}
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <IconCreditCard className="text-gray-400 mr-3" size={20} />
                              <span className="font-medium">
                                {profileData.datosBancarios?.numeroCuenta || 'No especificado'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CCI (Código Interbancario)</label>
                          {isEditing ? (
                            <Input
                              type="text"
                              name="cci"
                              value={bankEditData.cci || ''}
                              onChange={handleBankInputChange}
                              placeholder="Ej: 00219100123456789012"
                              icon={IconId}
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <IconId className="text-gray-400 mr-3" size={20} />
                              <span className="font-medium">
                                {profileData.datosBancarios?.cci || 'No especificado'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titular de la Cuenta</label>
                        {isEditing ? (
                          <Input
                            type="text"
                            name="titularCuenta"
                            value={bankEditData.titularCuenta || ''}
                            onChange={handleBankInputChange}
                            placeholder="Nombre completo igual al registrado"
                            icon={IconUser}
                          />
                        ) : (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <IconUser className="text-gray-400 mr-3" size={20} />
                            <span className="font-medium">
                              {profileData.datosBancarios?.titularCuenta || profileData.nombreCompleto}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                        {isEditing ? (
                          <div className="relative">
                            <select
                              name="monedaCuenta"
                              value={bankEditData.monedaCuenta || 'PEN'}
                              onChange={handleBankInputChange}
                              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                            >
                              <option value="MXN">Pesos (MXN)</option>
                              <option value="USD">Dólares (USD)</option>
                            </select>
                            <IconCurrencyDollar className="absolute left-3 top-3.5 text-gray-400" size={20} />
                          </div>
                        ) : (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <IconCurrencyDollar className="text-gray-400 mr-3" size={20} />
                            <span className="font-medium">
                              {profileData.datosBancarios?.monedaCuenta === 'MXN' ? 'Pesos (MXN)' : 'Dolares (USD)'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Alert type="info" size="sm" className="mt-6">
                      <div className="text-sm">
                        <p><strong>Nota:</strong> Los datos bancarios son utilizados exclusivamente para transferencias internas.</p>
                        <p className="mt-1">Asegúrate de que la información sea correcta para evitar errores en los pagos.</p>
                      </div>
                    </Alert>
                  </div>
                )}
              </div>
            </Card>

            {/* === NUEVA SECCIÓN: DATOS DE LA TIENDA === */}
            <Card title="Datos de la Tienda (para tickets)" variant="light">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Esta información aparecerá en la cabecera de todos los tickets impresos.
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Tienda</label>
                    {isEditing ? (
                      <Input
                        type="text"
                        name="tiendaNombre"
                        value={editData.tiendaNombre || ''}
                        onChange={handleInputChange}
                        placeholder="Ej: Ferretería El Tornillo"
                        icon={IconBuildingStore}
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <IconBuildingStore className="text-gray-400 mr-3" size={20} />
                        <span className="font-medium">{profileData.tiendaNombre}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    {isEditing ? (
                      <Input
                        type="text"
                        name="tiendaDireccion"
                        value={editData.tiendaDireccion || ''}
                        onChange={handleInputChange}
                        placeholder="Calle Principal 123, Col. Centro, Ciudad"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{profileData.tiendaDireccion || 'No configurado'}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de la tienda</label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          name="tiendaTelefono"
                          value={editData.tiendaTelefono || ''}
                          onChange={handleInputChange}
                          placeholder="(55) 1234-5678"
                          icon={IconPhone}
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <IconPhone className="text-gray-400 mr-3" size={20} />
                          <span className="font-medium">{profileData.tiendaTelefono || 'No configurado'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">RFC</label>
                      {isEditing ? (
                        <Input
                          type="text"
                          name="tiendaRFC"
                          value={editData.tiendaRFC || ''}
                          onChange={handleInputChange}
                          placeholder="XAXX010101000"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{profileData.tiendaRFC || 'No configurado'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje final del ticket (opcional)</label>
                    {isEditing ? (
                      <Input
                        type="text"
                        name="tiendaMensajeTicket"
                        value={editData.tiendaMensajeTicket || ''}
                        onChange={handleInputChange}
                        placeholder="¡Gracias por su compra! Vuelva pronto :)"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{profileData.tiendaMensajeTicket}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Alert type="info" size="sm" className="mt-6">
                  <p className="text-sm">
                    <strong>Importante:</strong> Estos datos se mostrarán en todos los tickets impresos. Asegúrate de que sean correctos.
                  </p>
                </Alert>
              </div>
            </Card>

            <Card title="Cambiar Contraseña" variant="light">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                  <Input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" icon={IconLock} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                    <Input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" icon={IconLock} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                    <Input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" icon={IconLock} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="primary" size="md" icon={IconDeviceFloppy} onClick={handleChangePassword} loading={loading}>
                    Cambiar Contraseña
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-8">
              {/* Sidebar derecho (igual que antes) */}
              <Card>
                <div className="text-center">
                  <div className="relative mx-auto mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                      <span className="text-white text-4xl font-bold">
                        {profileData.nombre?.charAt(0) || 'U'}
                      </span>
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-2 right-2 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                        <IconCamera size={20} className="text-white" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{profileData.nombreCompleto}</h3>
                  <p className="text-gray-600 text-sm mb-4">{profileData.email}</p>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                    profileData.cargo === 'Administrador' ? 'bg-red-100 text-red-800' :
                    profileData.cargo === 'Gerente' ? 'bg-purple-100 text-purple-800' :
                    profileData.cargo === 'Supervisor' ? 'bg-blue-100 text-blue-800' :
                    profileData.cargo === 'Cajero' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {profileData.cargo}
                  </div>
                  <div className="mt-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <IconShield className="mr-2" size={18} />
                      Permisos del Sistema
                    </h4>
                    <div className="space-y-2">
                      {profileData.permisos?.map((permiso, index) => (
                        <div key={index} className="flex items-center">
                          <IconCheck className="text-green-500 mr-2" size={16} />
                          <span className="text-sm text-gray-700 capitalize">
                            {permiso === 'admin' ? 'Administrador' :
                             permiso === 'ventas' ? 'Gestión de Ventas' :
                             permiso === 'inventario' ? 'Control de Inventario' :
                             permiso === 'reportes' ? 'Generar Reportes' :
                             permiso === 'usuarios' ? 'Gestión de Usuarios' :
                             permiso === 'configuracion' ? 'Configuración' : permiso}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8">
                    <Button variant="outline" size="md" fullWidth onClick={() => navigate('/dashboard')}>
                      Volver al Dashboard
                    </Button>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="md"
                      fullWidth
                      icon={IconLogout}
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              </Card>

              <Card title="Datos del Sistema" variant="light">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">ID de Usuario:</span>
                    <span className="font-mono font-medium text-gray-900">{profileData.id}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">Sesión Activa:</span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-medium text-green-600">Activa</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">Versión del Sistema:</span>
                    <span className="font-medium text-gray-900">POS Pro v2.1</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">Última Actualización:</span>
                    <span className="font-medium text-gray-900">30 de diciembre de 2025</span>
                  </div>
                </div>
              </Card>

              <Card title="Acciones Rápidas" variant="primary">
                <div className="space-y-3">
                  <Button variant="light" size="md" fullWidth onClick={() => navigate('/reports')}>Ver Mis Reportes</Button>
                  <Button variant="light" size="md" fullWidth onClick={() => navigate('/settings')}>Configuración del Sistema</Button>
                  <Button variant="light" size="md" fullWidth onClick={() => {
                    const dataStr = JSON.stringify(profileData, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const exportFileDefaultName = `perfil-${profileData.usuario}.json`;
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}>Exportar Mis Datos</Button>
                  <Button variant="light" size="md" fullWidth onClick={() => navigate('/help')}>Ayuda y Soporte</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;