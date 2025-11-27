import express from 'express';
import * as pedidoController from '../controllers/pedidoController.js';

const router = express.Router();

router.post('/pedido', pedidoController.crearPedido);
router.get('/pedido/usuario/:userId', pedidoController.obtenerPedidosPorUsuario);

export default router;