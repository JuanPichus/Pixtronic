import db from '../config/db.js';

export const crearPedidoConItems = async (req, res) => {
  const { fk_user, productos } = req.body;

  // Validación básica
  if (!fk_user || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ ok: false, message: 'Payload inválido' });
  }

  // Wrapper de promesas si existe
  const wrapper = (typeof db?.promise === 'function') ? db.promise() : db;

  let conn;
  let mustRelease = false;
  try {
    // Toma conexión del pool si existe; si no, usa la conexión directa
    if (typeof wrapper?.getConnection === 'function') {
      conn = await wrapper.getConnection();
      mustRelease = true;
    } else {
      conn = wrapper;
    }

    await conn.beginTransaction();

    // 1) Insertar pedido
    const [pedidoResult] = await conn.query(
      'INSERT INTO pedido (fk_user) VALUES (?)',
      [fk_user]
    );
    const id_pedido = pedidoResult.insertId;

    // 2) Preparar items (validar ids y cantidades)
    const items = productos.map(p => ({
      cant_prod: Number(p?.cant_prod ?? 1),
      id_producto: Number(p?.id_producto),
    }));

    const invalid = items.filter(x =>
      !Number.isInteger(x.id_producto) || x.id_producto <= 0 ||
      !Number.isInteger(x.cant_prod) || x.cant_prod <= 0
    );
    if (invalid.length) {
      throw new Error(`Productos con id/cantidad inválida: ${JSON.stringify(invalid)}`);
    }

    // 3) Insertar líneas en productopedido (bulk)
    const rows = items.map(x => [x.cant_prod, x.id_producto, id_pedido]);
    const placeholders = rows.map(() => '(?, ?, ?)').join(',');
    const flat = rows.flat();

    await conn.query(
      `INSERT INTO productopedido (cant_prod, fk_producto, fk_pedido) VALUES ${placeholders}`,
      flat
    );

    // 4) Disminuir inventario por producto (agregar cantidades por id)
    const porProducto = new Map();
    for (const it of items) {
      porProducto.set(it.id_producto, (porProducto.get(it.id_producto) ?? 0) + it.cant_prod);
    }

    // Importante: dentro de la misma transacción
    for (const [id_producto, cantTotal] of porProducto.entries()) {
      // Si NO quieres permitir negativos, usa WHERE cantidad >= ? y valida affectedRows
      // const [resUpd] = await conn.query(
      //   'UPDATE producto SET cantidad = cantidad - ? WHERE id_producto = ? AND cantidad >= ?',
      //   [cantTotal, id_producto, cantTotal]
      // );
      // if (resUpd.affectedRows === 0) {
      //   throw new Error(`Stock insuficiente para producto ${id_producto}`);
      // }

      // Permitir no-negativos (clip a cero)
      await conn.query(
        'UPDATE producto SET cantidad = GREATEST(COALESCE(cantidad,0) - ?, 0) WHERE id_producto = ?',
        [cantTotal, id_producto]
      );
    }

    // 5) Commit si todo salió bien
    await conn.commit();
    return res.json({ ok: true, id_pedido });
  } catch (err) {
    try { if (conn) await conn.rollback(); } catch {}
    const details = {
      message: err?.message,
      code: err?.code,
      sqlMessage: err?.sqlMessage,
      sqlState: err?.sqlState,
      sql: err?.sql
    };
    console.error('Error al guardar pedido:', details);
    const body = { ok: false, message: 'Error al guardar pedido' };
    if (process.env.NODE_ENV !== 'production') body.error = details;
    return res.status(500).json(body);
  } finally {
    if (mustRelease && conn && typeof conn.release === 'function') {
      conn.release();
    }
  }
};