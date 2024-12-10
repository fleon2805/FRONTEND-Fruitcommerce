import React, { useState, useEffect } from 'react';
import { getMetodosPago, createMetodoPago, updateMetodoPago, deleteMetodoPago } from '../../api';

const MetodosPago = () => {
  const [metodos, setMetodos] = useState([]);
  const [metodo, setMetodo] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMetodos();
  }, []);

  // Fetch methods from API
  const fetchMetodos = async () => {
    try {
      const data = await getMetodosPago();
      setMetodos(data);
    } catch (error) {
      console.error('Error fetching métodos de pago:', error);
    }
  };

  // Handle create method
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!metodo) return;

    try {
      const newMetodo = await createMetodoPago(metodo);
      setMetodos([...metodos, newMetodo]);
      setMetodo('');
    } catch (error) {
      console.error('Error creating metodo de pago:', error);
    }
  };

  // Handle edit method
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!metodo) return;

    try {
      const updatedMetodo = await updateMetodoPago(editId, metodo);
      setMetodos(metodos.map(m => (m.id === editId ? updatedMetodo : m)));
      setMetodo('');
      setEditId(null);
    } catch (error) {
      console.error('Error updating metodo de pago:', error);
    }
  };

  // Handle delete method
  const handleDelete = async (id) => {
    try {
      await deleteMetodoPago(id);
      setMetodos(metodos.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting metodo de pago:', error);
    }
  };

  // Formulario para agregar o editar un método de pago
  const renderForm = () => (
    <form onSubmit={editId ? handleEdit : handleCreate} className="mb-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          placeholder="Método de pago"
        />
        <button type="submit" className="btn btn-primary">
          {editId ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Métodos de Pago</h1>
      
      {renderForm()}
      
      <ul className="list-group">
        {metodos.map((metodoPago) => (
          <li key={metodoPago.id} className="list-group-item d-flex justify-content-between align-items-center">
            {metodoPago.metodo}
            <div>
              <button
                className="btn btn-warning btn-sm mx-2"
                onClick={() => {
                  setEditId(metodoPago.id);
                  setMetodo(metodoPago.metodo);
                }}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(metodoPago.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MetodosPago;
