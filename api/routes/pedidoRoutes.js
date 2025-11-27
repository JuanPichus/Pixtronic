import express from 'express';
import * as pedidoController from '../controllers/pedidoController.js';

const router = express.Router();

router.post('/pedidos', pedidoController.crearPedido);
router.get('/pedidos/usuario/:userId', pedidoController.obtenerPedidosPorUsuario);

export default router;