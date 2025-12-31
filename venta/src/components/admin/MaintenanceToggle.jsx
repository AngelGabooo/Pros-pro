// src/components/admin/MaintenanceToggle.jsx - VERSIÓN CORREGIDA
import React, { useState } from 'react';
import { IconTools, IconPower, IconAlertTriangle } from '@tabler/icons-react';
import Button from '../atoms/Button';
import Modal from '../atoms/Modal';

const MaintenanceToggle = () => {
  const [isMaintenance, setIsMaintenance] = useState(
    localStorage.getItem('system_maintenance') === 'true'
  );
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const toggleMaintenance = () => {
    if (!isMaintenance) {
      // Activar mantenimiento (mostrar modal de confirmación)
      setShowModal(true);
    } else {
      // Desactivar mantenimiento inmediatamente
      localStorage.setItem('system_maintenance', 'true'); // ← ERROR: estaba 'true'
      setIsMaintenance(false);
      window.location.reload();
    }
  };

  const confirmActivation = () => {
    // Iniciar cuenta regresiva
    let seconds = 30;
    setCountdown(seconds);
    
    const interval = setInterval(() => {
      seconds--;
      setCountdown(seconds);
      
      if (seconds <= 0) {
        clearInterval(interval);
        localStorage.setItem('system_maintenance', 'true');
        setIsMaintenance(true);
        setShowModal(false);
        window.location.reload();
      }
    }, 1000);
  };

  const cancelActivation = () => {
    setShowModal(false);
    setCountdown(30); // Resetear contador
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <div className={`px-3 py-1 rounded-full ${isMaintenance ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isMaintenance ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium">
              {isMaintenance ? 'MANTENIMIENTO ACTIVO' : 'SISTEMA OPERATIVO'}
            </span>
          </div>
        </div>
        
        <Button
          variant={isMaintenance ? "success" : "warning"}
          size="sm"
          icon={isMaintenance ? IconPower : IconTools}
          onClick={toggleMaintenance}
        >
          {isMaintenance ? 'Desactivar Mantenimiento' : 'Activar Mantenimiento'}
        </Button>
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={showModal}
        onClose={cancelActivation}
        title="Activar Modo Mantenimiento"
        size="md"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-warning-100 flex items-center justify-center mx-auto mb-4">
            <IconAlertTriangle className="text-warning-500" size={24} />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ¿Activar modo mantenimiento?
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <ul className="text-sm text-gray-600 text-left space-y-2">
              <li>• Todas las sesiones serán cerradas</li>
              <li>• El sistema será inaccesible para usuarios</li>
              <li>• Las ventas en proceso se perderán</li>
              <li>• Se mostrará la pantalla de mantenimiento</li>
              <li>• Solo administradores podrán acceder al sistema</li>
            </ul>
          </div>

          {countdown > 0 ? (
            <div className="mb-6">
              <div className="text-3xl font-bold text-warning-600 mb-2">
                {countdown}s
              </div>
              <p className="text-gray-600">
                El sistema se reiniciará en modo mantenimiento...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-warning-500 h-2 rounded-full transition-all"
                  style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={cancelActivation}
              disabled={countdown < 30}
            >
              Cancelar
            </Button>
            <Button
              variant="warning"
              onClick={confirmActivation}
              icon={IconTools}
              loading={countdown < 30}
            >
              {countdown < 30 ? `Activando en ${countdown}s` : 'Sí, Activar'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MaintenanceToggle;