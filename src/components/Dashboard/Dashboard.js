import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Container, Typography, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Importamos las funciones de API
import { getVentas, getProductos, getCompradores, getFacturas, getDetalleVenta } from '../../api';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  // Estados para almacenar los datos
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [compradores, setCompradores] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);  // Estado para controlar la venta seleccionada

  // Funciones para obtener los datos
  useEffect(() => {
    // Cargar ventas
    getVentas().then((data) => setVentas(data));

    // Cargar productos
    getProductos().then((data) => setProductos(data));

    // Cargar compradores
    getCompradores().then((data) => setCompradores(data));

    // Cargar facturas
    getFacturas().then((data) => setFacturas(data));
  }, []);

  // Función para obtener el detalle de una venta (cuando se hace clic en una venta)
  const handleVentaClick = async (ventaId) => {
    if (ventaSeleccionada === ventaId) {
      // Si la venta ya está seleccionada, contraemos el detalle
      setVentaSeleccionada(null);
      setDetalleVenta([]);
    } else {
      // Si no, mostramos el detalle de la venta
      setVentaSeleccionada(ventaId);
      const detalle = await getDetalleVenta(ventaId);
      setDetalleVenta(detalle);
    }
  };

  // Datos para el gráfico de ventas
  const salesChartData = {
    labels: ventas.map((venta) => venta.numero_venta), // Usamos el número de venta como etiqueta
    datasets: [{
      label: 'Ventas Totales',
      data: ventas.map((venta) => venta.total),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Dashboard de Ventas
      </Typography>

      {/* Gráfico de ventas */}
      <Box mb={4}>
        <Typography variant="h5">Ventas por Número de Venta</Typography>
        <Bar data={salesChartData} />
      </Box>

      {/* Tabla de ventas */}
      <Paper>
        <Typography variant="h6" m={2}>
          Ventas Recientes
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Numero Venta</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Comprador</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map((venta) => (
              <TableRow key={venta.id} hover onClick={() => handleVentaClick(venta.id)}>
                <TableCell>{venta.fecha_venta}</TableCell>
                <TableCell>{venta.numero_venta}</TableCell>
                <TableCell>{venta.total}</TableCell>
                {/* Verificamos que 'comprador' no sea null y tiene la propiedad 'nombre' */}
                <TableCell>{venta.comprador && venta.comprador.nombres ? venta.comprador.nombres : 'Desconocido'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Detalles de la venta seleccionada */}
      {ventaSeleccionada && detalleVenta.length > 0 && (
        <Paper style={{ marginTop: '20px' }}>
          <Typography variant="h6" m={2}>
            Detalle de la Venta
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detalleVenta.map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell>{detalle.producto ? detalle.producto.nombre : 'Desconocido'}</TableCell>
                  <TableCell>{detalle.cantidad}</TableCell>
                  <TableCell>{detalle.precio_unitario}</TableCell>
                  <TableCell>{detalle.subtotal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Tabla de Facturas */}
      <Paper style={{ marginTop: '20px' }}>
        <Typography variant="h6" m={2}>
          Facturas Generadas
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numero Factura</TableCell>
              <TableCell>Fecha Emisión</TableCell>
              <TableCell>Monto Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell>{factura.numero_factura}</TableCell>
                <TableCell>{factura.fecha_emision}</TableCell>
                <TableCell>{factura.monto_total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Dashboard;
