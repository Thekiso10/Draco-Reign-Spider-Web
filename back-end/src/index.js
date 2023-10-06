const express = require('express');
const app = express();
const config = require('./config/config');
const apiRoutes = require('./routes/apiRoutes');

const cron = require('./jobs/cronJob'); // Importa el archivo cronJob.js
const jsonService = require('./service/jsonService');

// Configuración de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Monta las rutas API en /api
app.use(config.nameBaseApi, apiRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Inicia el servidor
app.listen(config.port, function() {
    console.log(`Servidor web escuchando en el puerto ${config.port}`);
});