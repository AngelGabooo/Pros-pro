

// src/services/reportService.js - VERSIÓN SIN JSPDF (HTML to PDF)
export const reportService = {
  generateSalesReport: async (data) => {
    return new Promise((resolve) => {
      // Crear un documento HTML para el reporte
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Reporte de Ventas - POS Pro</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1e40af;
              margin: 0;
              font-size: 28px;
            }
            .info-section {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .info-item {
              padding: 10px;
              background: white;
              border-radius: 6px;
              border-left: 4px solid #3b82f6;
            }
            .info-label {
              font-weight: 600;
              color: #64748b;
              font-size: 14px;
            }
            .info-value {
              font-size: 16px;
              font-weight: bold;
              color: #1e293b;
            }
            .section-title {
              color: #1e40af;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 10px;
              margin: 30px 0 20px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background: #3b82f6;
              color: white;
              padding: 12px;
              text-align: left;
            }
            td {
              padding: 10px;
              border-bottom: 1px solid #e2e8f0;
            }
            tr:hover {
              background: #f1f5f9;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              color: #64748b;
              font-size: 12px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            .total {
              background: #10b981;
              color: white;
              font-weight: bold;
              padding: 12px;
              border-radius: 6px;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin: 2px;
            }
            .badge-admin { background: #ef4444; color: white; }
            .badge-sales { background: #10b981; color: white; }
            .badge-stock { background: #f59e0b; color: white; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 REPORTE DE VENTAS</h1>
            <p>Sistema POS Pro - ${new Date().toLocaleDateString('es-PE')}</p>
          </div>
          
          <div class="info-section">
            <h2>Información del Usuario</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Usuario</div>
                <div class="info-value">${data.usuario.nombre} ${data.usuario.apellido}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Cargo</div>
                <div class="info-value">
                  <span class="badge badge-admin">${data.usuario.cargo}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Fecha</div>
                <div class="info-value">${data.fecha}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Turno</div>
                <div class="info-value">${data.turno || 'Actual'}</div>
              </div>
            </div>
          </div>
          
          <h2 class="section-title">📈 Estadísticas del Día</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Ventas Totales</div>
              <div class="info-value">${new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN'
              }).format(data.ventasHoy.monto)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Transacciones</div>
              <div class="info-value">${data.ventasHoy.cantidad}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Productos Vendidos</div>
              <div class="info-value">${data.productosVendidosHoy} unidades</div>
            </div>
            <div class="info-item">
              <div class="info-label">Ticket Promedio</div>
              <div class="info-value">${new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN'
              }).format(data.ventasHoy.cantidad > 0 ? data.ventasHoy.monto / data.ventasHoy.cantidad : 0)}</div>
            </div>
          </div>
          
          <h2 class="section-title">🛒 Ventas Recientes</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              ${data.ventasRecientes.slice(0, 10).map(venta => `
                <tr>
                  <td>${venta.codigo}</td>
                  <td>${venta.cliente || 'Sin cliente'}</td>
                  <td>${venta.items.length}</td>
                  <td>${new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN'
                  }).format(venta.total)}</td>
                  <td>${new Date(venta.fechaVenta).toLocaleTimeString()}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">Total:</td>
                <td colspan="2" class="total">
                  ${new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN'
                  }).format(data.ventasRecientes.reduce((sum, venta) => sum + venta.total, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
          
          ${data.productosMasVendidos && data.productosMasVendidos.length > 0 ? `
            <h2 class="section-title">🏆 Productos Más Vendidos</h2>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Vendida</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                ${data.productosMasVendidos.slice(0, 5).map(producto => `
                  <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.totalVendido} unidades</td>
                    <td>${new Intl.NumberFormat('es-PE', {
                      style: 'currency',
                      currency: 'PEN'
                    }).format(producto.totalIngresos)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
          
          <div class="footer">
            <p>Documento generado automáticamente por POS Pro System</p>
            <p>Fecha de generación: ${new Date().toLocaleString('es-PE')}</p>
            <p>© ${new Date().getFullYear()} Sistema de Punto de Venta - Todos los derechos reservados</p>
          </div>
        </body>
        </html>
      `;
      
      // Crear un blob con el HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Abrir en nueva ventana para imprimir
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          resolve(url);
        };
      } else {
        // Si no se pudo abrir ventana, mostrar alerta
        alert('Permite las ventanas emergentes para imprimir el reporte');
        resolve(null);
      }
    });
  },

  generateDetailedReport: async (data) => {
    return new Promise((resolve) => {
      // Para el reporte detallado, podemos usar una función más simple
      // que cree un archivo CSV para descargar
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Cabeceras del CSV
      const headers = [
        'Tipo de Reporte',
        'Fecha',
        'Usuario',
        'Cargo',
        'Ventas Totales',
        'Transacciones',
        'Productos Vendidos',
        'Clientes Atendidos',
        'Productos Stock Bajo'
      ];
      
      csvContent += headers.join(',') + "\\n";
      
      // Datos principales
      const rowData = [
        'Reporte Detallado',
        new Date().toLocaleDateString('es-PE'),
        `${data.usuario.nombre} ${data.usuario.apellido}`,
        data.usuario.cargo,
        data.estadisticas.ventasTotales,
        data.estadisticas.transacciones,
        data.estadisticas.productosVendidos,
        data.estadisticas.clientesAtendidos,
        data.estadisticas.stockBajo
      ];
      
      csvContent += rowData.join(',') + "\\n\\n";
      
      // Ventas detalladas
      if (data.ventasDetalladas.length > 0) {
        csvContent += "VENTAS DETALLADAS\\n";
        csvContent += 'Código,Cliente,Productos,Cantidad Total,Total,Método Pago,Fecha/Hora\\n';
        
        data.ventasDetalladas.forEach(venta => {
          const cantidadTotal = venta.items.reduce((sum, item) => sum + item.cantidad, 0);
          const ventaRow = [
            venta.codigo,
            `"${venta.cliente || 'Sin cliente'}"`,
            `"${venta.items.map(item => item.nombre).join(', ')}"`,
            cantidadTotal,
            venta.total,
            venta.metodoPago,
            new Date(venta.fechaVenta).toLocaleString('es-PE')
          ];
          csvContent += ventaRow.join(',') + "\\n";
        });
        
        csvContent += "\\n";
      }
      
      // Métodos de pago
      if (data.metodosPago.length > 0) {
        csvContent += "MÉTODOS DE PAGO\\n";
        csvContent += 'Método,Monto,Porcentaje\\n';
        
        data.metodosPago.forEach(metodo => {
          const porcentaje = data.estadisticas.ventasTotales > 0 
            ? ((metodo.monto / data.estadisticas.ventasTotales) * 100).toFixed(1)
            : '0';
          
          const metodoRow = [
            metodo._id,
            metodo.monto,
            `${porcentaje}%`
          ];
          csvContent += metodoRow.join(',') + "\\n";
        });
      }
      
      // Crear enlace de descarga
      const encodedUri = encodeURI(csvContent);
      resolve(encodedUri);
    });
  }
};