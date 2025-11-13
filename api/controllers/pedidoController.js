import db from '../config/db.js';

export const crearPedido = async (req, res) => {
  const { fk_user, productos } = req.body;

  try {
    // Crear pedido
    const [pedidoResult] = await db.query(
      'INSERT INTO pedido (fk_user) VALUES (?)',
      [fk_user]
    );

    const pedidoId = pedidoResult.insertId;

    // Insertar productos del pedido
    for (const producto of productos) {
      await db.query(
        'INSERT INTO productopedido (fk_pedido, fk_producto, cantidad) VALUES (?, ?, ?)',
        [pedidoId, producto.id_producto, producto.cantidad]
      );
    }

    res.status(201).json({ 
      success: true, 
      message: 'Pedido creado exitosamente',
      pedidoId 
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear pedido' 
    });
  }
};

export const obtenerPedidosPorUsuario = async (req, res) => {
  const { userId } = req.params;

  try {
    const [pedidos] = await db.query(
      `SELECT p.id_pedido, p.fk_user, pp.fk_producto, pp.cantidad, 
              prod.nombre, prod.precio
       FROM pedido p
       JOIN productopedido pp ON p.id_pedido = pp.fk_pedido
       JOIN producto prod ON pp.fk_producto = prod.id_producto
       WHERE p.fk_user = ?`,
      [userId]
    );

    res.json({ 
      success: true, 
      pedidos 
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener pedidos' 
    });
  }
};