require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const consultasRoutes = require('./routes/consultasRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sysadminRoutes = require('./routes/sysadminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite parsear JSON en req.body

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sysadmin', sysadminRoutes);

// Ruta de healthcheck
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor S.C.I.P. Backend en línea.' });
});

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada.' });
});

// Manejo global de errores (500)
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ success: false, message: 'Ocurrió un error inesperado en el servidor.' });
});

// Inicializar el servidor
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚔 Servidor S.C.I.P. Backend iniciado`);
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`=========================================`);
});
