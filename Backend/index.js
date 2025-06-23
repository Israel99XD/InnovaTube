const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/configs/db');
const authRoutes = require('./src/routes/authRoutes');
const favoritosRoutes = require ('./src/routes/favoritosRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const cors = require('cors');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Conectar DB
connectDB();

// Middleware
app.use(express.json());

// Cors
app.use(cors({
  origin: 'http://localhost:4200' // o '*' para permitir todo (no recomendable en producción)
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/favoritos', favoritosRoutes);

// Arranque
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
