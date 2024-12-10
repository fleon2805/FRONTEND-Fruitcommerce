import React, { useState, useEffect } from 'react';
import { getUsers, getRoles, createUser, updateUser, deleteUser } from '../../api';  // Importar funciones desde api.js

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    account_expiry_date: '',
    account_non_expired: true,
    account_non_locked: true,
    credentials_expiry_date: '',
    credentials_non_expired: true,
    is_two_factor_enabled: false,
    sign_up_method: '',
  });
  const [editUser, setEditUser] = useState(null);
  const [roles, setRoles] = useState([]);

  // Cargar usuarios y roles al montar el componente
  useEffect(() => {
    const loadUsersAndRoles = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error(error.message);
      }
    };

    loadUsersAndRoles();
  }, []);

  // Crear un nuevo usuario
  const handleCreateUser = async () => {
    try {
      const createdUser = await createUser(newUser);
      setUsers([...users, createdUser]);
      resetUserForm();
    } catch (error) {
      console.error('Error al crear el usuario', error);
    }
  };

  // Editar usuario
  const handleEditUser = (user) => {
    setEditUser(user);
    setNewUser(user);  // Prellenar el formulario con los datos del usuario a editar
  };

  // Actualizar usuario
  const handleUpdateUser = async () => {
    try {
      const updatedUser = await updateUser(editUser.id, editUser);
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setEditUser(null);
      resetUserForm();
    } catch (error) {
      console.error('Error al actualizar el usuario', error);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error al eliminar el usuario', error);
    }
  };

  // Manejadores de input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (editUser) {
      setEditUser({
        ...editUser,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const resetUserForm = () => {
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: '',
      account_expiry_date: '',
      account_non_expired: true,
      account_non_locked: true,
      credentials_expiry_date: '',
      credentials_non_expired: true,
      is_two_factor_enabled: false,
      sign_up_method: '',
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Usuarios</h2>

      {/* Formulario para crear o editar usuario */}
      <form onSubmit={(e) => { e.preventDefault(); editUser ? handleUpdateUser() : handleCreateUser(); }} className="mb-4">
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Nombre de usuario"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Correo electrónico"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Contraseña"
          />
        </div>
        
        {/* Campo para seleccionar el rol */}
        <div className="form-group">
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Seleccione un Rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>

        {/* Otros campos */}
        <div className="form-group">
          <input
            type="date"
            name="account_expiry_date"
            value={newUser.account_expiry_date}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            name="account_non_expired"
            checked={newUser.account_non_expired}
            onChange={handleInputChange}
            className="form-check-input"
          />
          <label className="form-check-label">Cuenta no expirada</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            name="account_non_locked"
            checked={newUser.account_non_locked}
            onChange={handleInputChange}
            className="form-check-input"
          />
          <label className="form-check-label">Cuenta no bloqueada</label>
        </div>
        <div className="form-group">
          <input
            type="date"
            name="credentials_expiry_date"
            value={newUser.credentials_expiry_date}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            name="credentials_non_expired"
            checked={newUser.credentials_non_expired}
            onChange={handleInputChange}
            className="form-check-input"
          />
          <label className="form-check-label">Credenciales no expirada</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            name="is_two_factor_enabled"
            checked={newUser.is_two_factor_enabled}
            onChange={handleInputChange}
            className="form-check-input"
          />
          <label className="form-check-label">Habilitar autenticación de dos factores</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="sign_up_method"
            value={newUser.sign_up_method}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Método de registro"
          />
        </div>

        <button type="submit" className="btn btn-primary">{editUser ? 'Actualizar' : 'Crear'} Usuario</button>
      </form>

      {/* Listar usuarios */}
      <ul className="list-group">
        {users.map(user => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{user.username} - {user.email}</span>
            <div>
              <button onClick={() => handleEditUser(user)} className="btn btn-warning btn-sm mx-1">Editar</button>
              <button onClick={() => handleDeleteUser(user.id)} className="btn btn-danger btn-sm">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
