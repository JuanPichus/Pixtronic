import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Ruta de registro
router.post('/register', (req, res) => {
  const { username, lastname, email, password, birth_date } = req.body;

  // Validar campos requeridos
  if (!username || !lastname || !email || !password || !birth_date) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar si el email ya existe
  const checkEmailQuery = 'SELECT * FROM usuarios WHERE email = ?';
  
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error al verificar email:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Insertar nuevo usuario
    const insertQuery = `
      INSERT INTO usuarios (username, lastname, email, password, birth_date) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [username, lastname, email, password, birth_date], (err, results) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ message: 'Error al registrar usuario' });
      }

      res.status(201).json({ 
        message: 'Usuario registrado exitosamente',
        userId: results.insertId 
      });
    });
  });
});

// Ruta de login (para después)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = results[0];
    res.json({ 
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });
});

export default router;