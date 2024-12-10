// src/components/Roles.js
import React, { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '../../api';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [editRole, setEditRole] = useState(null);

  // Obtener roles al cargar el componente
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al obtener los roles', error.response?.data || error.message);
    }
  };

  const handleCreateRole = async () => {
    try {
      const newRoleData = await createRole(newRole);
      setRoles([...roles, newRoleData]);
      setNewRole('');
    } catch (error) {
      console.error('Error al crear el rol', error.response?.data || error.message);
    }
  };

  const handleEditRole = (role) => {
    setEditRole(role);
    setNewRole(role.role_name);
  };

  const handleUpdateRole = async () => {
    try {
      const updatedRole = await updateRole(editRole.id, newRole);
      setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
      setEditRole(null);
      setNewRole('');
    } catch (error) {
      console.error('Error al actualizar el rol', error.response?.data || error.message);
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await deleteRole(id);
      setRoles(roles.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error al eliminar el rol', error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Roles</h2>

      {/* Formulario para crear o editar rol */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editRole ? handleUpdateRole() : handleCreateRole();
        }}
        className="mb-4"
      >
        <div className="form-group">
          <label htmlFor="roleSelect" className="form-label">
            Selecciona un Rol
          </label>
          <select
            id="roleSelect"
            className="form-control"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          >
            <option value="">Seleccione un Rol</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_CLIENTE">Cliente</option>
            <option value="ROLE_PRODUCTOR">Productor</option>
            <option value="ROLE_USER">User</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editRole ? 'Actualizar' : 'Crear'} Rol
        </button>
      </form>

      {/* Listar roles */}
      <div className="list-group">
        {roles.map((role) => (
          <div key={role.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{role.role_name}</span>
            <div>
              <button
                onClick={() => handleEditRole(role)}
                className="btn btn-warning btn-sm mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteRole(role.id)}
                className="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roles;
