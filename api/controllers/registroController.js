import db from '../config/db.js';

export const registrarUsuario = async (req, res) => {
  console.log('RUTA /register ACCEDIDA CORRECTAMENTE');
  
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

  console.log('Campos recibidos:', {
    username,
    email, 
    birth_date,
    tieneLlavePublica: !!llave_publica,
    tieneContraseñaEncriptada: !!contraseña_encriptada
  });

  try {
    const consultaVerificar = 'SELECT id_user FROM usuario WHERE email = ?';
    console.log('Ejecutando consulta de verificacion...');
    
    db.query(consultaVerificar, [email], (err, resultados) => {
      if (err) {
        console.error('Error verificando usuario:', err);
        return res.status(500).json({ error: 'Error del servidor' });
      }

      console.log('Resultados de verificacion:', resultados);

      if (resultados.length > 0) {
        console.log('Usuario ya existe');
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      const consultaInsertar = `
        INSERT INTO usuario 
        (username, lastname, email, birth_date, llave_publica, 
         llave_privada_encriptada, password_encriptada, llave_aes_encriptada) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      console.log('Ejecutando INSERT...');
      
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
          console.error('Detalles del error:', err.message);
          console.error('Codigo del error:', err.code);
          return res.status(500).json({ error: 'Error al registrar usuario: ' + err.message });
        }

        console.log('Usuario registrado exitosamente. ID:', resultados.insertId);
        
        res.status(201).json({ 
          mensaje: 'Usuario registrado exitosamente',
          idUsuario: resultados.insertId 
        });
      });
    });

  } catch (error) {
    console.error('Error general en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const obtenerDatosCripto = (req, res) => {
  console.log('RUTA /datos-cripto ACCEDIDA - EMAIL:', req.params.email);
  
  const { email } = req.params;
  
  if (!email) {
    console.log('Email no proporcionado');
    return res.status(400).json({ error: 'Email requerido' });
  }

  console.log('Buscando usuario con email:', email);

  const consulta = `
    SELECT llave_publica, llave_privada_encriptada, llave_aes_encriptada 
    FROM usuario 
    WHERE email = ?
  `;
  
  db.query(consulta, [email], (err, resultados) => {
    if (err) {
      console.error('Error en consulta SQL:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    console.log('Resultados de la consulta:', resultados);
    
    if (resultados.length === 0) {
      console.log('Usuario no encontrado en la BD');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('Datos criptograficos encontrados');
    res.json(resultados[0]);
  });
};

export const loginCriptografico = (req, res) => {
  console.log('RUTA /login-cripto ACCEDIDA');
  console.log('Body recibido:', JSON.stringify(req.body, null, 2));
  
  const { email, contraseña_encriptada, llave_aes_encriptada } = req.body;

  console.log('Campos recibidos en login criptografico:');
  console.log('- email:', email);
  console.log('- contraseña_encriptada length:', contraseña_encriptada?.length);
  console.log('- llave_aes_encriptada length:', llave_aes_encriptada?.length);

  if (!email || !contraseña_encriptada || !llave_aes_encriptada) {
    console.log('Faltan campos requeridos');
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const consulta = `
    SELECT id_user, username, email, password_encriptada, llave_aes_encriptada 
    FROM usuario 
    WHERE email = ?
  `;
  
  db.query(consulta, [email], (err, resultados) => {
    if (err) {
      console.error('Error en login criptografico:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    console.log('Resultados de la consulta:', resultados);

    if (resultados.length === 0) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = resultados[0];
    
    if (usuario.llave_aes_encriptada !== llave_aes_encriptada) {
      console.log('Llave AES no coincide - posible manipulacion');
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    if (usuario.password_encriptada !== contraseña_encriptada) {
      console.log('Contraseña encriptada no coincide');
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    console.log('Login criptografico exitoso para usuario:', usuario.email);
    
    res.json({ 
      mensaje: 'Login exitoso',
      user: {
        id: usuario.id_user,
        username: usuario.username,
        email: usuario.email
      }
    });
  });
};

export const loginUsuario = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const query = 'SELECT id_user, username, email FROM usuario WHERE email = ? AND password = ?';
  
  db.query(query, [email, password], (err, resultados) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (resultados.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = resultados[0];
    res.json({ 
      mensaje: 'Login exitoso',
      user: {
        id: user.id_user,
        username: user.username,
        email: user.email
      }
    });
  });
};