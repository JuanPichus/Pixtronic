//api/controllers/catalogoController.js
import db from '../config/db.js';

//Obtener los productos

export const obtenerProductos = (req, res) => {
  const sql = 'SELECT * FROM producto';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener productos: ', err);
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
    res.json(results);
  });
};
