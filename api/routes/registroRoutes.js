import express from 'express';
import * as registroController from '../controllers/registroController.js';

const router = express.Router();

router.post('/registro', registroController.registrarUsuario);
router.post('/login', registroController.loginUsuario);
router.post('/recuperar-password', registroController.recuperarPassword);

export default router;