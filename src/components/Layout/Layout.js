import React from 'react';
import { Outlet, Link } from 'react-router-dom'; // Outlet es donde se renderizan las páginas
import 'bootstrap/dist/css/bootstrap.min.css';
import './Layout.css'; // Nuevo archivo CSS para estilos personalizados

const Layout = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    // Redirige a login después de hacer logout
    window.location.href = '/login';
  };

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-custom">
        <div className="container-fluid">
          <Link className="navbar-brand logo" to="/welcome">FruitCommerce</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto"> {/* "ms-auto" para alinear a la derecha */}
              <li className="nav-item">
                <span className="nav-link text-light welcome-text">Bienvenido, {username}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-logout" onClick={handleLogout}>Logout</button> {/* Botón rojo */}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenedor de las rutas hijas */}
      <div className="container main-content mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
