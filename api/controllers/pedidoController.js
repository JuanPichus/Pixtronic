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

    // Insertar productos del pedido y disminuir stock
    for (const producto of productos) {
      // Acepta tanto 'cantidad' como 'cant_prod' del frontend
      const cant_prod = producto.cantidad ?? producto.cant_prod ?? 1;
      
      await db.query(
        'INSERT INTO productopedido (fk_pedido, fk_producto, cant_prod) VALUES (?, ?, ?)',
        [pedidoId, producto.id_producto, cant_prod]
      );
      
      // Disminuir stock del producto (columna 'cantidad' en tabla producto)
      await db.query(
        'UPDATE producto SET cantidad = cantidad - ? WHERE id_producto = ?',
        [cant_prod, producto.id_producto]
      );
    }

    res.status(201).json({ 
      ok: true,
      success: true, 
      message: 'Pedido creado exitosamente',
      id_pedido: pedidoId,
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