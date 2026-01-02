// src/services/reportService.js
// Servicio para generar reportes (HTML imprimible + CSV descargable)
// Sin dependencias externas (no usa jsPDF)

export const reportService = {
  /**
   * Genera un reporte de ventas bonito en HTML y lo abre para imprimir
   * @param {Object} data - Datos del dashboard/stats
   */
  generateSalesReport: async (data) => {
    return new Promise((resolve) => {
      const fechaGeneracion = new Date().toLocaleString('es-PE');
      const fechaReporte = new Date().toLocaleDateString('es-PE');

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reporte de Ventas - POS Pro</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              margin: 40px;
              color: #333;
              line-height: 1.6;
              background: #fff;
            }
            .header {
              text-align: center;
              border-bottom: 4px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1e40af;
              margin: 0;
              font-size: 32px;
              font-weight: bold;
            }
            .header p {
              color: #64748b;
              margin: 10px 0 0;
              font-size: 16px;
            }
            .info-section {
              background: #f8fafc;
              padding: 25px;
              border-radius: 12px;
              margin-bottom: 30px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-top: 15px;
            }
            .info-item {
              background: white;
              padding: 15px;
              border-radius: 8px;
              border-left: 5px solid #3b82f6;
              box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            }
            .info-label {
              font-weight: 600;
              color: #64748b;
              font-size: 14px;
              margin-bottom: 5px;
            }
            .info-value {
              font-size: 18px;
              font-weight: bold;
              color: #1e293b;
            }
            .section-title {
              color: #1e40af;
              font-size: 22px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 10px;
              margin: 40px 0 20px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            th {
              background: #3b82f6;
              color: white;
              padding: 14px;
              text-align: left;
              font-weight: 600;
            }
            td {
              padding: 12px 14px;
              border-bottom: 1px solid #e2e8f0;
            }
            tr:hover {
              background: #f8fafc;
            }
            .total-row {
              background: #10b981 !important;
              color: white;
              font-weight: bold;
              font-size: 18px;
            }
            .badge {
              display: inline-block;
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 600;
            }
            .badge-admin { background: #ef4444; }
            .badge-gerente { background: #f59e0b; }
            .badge-cajero { background: #3b82f6; }
            .badge-almacen { background: #8b5cf6; }
            .footer {
              text-align: center;
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 13px;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 REPORTE DE VENTAS DIARIAS</h1>
            <p>Sistema POS Pro • ${fechaReporte}</p>
          </div>

          <div class="info-section">
            <h2 style="color: #1e40af; margin-top: 0;">Información del Responsable</h2>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Usuario</div>
                <div class="info-value">${data.usuario?.nombre || 'N/A'} ${data.usuario?.apellido || ''}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Cargo</div>
                <div class="info-value">
                  <span class="badge badge-${(data.usuario?.cargo || '').toLowerCase().replace(' ', '-')}">
                    ${data.usuario?.cargo || 'N/A'}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Tienda</div>
                <div class="info-value">${data.usuario?.tiendaNombre || 'Mi Tienda'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Generado el</div>
                <div class="info-value">${fechaGeneracion}</div>
              </div>
            </div>
          </div>

          <h2 class="section-title">📈 Resumen del Día</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Ventas Totales</div>
              <div class="info-value">
                ${new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(data.ventasHoy?.monto || 0)}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">N° de Transacciones</div>
              <div class="info-value">${data.ventasHoy?.cantidad || 0}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Productos Vendidos</div>
              <div class="info-value">${data.productosVendidosHoy || 0} unidades</div>
            </div>
            <div class="info-item">
              <div class="info-label">Ticket Promedio</div>
              <div class="info-value">
                ${new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(
                  data.ventasHoy?.cantidad > 0 
                    ? (data.ventasHoy?.monto || 0) / data.ventasHoy.cantidad 
                    : 0
                )}
              </div>
            </div>
          </div>

          <h2 class="section-title">🛍️ Últimas Ventas</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Items</th>
                <th>Total</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              ${data.ventasRecientes?.slice(0, 10).map(venta => `
                <tr>
                  <td><strong>${venta.codigo || 'N/A'}</strong></td>
                  <td>${venta.cliente || 'Cliente ocasional'}</td>
                  <td>${venta.items?.length || 0}</td>
                  <td><strong>${new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(venta.total || 0)}</strong></td>
                  <td>${new Date(venta.fechaVenta).toLocaleTimeString('es-PE')}</td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center; color:#64748b;">No hay ventas recientes</td></tr>'}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3"><strong>TOTAL DEL DÍA</strong></td>
                <td colspan="2">
                  <strong>${new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(data.ventasHoy?.monto || 0)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>

          ${data.productosMasVendidos && data.productosMasVendidos.length > 0 ? `
            <h2 class="section-title">🏆 Top 5 Productos Más Vendidos</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                ${data.productosMasVendidos.slice(0, 5).map((producto, index) => `
                  <tr>
                    <td><strong>${index + 1}</strong></td>
                    <td>${producto.nombre || 'N/A'}</td>
                    <td><strong>${producto.totalVendido || 0} und.</strong></td>
                    <td><strong>${new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(producto.totalIngresos || 0)}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          <div class="footer">
            <p><strong>Documento generado automáticamente por POS Pro System</strong></p>
            <p>Fecha y hora de generación: ${fechaGeneracion}</p>
            <p>© ${new Date().getFullYear()} - Sistema de Punto de Venta Profesional</p>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      const printWindow = window.open(url, '_blank', 'width=1000,height=800');

      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
          }, 500);
        };
        resolve({ success: true, url });
      } else {
        alert('⚠️ Por favor, permite las ventanas emergentes para imprimir el reporte.');
        resolve({ success: false, error: 'Pop-up bloqueado' });
      }
    });
  },

  /**
   * Genera un reporte detallado en formato CSV para descargar
   */
  generateDetailedReport: async (data) => {
    return new Promise((resolve) => {
      let csvContent = "data:text/csv;charset=utf-8,";

      // Encabezado principal
      csvContent += "REPORTE DETALLADO DE VENTAS\n";
      csvContent += `Fecha de Generación:,${new Date().toLocaleString('es-PE')}\n`;
      csvContent += `Usuario:,${data.usuario?.nombre || ''} ${data.usuario?.apellido || ''}\n`;
      csvContent += `Cargo:,${data.usuario?.cargo || ''}\n`;
      csvContent += `Tienda:,${data.usuario?.tiendaNombre || 'Mi Tienda'}\n\n`;

      // Resumen del día
      csvContent += "RESUMEN DEL DÍA\n";
      csvContent += "Concepto,Valor\n";
      csvContent += `Ventas Totales,${data.ventasHoy?.monto || 0}\n`;
      csvContent += `N° Transacciones,${data.ventasHoy?.cantidad || 0}\n`;
      csvContent += `Productos Vendidos,${data.productosVendidosHoy || 0}\n`;
      csvContent += `Ticket Promedio,${data.ventasHoy?.cantidad > 0 ? (data.ventasHoy.monto / data.ventasHoy.cantidad).toFixed(2) : 0}\n\n`;

      // Ventas detalladas
      if (data.ventasRecientes && data.ventasRecientes.length > 0) {
        csvContent += "ÚLTIMAS VENTAS\n";
        csvContent += "Código,Cliente,Items,Total,Hora,Método Pago\n";

        data.ventasRecientes.slice(0, 20).forEach(venta => {
          const itemsText = venta.items?.map(i => i.nombre).join(' | ') || '';
          csvContent += `"${venta.codigo || ''}","${venta.cliente || 'Ocasional'}","${itemsText}",${venta.total || 0},${new Date(venta.fechaVenta).toLocaleTimeString('es-PE')},${venta.metodoPago || 'N/A'}\n`;
        });
        csvContent += "\n";
      }

      // Productos más vendidos
      if (data.productosMasVendidos && data.productosMasVendidos.length > 0) {
        csvContent += "TOP PRODUCTOS MÁS VENDIDOS\n";
        csvContent += "Posición,Producto,Cantidad,Ingresos\n";

        data.productosMasVendidos.slice(0, 10).forEach((p, i) => {
          csvContent += `${i + 1},${p.nombre || 'N/A'},${p.totalVendido || 0},${p.totalIngresos || 0}\n`;
        });
      }

      const encodedUri = encodeURIComponent(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `reporte_ventas_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      resolve({ success: true, message: 'CSV descargado correctamente' });
    });
  }
};

export default reportService;