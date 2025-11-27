import express from 'express';
import * as inventarioController from '../controllers/inventarioController.js';

const router = express.Router();

router.get('/inventario/productos', inventarioController.obtenerTodosProductos);
router.post('/inventario/productos', inventarioController.agregarProducto);
router.put('/inventario/productos/:id', inventarioController.modificarProducto);
router.delete('/inventario/productos', inventarioController.eliminarProducto);

export default router;