import React, { useState, useEffect } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto, getCategorias, createCategoria, getProveedores } from '../../api'; // Asegúrate de que `createCategoria` esté importado
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf'; // Importa jsPDF para exportar a PDF

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    foto: '',
    stock: '',
    activo: true,
    categoria: '',
    proveedor: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [newCategoria, setNewCategoria] = useState('');  // Estado para la nueva categoría
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchProveedores();
  }, []);

  const fetchProductos = async () => {
    try {
      const productosData = await getProductos();
      const categoriasData = await getCategorias();
      const proveedoresData = await getProveedores();
  
      const productosConNombres = productosData.map((producto) => {
        const categoria = categoriasData.find(
          (cat) => cat.id === producto.categoria_id
        );
        const proveedor = proveedoresData.find(
          (prov) => prov.id === producto.proveedor_id
        );
  
        return {
          ...producto,
          categoriaNombre: categoria ? categoria.categoria : "Sin Categoría",
          proveedorNombre: proveedor ? proveedor.nombre_empresa : "Sin Proveedor",
        };
      });
  
      console.log("Productos combinados:", productosConNombres);
      setProductos(productosConNombres);
    } catch (error) {
      setError("Error al obtener los productos.");
      console.error(error);
    }
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(productos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');

    // Generamos el archivo Excel y lo descargamos
    XLSX.writeFile(wb, 'productos.xlsx');
  };

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
  
    // Agregar título
    doc.setFontSize(20);
    doc.text("Lista de Productos", 20, 20);
  
    // Establecer la fuente para el contenido
    doc.setFontSize(12);
    let yPosition = 30;
  
    // Recorrer los productos y agregar cada uno al PDF
    productos.forEach((producto, index) => {
      doc.text(`${index + 1}.`, 20, yPosition);  // Número del producto
      yPosition += 10;
      doc.text(`Nombre: ${producto.nombre}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Precio: $${producto.precio}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Stock: ${producto.stock}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Categoría: ${producto.categoriaNombre}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Proveedor: ${producto.proveedorNombre}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Activo: ${producto.activo ? 'Sí' : 'No'}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Foto: ${producto.foto || "Sin Foto"}`, 30, yPosition); // Mostramos la URL o "Sin Foto"
      yPosition += 15;
  
      // Añadir separación entre productos
      if (yPosition > 250) { // Si se llega al final de la página, agregar nueva página
        doc.addPage();
        yPosition = 20;
      }
    });
  
    // Generamos el archivo PDF y lo descargamos
    doc.save("productos.pdf");
  };

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      console.log('Categorias:', data);  // Añadimos este console.log para ver los datos
      setCategorias(data);
    } catch (error) {
      setError('Error al obtener las categorías.');
      console.error(error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (error) {
      setError('Error al obtener los proveedores.');
      console.error(error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
  
    // Creamos un nuevo objeto con los datos y cambiamos los nombres de los campos a 'categoria_id' y 'proveedor_id'
    const productoData = {
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      foto: producto.foto,
      stock: parseInt(producto.stock, 10),
      activo: producto.activo,
      categoria_id: producto.categoria,  // Cambié 'categoria' a 'categoria_id'
      proveedor_id: producto.proveedor,  // Cambié 'proveedor' a 'proveedor_id'
    };
  
    // Log para revisar los datos antes de enviarlos al backend
    console.log("Enviando producto al backend:", productoData);
  
    try {
      const newProducto = await createProducto(productoData);
  
      // Si la creación es exitosa, actualizar el estado de productos
      setProductos([...productos, newProducto]);
  
      // Resetear el formulario después de la creación
      setProducto({
        nombre: '',
        precio: '',
        foto: '',
        stock: '',
        activo: true,
        categoria: '',
        proveedor: '',
      });
    } catch (error) {
      // Manejamos el error y lo mostramos en la consola
      console.error("Error al crear el producto:", error.response ? error.response.data : error);
  
      // Mostrar mensaje de error en la UI
      setError('Error al crear el producto.');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
  
    const productoData = {
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      foto: producto.foto,
      stock: parseInt(producto.stock, 10),
      activo: producto.activo,
      categoria_id: producto.categoria,
      proveedor_id: producto.proveedor,
    };
  
    try {
      const updatedProducto = await updateProducto(editId, productoData);
  
      const categoria = categorias.find((cat) => cat.id === updatedProducto.categoria_id);
      const proveedor = proveedores.find((prov) => prov.id === updatedProducto.proveedor_id);
  
      const productoConNombres = {
        ...updatedProducto,
        categoriaNombre: categoria ? categoria.categoria : "Sin Categoría",
        proveedorNombre: proveedor ? proveedor.nombre_empresa : "Sin Proveedor",
      };
  
      setProductos(productos.map((p) => (p.id === editId ? productoConNombres : p)));
  
      // Mostrar notificación
      setNotificationMessage('Producto actualizado con éxito');
      setShowNotification(true);
  
      // Limpiar formulario
      setProducto({
        nombre: '',
        precio: '',
        foto: '',
        stock: '',
        activo: true,
        categoria: '',
        proveedor: '',
      });
      setEditId(null);
    } catch (error) {
      setError('Error al actualizar el producto.');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProducto(id);
      setProductos(productos.filter((p) => p.id !== id));
    } catch (error) {
      setError('Error al eliminar el producto.');
      console.error(error);
    }
  };

  const handleCreateCategoria = async (e) => {
    e.preventDefault();
  
    // Validación para asegurar que el nombre de la categoría no sea vacío
    if (!newCategoria || newCategoria.trim() === '') {
      setError('El nombre de la categoría no puede estar vacío.');
      return;
    }
  
    console.log("Creando categoría con nombre:", newCategoria);  // Para depurar el valor enviado
  
    try {
      // Verifica el nombre del campo que espera el backend, podría ser `categoria` en lugar de `nombre`
      const categoriaCreada = await createCategoria({ categoria: newCategoria }); // Cambié "nombre" por "categoria" aquí
      setCategorias([...categorias, categoriaCreada]);
      setNewCategoria('');
    } catch (error) {
      setError('Error al crear la categoría.');
      console.error(error);
    }
  };

  const renderForm = () => (
    <form onSubmit={editId ? handleEdit : handleCreate} className="mb-4">
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          placeholder="Nombre"
          value={producto.nombre}
          onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Precio</label>
        <input
          type="number"
          className="form-control"
          placeholder="Precio"
          value={producto.precio}
          onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Foto</label>
        <input
          type="text"
          className="form-control"
          placeholder="Foto"
          value={producto.foto}
          onChange={(e) => setProducto({ ...producto, foto: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Stock</label>
        <input
          type="number"
          className="form-control"
          placeholder="Stock"
          value={producto.stock}
          onChange={(e) => setProducto({ ...producto, stock: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          value={producto.categoria}
          onChange={(e) => setProducto({ ...producto, categoria: e.target.value })}
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoria}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Proveedor</label>
        <select
          className="form-select"
          value={producto.proveedor}
          onChange={(e) => setProducto({ ...producto, proveedor: e.target.value })}
        >
          <option value="">Seleccione un proveedor</option>
          {proveedores.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.nombre_empresa}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={producto.activo}
          onChange={() => setProducto({ ...producto, activo: !producto.activo })}
        />
        <label className="form-check-label">Activo</label>
      </div>
      <button type="submit" className="btn btn-primary">
        {editId ? 'Actualizar Producto' : 'Crear Producto'}
      </button>
    </form>
  );

  return (
    <div className="container">
    <h1 className="my-4">Gestión de Productos</h1>

    {/* Notificación de éxito */}
    {showNotification && (
      <div className="toast show position-fixed bottom-0 end-0 p-3" role="alert" style={{ zIndex: 11 }}>
        <div className="toast-header">
          <strong className="me-auto">Notificación</strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowNotification(false)}
          ></button>
        </div>
        <div className="toast-body">{notificationMessage}</div>
      </div>
    )}

      {/* Botones de exportación */}
      <button className="btn btn-success me-2" onClick={exportToExcel}>Exportar a Excel</button>
      <button className="btn btn-danger" onClick={exportToPDF}>Exportar a PDF</button>

      {/* Formulario para crear/editar productos */}
      {renderForm()}

      {/* Lista de productos */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoria</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.stock}</td>
              <td>{producto.categoriaNombre}</td>
              <td>{producto.proveedorNombre}</td>
              <td>
                <button className="btn btn-warning" onClick={() => setEditId(producto.id)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(producto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mostrar errores */}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Productos;

