import axios from 'axios';

// Configuración de Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Aquí defines la URL base para tus peticiones
});

// Interceptor para añadir el token a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Funciones para obtener, crear, actualizar y eliminar usuarios
export const getUsers = async () => {
  try {
    const response = await api.get('users/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('users/', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`users/${id}/`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`users/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para obtener, crear, actualizar y eliminar roles
export const getRoles = async () => {
  try {
    const response = await api.get('roles/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRole = async (role_name) => {
  try {
    const response = await api.post('roles/', { role_name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (id, role_name) => {
  try {
    const response = await api.put(`roles/${id}/`, { role_name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await api.delete(`roles/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// **Funciones de Proveedores**

// Función para obtener los proveedores
export const getProveedores = async () => {
  try {
    const response = await api.get('proveedores/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para crear un nuevo proveedor
export const createProveedor = async (proveedorData) => {
  try {
    const response = await api.post('proveedores/', proveedorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar un proveedor existente
export const updateProveedor = async (id, proveedorData) => {
  try {
    const response = await api.put(`proveedores/${id}/`, proveedorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para eliminar un proveedor
export const deleteProveedor = async (id) => {
  try {
    const response = await api.delete(`proveedores/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Función para obtener todos los métodos de pago
export const getMetodosPago = async () => {
  try {
    const response = await api.get('metodospago/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para crear un nuevo método de pago
export const createMetodoPago = async (metodo) => {
  try {
    const response = await api.post('metodospago/', { metodo });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para editar un método de pago existente
export const updateMetodoPago = async (id, metodo) => {
  try {
    const response = await api.put(`metodospago/${id}/`, { metodo });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para eliminar un método de pago
export const deleteMetodoPago = async (id) => {
  try {
    const response = await api.delete(`metodospago/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await api.get('productos/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo producto
export const createProducto = async (producto) => {
  try {
    const response = await api.post('productos/', producto);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar un producto existente
export const updateProducto = async (id, producto) => {
  try {
    const response = await api.put(`productos/${id}/`, producto);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar un producto
export const deleteProducto = async (id) => {
  try {
    const response = await api.delete(`productos/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategorias = async () => {
  try {
    const response = await api.get('categorias/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCategoria = async (categoria) => {
  try {
    const response = await api.post('categorias/', categoria);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVentas = async () => {
  try {
    const response = await api.get('ventas/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompradores = async () => {
  try {
    const response = await api.get('compradores/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDetalleVenta = async (ventaId) => {
  try {
    const response = await api.get(`detalleventas/?venta=${ventaId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFacturas = async () => {
  try {
    const response = await api.get('facturas/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
