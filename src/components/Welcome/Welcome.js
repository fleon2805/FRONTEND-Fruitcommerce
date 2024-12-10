import React from 'react';
import './Welcome.css'; // Archivo CSS con estilos mejorados
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap para el layout
import { Link } from 'react-router-dom';

const Welcome = () => {
  const username = localStorage.getItem('username'); // Nombre del usuario
  const role = localStorage.getItem('role'); // Rol del usuario

  return (
    <div className="welcome-background">
      <div className="container mt-5">
        <div className="text-center text-white">
          <h1 className="display-3">¡Bienvenido, {username}!</h1>
          <h3 className="text-muted">Rol: {role}</h3>
          <p className="lead mt-4">Explora las opciones disponibles según tu rol en el sistema.</p>
        </div>

        {/* Opciones principales */}
        <div className="row mt-5">
          {/* Gestión de Productos */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body text-center">
                <h5 className="card-title">Gestión de Productos</h5>
                <p className="card-text">Añadir, modificar o eliminar productos.</p>
                <Link to="/productos" className="btn btn-lg btn-primary">Ver Productos</Link>
              </div>
            </div>
          </div>

          {/* Gestión de Ventas */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body text-center">
                <h5 className="card-title">Gestión de Ventas</h5>
                <p className="card-text">Ver, editar o gestionar ventas realizadas.</p>
                <Link to="/ventas" className="btn btn-lg btn-primary">Ver Ventas</Link>
              </div>
            </div>
          </div>

          {/* Gestión de Usuarios */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body text-center">
                <h5 className="card-title">Gestión de Usuarios</h5>
                <p className="card-text">Ver o administrar los usuarios del sistema.</p>
                <Link to="/usuarios" className="btn btn-lg btn-primary">Ver Usuarios</Link>
              </div>
            </div>
          </div>

          {/* Gestion de Proveedores */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body text-center">
                <h5 className="card-title">Gestión de Proveedores</h5>
                <p className="card-text">Ver, editar o gestionar proveedores</p>
                <Link to="/proveedores" className="btn btn-lg btn-primary">Ver Proveedores</Link>
              </div>
            </div>
          </div>

          {/* Gestión de Métodos de Pago */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body text-center">
                <h5 className="card-title">Gestión de Métodos de Pago</h5>
                <p className="card-text">Ver, editar o gestionar métodos de pago</p>
                <Link to="/metodospago" className="btn btn-lg btn-primary">Ver Métodos</Link>
              </div>
            </div>
          </div>

          {/* Gestión de Facturas */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body text-center">
                <h5 className="card-title">Gestión de Facturas</h5>
                <p className="card-text">Ver, editar o gestionar facturas realizadas.</p>
                <Link to="/facturas" className="btn btn-lg btn-primary">Ver Facturas</Link>
              </div>
            </div>
          </div>

          {/* Gestión de DetalleVentas */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body text-center">
                <h5 className="card-title">FruitBotCommerce</h5>
                <p className="card-text">Ver, editar o gestionar detalles de ventas</p>
                <Link to="/chatbot" className="btn btn-lg btn-primary">Ver Chatbot</Link>
              </div>
            </div>
          </div>

          {/* Gestión de Dashboard */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body text-center">
                <h5 className="card-title">Gestión de Dashboard</h5>
                <p className="card-text">Ver, editar o gestionar detalles de ventas</p>
                <Link to="/dashboard" className="btn btn-lg btn-primary">Ver Dashboard</Link>
              </div>
            </div>
          </div>

          {/* Gestión de Roles */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body text-center">
                <h5 className="card-title">Gestión de Roles</h5>
                <p className="card-text">Ver, editar o gestionar roles</p>
                <Link to="/roles" className="btn btn-lg btn-primary">Ver Roles</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
