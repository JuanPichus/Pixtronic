import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registroRoutes from './routes/registroRoutes.js';
import catalogoRoutes from './routes/catalogoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', registroRoutes);
app.use('/api', catalogoRoutes);
app.use('/api', pedidoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
