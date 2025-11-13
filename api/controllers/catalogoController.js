//api/controllers/catalogoController.js
import db from '../config/db.js';

//Obtener los productos

export const obtenerProductos = async (req, res) => {
  try {
    const [productos] = await db.query(
      'SELECT id_producto, nombre, marca, tipo, precio, vigente, cantidad FROM producto WHERE vigente = 1'
    );
    
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

export const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [productos] = await db.query(
      'SELECT id_producto, nombre, marca, tipo, precio, vigente, cantidad FROM producto WHERE id_producto = ? AND vigente = 1',
      [id]
    );
    
    if (productos.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Producto no encontrado' 
      });
    }
    
    res.json({ 
      success: true, 
      producto: productos[0] 
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener producto' 
    });
  }
};
