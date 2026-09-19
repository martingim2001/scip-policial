const express = require('express');
const router = express.Router();
const { consultarPersona, consultarVehiculo } = require('../controllers/consultasController');
const { verifyToken } = require('../middlewares/auth');

// Todas las consultas requieren estar autenticado
router.use(verifyToken);

// GET /api/consultas/persona/:dni
router.get('/persona/:dni', consultarPersona);

// GET /api/consultas/vehiculo/:dominio
router.get('/vehiculo/:dominio', consultarVehiculo);

module.exports = router;
