import db from '../config/db.js';

// Obtener todos los productos (con filtros opcionales)
export const obtenerTodosProductos = async (req, res) => {
  const { tipo, nombre, marca, id } = req.query;
  
  try {
    let query = 'SELECT id_producto, nombre, marca, tipo, precio, vigente, cantidad FROM producto WHERE 1=1';
    const params = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }
    if (nombre) {
      query += ' AND nombre LIKE ?';
      params.push(`%${nombre}%`);
    }
    if (marca) {
      query += ' AND marca LIKE ?';
      params.push(`%${marca}%`);
    }
    if (id) {
      query += ' AND id_producto = ?';
      params.push(id);
    }

    query += ' ORDER BY id_producto DESC';

    const [productos] = await db.query(query, params);
    
    res.json({ 
      success: true, 
      productos 
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener productos' 
    });
  }
};

// Añadir producto
export const agregarProducto = async (req, res) => {
  const { nombre, marca, tipo, precio, vigente, cantidad } = req.body;

  try {
    if (!nombre || !marca || !tipo || precio === undefined || vigente === undefined || cantidad === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son obligatorios' 
      });
    }

    const [result] = await db.query(
      'INSERT INTO producto (nombre, marca, tipo, precio, vigente, cantidad) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, marca, tipo, parseFloat(precio), parseInt(vigente), parseInt(cantidad)]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Producto agregado exitosamente',
      id_producto: result.insertId
    });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al agregar producto' 
    });
  }
};

// Modificar producto
export const modificarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, marca, tipo, precio, vigente, cantidad } = req.body;

  try {
    if (!nombre || !marca || !tipo || precio === undefined || vigente === undefined || cantidad === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son obligatorios' 
      });
    }

    const [result] = await db.query(
      'UPDATE producto SET nombre = ?, marca = ?, tipo = ?, precio = ?, vigente = ?, cantidad = ? WHERE id_producto = ?',
      [nombre, marca, tipo, parseFloat(precio), parseInt(vigente), parseInt(cantidad), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Producto no encontrado' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Producto modificado exitosamente' 
    });
  } catch (error) {
    console.error('Error al modificar producto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al modificar producto' 
    });
  }
};

// Eliminar producto (marcar como no vigente)
export const eliminarProducto = async (req, res) => {
  const { nombre } = req.body;
  const { cantidad } = req.body;

  try {
    if (!nombre) {
      return res.status(400).json({ 
        success: false, 
        message: 'El nombre del producto es obligatorio' 
      });
    }

    // Si se especifica cantidad, disminuir cantidad y marcar como no vigente si llega a 0
    if (cantidad !== undefined) {
      const cantidadEliminar = parseInt(cantidad);
      
      const [productos] = await db.query(
        'SELECT id_producto, cantidad FROM producto WHERE nombre = ?',
        [nombre]
      );

      if (productos.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Producto no encontrado' 
        });
      }

      const producto = productos[0];
      const nuevaCantidad = producto.cantidad - cantidadEliminar;

      if (nuevaCantidad <= 0) {
        // Marcar como no vigente si la cantidad llega a 0 o menos
        await db.query(
          'UPDATE producto SET cantidad = 0, vigente = 0 WHERE id_producto = ?',
          [producto.id_producto]
        );
      } else {
        // Solo disminuir cantidad
        await db.query(
          'UPDATE producto SET cantidad = ? WHERE id_producto = ?',
          [nuevaCantidad, producto.id_producto]
        );
      }
    } else {
      // Marcar como no vigente todos los productos con ese nombre
      const [result] = await db.query(
        'UPDATE producto SET vigente = 0 WHERE nombre = ?',
        [nombre]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Producto no encontrado' 
        });
      }
    }

    res.json({ 
      success: true, 
      message: 'Producto eliminado/actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar producto' 
    });
  }
};