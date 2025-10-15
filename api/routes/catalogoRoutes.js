import express from 'express';
import { obtenerProductos } from '../controllers/catalogoController.js';

const router = express.Router();

//Endpoint del catalogo
router.get('/productos', obtenerProductos);

export default router;
