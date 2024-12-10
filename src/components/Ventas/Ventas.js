import React, { useState, useEffect } from 'react';
import { getVentas, getCompradores, getMetodosPago, getDetalleVenta, getProveedores } from '../../api';

const Venta = () => {
  const [ventas, setVentas] = useState([]);
  const [compradores, setCompradores] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [filtroComprador, setFiltroComprador] = useState('');
  const [filtroMetodoPago, setFiltroMetodoPago] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVentas();
    fetchCompradores();
    fetchMetodosPago();
    fetchProveedores();
  }, []);

  const fetchVentas = async () => {
    try {
      const data = await getVentas();
      setVentas(data);
    } catch (error) {
      setError('Error al obtener las ventas.');
      console.error(error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (error) {
      setError('Error al obtener los proveedores.');
      console.error(error);
    }
  };

  const fetchCompradores = async () => {
    try {
      const data = await getCompradores();
      setCompradores(data);
    } catch (error) {
      setError('Error al obtener los compradores.');
      console.error(error);
    }
  };

  const fetchMetodosPago = async () => {
    try {
      const data = await getMetodosPago();
      setMetodosPago(data);
    } catch (error) {
      setError('Error al obtener los métodos de pago.');
      console.error(error);
    }
  };

  const verDetalleVenta = async (ventaId) => {
    try {
      const data = await getDetalleVenta(ventaId);
      setDetalleVenta(data);
      setVentaSeleccionada(ventaId);
    } catch (error) {
      setError('Error al obtener el detalle de la venta.');
      console.error(error);
    }
  };

  const filtrarVentas = () => {
    return ventas.filter((venta) => {
      const coincideComprador = filtroComprador
        ? venta.comprador?.nombres.toLowerCase().includes(filtroComprador.toLowerCase())
        : true;

      const coincideMetodoPago = filtroMetodoPago
        ? venta.metodo_pago?.metodo === filtroMetodoPago
        : true;

      return coincideComprador && coincideMetodoPago;
    });
  };

  return (
    <div className="container">
      <h1 className="my-4">Ventas</h1>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Filtrar por comprador</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese el nombre del comprador"
            value={filtroComprador}
            onChange={(e) => setFiltroComprador(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Filtrar por método de pago</label>
          <select
            className="form-select"
            value={filtroMetodoPago}
            onChange={(e) => setFiltroMetodoPago(e.target.value)}
          >
            <option value="">Seleccione un método</option>
            {metodosPago.map((metodo) => (
              <option key={metodo.id} value={metodo.metodo}>
                {metodo.metodo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Comprador</th>
            <th>Teléfono</th>
            <th>Método de Pago</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrarVentas().length > 0 ? (
            filtrarVentas().map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{venta.comprador?.nombres || 'Sin comprador'}</td>
                <td>{venta.comprador?.telefono || 'N/A'}</td>
                <td>{venta.metodo_pago?.metodo || 'Sin método'}</td>
                <td>
                  {venta.fecha_venta && !isNaN(new Date(venta.fecha_venta).getTime())
                    ? new Date(venta.fecha_venta).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                    : 'Fecha no válida'}
                </td>
                <td>${venta.total}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => verDetalleVenta(venta.id)}
                    data-bs-toggle="modal"
                    data-bs-target="#detalleVentaModal"
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No se encontraron ventas.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de Detalle de Venta */}
      <div
        className="modal fade"
        id="detalleVentaModal"
        tabIndex="-1"
        aria-labelledby="detalleVentaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="detalleVentaModalLabel">Detalle de la Venta</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {detalleVenta.length > 0 ? (
                <ul className="list-group">
                  {detalleVenta.map((detalle, index) => {
                    const proveedor = proveedores.find(
                      (prov) => prov.id === detalle.producto?.proveedor_id
                    );
                    return (
                      <li key={index} className="list-group-item">
                        <strong>Producto:</strong> {detalle.producto?.nombre || 'Sin producto'} <br />
                        <strong>Cantidad:</strong> {detalle.cantidad} <br />
                        <strong>Precio Unitario:</strong> ${detalle.precio_unitario} <br />
                        <strong>Proveedor:</strong> {proveedor?.nombre_empresa || 'N/A'}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No hay detalles disponibles para esta venta.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mostrar errores */}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Venta;
