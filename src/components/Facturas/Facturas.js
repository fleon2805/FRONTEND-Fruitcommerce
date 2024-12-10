import React, { useState, useEffect } from 'react';
import { getFacturas } from '../../api';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroNumero, setFiltroNumero] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const data = await getFacturas();
      setFacturas(data);
    } catch (error) {
      setError('Error al obtener las facturas.');
      console.error(error);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(facturas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Facturas');
    XLSX.writeFile(wb, 'facturas.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Lista de Facturas', 20, 20);
    doc.setFontSize(12);

    let yPosition = 30;

    facturas.forEach((factura, index) => {
      doc.text(
        `${index + 1}. Número: ${factura.numero_factura} | Fecha: ${factura.fecha_emision} | Total: $${factura.monto_total}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    doc.save('facturas.pdf');
  };

  const filtrarFacturas = () => {
    return facturas.filter((factura) => {
      const coincideFecha = filtroFecha
        ? factura.fecha_emision?.includes(filtroFecha)
        : true;

      const coincideNumero = filtroNumero
        ? factura.numero_factura?.toLowerCase().includes(filtroNumero.toLowerCase())
        : true;

      return coincideFecha && coincideNumero;
    });
  };

  return (
    <div className="container">
      <h1 className="my-4">Facturas</h1>

      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Filtrar por Fecha</label>
          <input
            type="date"
            className="form-control"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Filtrar por Número de Factura</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese el número de factura"
            value={filtroNumero}
            onChange={(e) => setFiltroNumero(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={exportToExcel}>
          Exportar a Excel
        </button>
        <button className="btn btn-danger" onClick={exportToPDF}>
          Exportar a PDF
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de Factura</th>
            <th>Fecha de Emisión</th>
            <th>Monto Total</th>
          </tr>
        </thead>
        <tbody>
          {filtrarFacturas().length > 0 ? (
            filtrarFacturas().map((factura) => (
              <tr key={factura.id}>
                <td>{factura.id}</td>
                <td>{factura.numero_factura || 'N/A'}</td>
                <td>
                  {factura.fecha_emision &&
                  !isNaN(new Date(factura.fecha_emision).getTime())
                    ? new Date(factura.fecha_emision).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                    : 'Fecha no válida'}
                </td>
                <td>${factura.monto_total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No se encontraron facturas.</td>
            </tr>
          )}
        </tbody>
      </table>

      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Facturas;
