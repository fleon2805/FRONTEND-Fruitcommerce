import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Importar archivo de estilos personalizados

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Para redirigir

  const handleLogin = (e) => {
    e.preventDefault();

    // Aquí debes hacer tu solicitud a la API de login (usando JWT por ejemplo)
    axios.post('http://localhost:8000/api/api/token/', {
      username,
      password,
    })
    .then((response) => {
      // Almacenar token y usuario en localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('username', username);  // Guardamos el nombre del usuario
      localStorage.setItem('role', 'admin'); // Ejemplo: puedes ajustar esto según el backend

      // Redirigir al usuario a la página de bienvenida
      navigate('/welcome');
    })
    .catch((error) => {
      console.error('Error al iniciar sesión:', error);
    });
  };

  return (
    <div className="login-background">
      <div className="login-container d-flex justify-content-center align-items-center">
        <div className="login-card shadow-lg p-5">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
