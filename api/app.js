//app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import catalogoRoutes from './routes/catalogoRoutes.js';
import authRoutes from './routes/registroRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//Rutas
app.use('/api/catalogo', catalogoRoutes);
app.use('/api/registro', authRoutes);

//Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
