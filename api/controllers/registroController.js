import db from '../config/bd.js';
import { ServicioCriptografia } from '../servicios/servicioCriptografia.js';

const servicioCripto = new ServicioCriptografia();

export const registrarUsuario = async (req, res) => {
  const { 
    username, 
    lastname, 
    email, 
    birth_date,
    llave_publica,
    llave_privada_encriptada,
    contraseña_encriptada,
    llave_aes_encriptada
  } = req.body;

  try {
    // Verificar si el usuario ya existe
    const consultaVerificar = 'SELECT id FROM usuarios WHERE email = ?';
    db.query(consultaVerificar, [email], (err, resultados) => {
      if (err) {
        console.error('Error verificando usuario:', err);
        return res.status(500).json({ error: 'Error del servidor' });
      }

      if (resultados.length > 0) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      // Insertar nuevo usuario con datos criptográficos
      const consultaInsertar = `
        INSERT INTO usuarios 
        (username, lastname, email, birth_date, llave_publica, 
         llave_privada_encriptada, contraseña_encriptada, llave_aes_encriptada) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(consultaInsertar, [
        username, 
        lastname, 
        email, 
        birth_date,
        llave_publica,
        llave_privada_encriptada,
        contraseña_encriptada,
        llave_aes_encriptada
      ], (err, resultados) => {
        if (err) {
          console.error('Error registrando usuario:', err);
          return res.status(500).json({ error: 'Error al registrar usuario' });
        }

        res.status(201).json({ 
          mensaje: 'Usuario registrado exitosamente',
          idUsuario: resultados.insertId 
        });
      });
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const obtenerDatosCripto = (req, res) => {
  const { email } = req.params;

  const consulta = `
    SELECT llave_publica, llave_aes_encriptada 
    FROM usuarios 
    WHERE email = ?
  `;
  
  db.query(consulta, [email], (err, resultados) => {
    if (err) {
      console.error('Error obteniendo datos cripto:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (resultados.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(resultados[0]);
  });
};