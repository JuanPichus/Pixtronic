import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import catalogoRoutes from './routes/catalogoRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/catalogo', catalogoRoutes);

//Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
 