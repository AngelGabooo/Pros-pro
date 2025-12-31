// src/hooks/useMaintenance.js - VERSIÓN SIMPLIFICADA
import { useState, useEffect } from 'react';

const useMaintenance = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar en localStorage si está activo el mantenimiento
    const maintenanceStatus = localStorage.getItem('system_maintenance');
    const maintenanceActive = maintenanceStatus === 'true';
    
    setIsMaintenance(maintenanceActive);
    setLoading(false);
  }, []);

  const toggleMaintenance = (status) => {
    localStorage.setItem('system_maintenance', status.toString());
    setIsMaintenance(status);
    
    // Recargar para aplicar cambios
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return { isMaintenance, loading, toggleMaintenance };
};

export default useMaintenance;