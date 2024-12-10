import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem('token'); // Aquí puedes verificar si el usuario está autenticado

  return (
    <Routes>
      <Route
        {...rest}
        element={
          isAuthenticated ? <Component /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
};

export default PrivateRoute;