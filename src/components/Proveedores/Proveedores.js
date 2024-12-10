import React, { useState, useEffect } from 'react';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor, getUsers } from '../../api';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [newProveedor, setNewProveedor] = useState({
    direccion: '',
    horarios_atencion: '',
    nombre_empresa: '',
    ruc: '',
    telefono: '',
    ubicacion: '',
    usuario_id: '',
  });
  const [editProveedor, setEditProveedor] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProveedores();
    fetchUsuarios();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await getProveedores();
      console.log('Respuesta completa de la API:', response);

      if (Array.isArray(response)) {
        setProveedores(response);
      } else {
        setError('No se encontraron proveedores');
        console.error('Error: La respuesta de la API no contiene datos válidos');
      }
    } catch (error) {
      setError('Error al obtener los proveedores');
      console.error('Error al obtener los proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await getUsers();
      console.log('Respuesta completa de la API (Usuarios):', response);

      if (Array.isArray(response)) {
        const filteredUsers = response.filter(user => user.role === 1);
        console.log('Usuarios filtrados con ROLE_PRODUCTOR:', filteredUsers);
        setUsuarios(filteredUsers);
      } else {
        setError('La respuesta de la API no contiene datos válidos.');
        console.error('Respuesta de la API no válida:', response);
      }
    } catch (error) {
      setError('Error al obtener los usuarios');
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const handleCreateProveedor = async () => {
    if (!newProveedor.usuario_id) {
      alert('Por favor, seleccione un usuario para el proveedor');
      return;
    }

    console.log("Datos a enviar al backend para crear proveedor:", {
      ...newProveedor,
      usuario_id: newProveedor.usuario_id,
    });

    try {
      const response = await createProveedor({
        ...newProveedor,
        usuario_id: newProveedor.usuario_id,
      });

      console.log('Proveedor creado:', response);
      setProveedores(prevProveedores => [...prevProveedores, response.data]);

      setNewProveedor({
        direccion: '',
        horarios_atencion: '',
        nombre_empresa: '',
        ruc: '',
        telefono: '',
        ubicacion: '',
        usuario_id: '',
      });
    } catch (error) {
      setError('Error al crear el proveedor');
      console.error('Error al crear el proveedor:', error);
    }
  };

  const handleUpdateProveedor = async () => {
    console.log("Datos a enviar al backend para actualizar proveedor:", {
      ...editProveedor,
      usuario_id: editProveedor.usuario_id,
    });

    try {
      const response = await updateProveedor(editProveedor.id, {
        ...editProveedor,
        usuario_id: editProveedor.usuario_id,
      });

      console.log('Proveedor actualizado:', response);
      setProveedores(proveedores.map(p => p.id === response.data.id ? response.data : p));
      setEditProveedor(null);
      setNewProveedor({
        direccion: '',
        horarios_atencion: '',
        nombre_empresa: '',
        ruc: '',
        telefono: '',
        ubicacion: '',
        usuario_id: '',
      });
    } catch (error) {
      setError('Error al actualizar el proveedor');
      console.error('Error al actualizar el proveedor:', error);
    }
  };

  const handleDeleteProveedor = async (id) => {
    try {
      await deleteProveedor(id);
      console.log(`Proveedor con ID ${id} eliminado.`);
      setProveedores(proveedores.filter(p => p.id !== id));
    } catch (error) {
      setError('Error al eliminar el proveedor');
      console.error('Error al eliminar el proveedor:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo cambiado: ${name} = ${value}`);

    setNewProveedor({
      ...newProveedor,
      [name]: value,
    });
    if (editProveedor) {
      setEditProveedor({
        ...editProveedor,
        [name]: value,
      });
    }
  };

  const handleEditProveedor = (proveedor) => {
    setEditProveedor(proveedor);
    setNewProveedor(proveedor);
    console.log('Proveedor para editar:', proveedor);
  };

  if (loading) return <div className="alert alert-info">Cargando proveedores...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Proveedores</h2>
      <form
        onSubmit={(e) => { e.preventDefault(); editProveedor ? handleUpdateProveedor() : handleCreateProveedor(); }}
        className="mb-4"
      >
        <div className="mb-3">
          <input
            type="text"
            name="nombre_empresa"
            value={newProveedor.nombre_empresa}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Nombre de la empresa"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="direccion"
            value={newProveedor.direccion}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Dirección"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="horarios_atencion"
            value={newProveedor.horarios_atencion}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Horarios de atención"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="ruc"
            value={newProveedor.ruc}
            onChange={handleInputChange}
            className="form-control"
            placeholder="RUC"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="telefono"
            value={newProveedor.telefono}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Teléfono"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="ubicacion"
            value={newProveedor.ubicacion}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Ubicación"
          />
        </div>
        <div className="mb-3">
          <select
            name="usuario_id"
            value={newProveedor.usuario_id}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Seleccione un Usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.username}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">{editProveedor ? 'Actualizar' : 'Crear'} Proveedor</button>
      </form>

      <ul className="list-group">
        {proveedores.length > 0 ? (
          proveedores.map(proveedor => (
            proveedor && proveedor.nombre_empresa && proveedor.direccion ? (
              <li key={proveedor.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{proveedor.nombre_empresa} - {proveedor.direccion} - {proveedor.telefono}</span>
                <div>
                  <button
                    className="btn btn-warning btn-sm mx-2"
                    onClick={() => handleEditProveedor(proveedor)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProveedor(proveedor.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ) : null
          ))
        ) : (
          <li className="list-group-item">No hay proveedores disponibles.</li>
        )}
      </ul>
    </div>
  );
};

export default Proveedores;
