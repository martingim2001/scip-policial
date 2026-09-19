const express = require('express');
const router = express.Router();
const { registrarEmpleado } = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// POST /api/admin/empleados
// Protegido por JWT y solo accesible para personal con jerarquía "Jefe"
router.post('/empleados', verifyToken, requireRole('Jefe'), registrarEmpleado);

module.exports = router;
