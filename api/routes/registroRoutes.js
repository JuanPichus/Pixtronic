import express from 'express';
import { registrarUsuario, loginUsuario, obtenerDatosCripto, loginCriptografico } from '../controllers/registroController.js';

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/login-cripto', loginCriptografico);
router.get('/datos-cripto/:email', obtenerDatosCripto);

export default router;