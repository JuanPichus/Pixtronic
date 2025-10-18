import db from '../config/db.js';

// Registrar usuario
export const registrarUsuario = (req, res) => {
  const { username, lastname, email, password, birth_date } = req.body;

  // Validar campos requeridos
  if (!username || !lastname || !email || !password || !birth_date) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Verificar si el email ya existe
  const checkEmailQuery = 'SELECT * FROM usuario WHERE email = ?';
  
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error al verificar email:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Insertar nuevo usuario
    const insertQuery = `
      INSERT INTO usuario (username, lastname, email, password, birth_date) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [username, lastname, email, password, birth_date], (err, results) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }

      res.status(201).json({ 
        message: 'Usuario registrado exitosamente',
        userId: results.insertId 
      });
    });
  });
};

// Login de usuario
export const loginUsuario = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const query = 'SELECT id, username, email FROM usuario WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = results[0];
    res.json({ 
      message: 'Login exitoso',
      user: user
    });
  });
};