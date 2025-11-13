import db from '../config/db.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const hashPassword = (password) => {
  return crypto.createHash('sha1').update(password).digest('hex');
};

const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const registrarUsuario = async (req, res) => {
  const { username, lastname, email, password, birth_date, direccion } = req.body;

  try {
    if (!validarEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El formato del correo electrónico no es válido' 
      });
    }

    const [existingUser] = await db.query('SELECT id_user FROM usuario WHERE email = ?', [email]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'El correo electrónico ya está registrado' 
      });
    }

    const hashedPassword = hashPassword(password);
    const direccionJSON = JSON.stringify({
      direccion_completa: direccion,
      fecha_registro: new Date().toISOString()
    });

    // Guardar AMBAS: hasheada y texto plano
    const [userResult] = await db.query(
      'INSERT INTO usuario (username, lastname, password, password_plain, email, birth_date, local_direction, admin) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
      [username, lastname, hashedPassword, password, email, birth_date, direccionJSON]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Usuario registrado exitosamente',
      userId: userResult.insertId
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar usuario' 
    });
  }
};

export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = hashPassword(password);

    const [users] = await db.query(
      'SELECT id_user, username, email, admin FROM usuario WHERE email = ? AND password = ?',
      [email, hashedPassword]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const user = users[0];

    res.json({ 
      success: true, 
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id_user,
        username: user.username,
        email: user.email,
        admin: user.admin === 1
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar sesión' 
    });
  }
};

export const recuperarPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Obtener contraseña SIN hashear
    const [users] = await db.query(
      'SELECT password_plain, username FROM usuario WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No existe un usuario con ese correo electrónico' 
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de Contraseña - Pixtronic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a2e1bff 0%, #16600fff 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; text-align: center; margin: 0;">Pixtronic</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1d2e1aff;">Hola, ${users[0].username}</h2>
            <p style="color: #666; line-height: 1.6;">Has solicitado recuperar tu contraseña.</p>
            <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #0f6052ff; font-size: 14px; font-weight: 600;">TU CONTRASEÑA:</p>
              <p style="margin: 0; color: #0f604eff; font-size: 28px; font-weight: bold; letter-spacing: 2px;">${users[0].password_plain}</p>
            </div>
            <p style="color: #ff6b6b; line-height: 1.6; background: #fff5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #ff6b6b;">
              <strong>⚠️ IMPORTANTE:</strong> Por seguridad, elimina este correo después de recuperar tu contraseña.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; text-align: center; font-size: 14px;">Si no solicitaste esto, ignora este correo.<br><br>Atentamente,<br><strong>El equipo de Pixtronic</strong></p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Correo de recuperación enviado exitosamente. Revisa tu bandeja de entrada.' 
    });

  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar el correo de recuperación' 
    });
  }
};