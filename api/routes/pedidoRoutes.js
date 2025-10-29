import express from 'express';
import { crearPedidoConItems } from '../controllers/pedidoController.js';

const router = express.Router();

router.post('/', crearPedidoConItems);

export default router;