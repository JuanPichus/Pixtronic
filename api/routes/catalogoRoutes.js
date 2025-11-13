import express from 'express';
import * as catalogoController from '../controllers/catalogoController.js';

const router = express.Router();

router.get('/catalogo/productos', catalogoController.obtenerProductos);
router.get('/catalogo/productos/:id', catalogoController.obtenerProductoPorId);

export default router;
