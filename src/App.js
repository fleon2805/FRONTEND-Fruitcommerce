import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout'; // Importamos el Layout
import Welcome from './components/Welcome/Welcome'; // Página de bienvenida
import Login from './components/Login/Login'; // Página de Login
import Ventas from './components/Ventas/Ventas'; // Página de Ventas
import Productos from './components/Productos/Producto'; // Página de Productos
import Usuarios from './components/Usuarios/Usuarios'; // Página de Usuarios
import Proveedores from './components/Proveedores/Proveedores';
import MetodosPago from './components/MetodosPago/MetodosPago';
import Facturas from './components/Facturas/Facturas';
import DetalleVentas from './components/DetalleVentas/DetalleVentas';
import Dashboard from './components/Dashboard/Dashboard';
import Roles from './components/Roles/Roles';
import Chatbot from './components/Chatbot/chatbot'; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para el layout principal que envolverá todas las demás */}
        <Route element={<Layout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/ventas" element={<Ventas />} /> 
          <Route path="/productos" element={<Productos />} /> 
          <Route path="/usuarios" element={<Usuarios />} /> 
          <Route path="/proveedores" element={<Proveedores />} /> 
          <Route path="/metodospago" element={<MetodosPago />} /> 
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/detalleventas" element={<DetalleVentas />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/chatbot" element={<Chatbot />} />  {/* Ruta para el Chatbot */}
        </Route>

        {/* Página de login que no tiene Layout */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
