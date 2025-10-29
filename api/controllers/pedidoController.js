import db from '../config/db.js';

export const crearPedidoConItems = async (req, res) => {
  const { fk_user, productos } = req.body;

  //verificar que el usuario y los productos existan y sean validos
  if (!fk_user || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ ok: false, message: 'Payload inválido' });
  }

  // usa el wrapper de promesas si esta disponible para usar await, sino usa la conexion directa
  const wrapper = (typeof db?.promise === 'function') ? db.promise() : db;

  let conn;
  let mustRelease = false; // solo true si tomamos una conexión del pool
  try {
    if (typeof wrapper?.getConnection === 'function') {
      conn = await wrapper.getConnection();
      mustRelease = true; 
    } else {
      conn = wrapper;
    }

    //inicia la transacción para asegurar que todas las operaciones se realicen juntas (si algo falla, se revierte todo)
    await conn.beginTransaction();

    // Insertar el pedido
    const [pedidoResult] = await conn.query(
      'INSERT INTO pedido (fk_user) VALUES (?)',
      [fk_user]
    );
    const id_pedido = pedidoResult.insertId;

    // prepara y valida que los productos sean válidos
    const rows = productos.map(p => [
      Number(p.cant_prod ?? 1),
      Number(p.id_producto),
      id_pedido
    ]);

    const invalid = rows.filter(([cant, fk_producto]) => !Number.isInteger(fk_producto) || fk_producto <= 0 || !Number.isInteger(cant) || cant <= 0);
    if (invalid.length) {
      throw new Error(`Productos con id/cantidad inválida: ${JSON.stringify(invalid)}`);
    }

    //insercion de productos en el pedido antes creado
    if (rows.length) {
      const placeholders = rows.map(() => '(?, ?, ?)').join(',');
      const flat = rows.flat();
      await conn.query(
        `INSERT INTO productopedido (cant_prod, fk_producto, fk_pedido) VALUES ${placeholders}`,
        flat
      );
    }

    // si todo sale bien, confirma la transaccion
    await conn.commit();
    return res.json({ ok: true, id_pedido });
  } catch (err) {
    try { if (conn) await conn.rollback(); } catch {}
    const details = {
      message: err?.message, code: err?.code,
      sqlMessage: err?.sqlMessage, sqlState: err?.sqlState, sql: err?.sql
    };
    console.error('Error al guardar pedido:', details);
    const body = { ok: false, message: 'Error al guardar pedido' };
    if (process.env.NODE_ENV !== 'production') body.error = details;
    return res.status(500).json(body);
  } finally {
    // Solo liberar si la conexión viene de pool.getConnection() para que pueda volver a ser utilizada.
    if (mustRelease && conn && typeof conn.release === 'function') {
      conn.release();
    }
  }
};