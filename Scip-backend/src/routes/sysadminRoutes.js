const express = require('express');
const router = express.Router();
const { getAuditoria, resetPassword } = require('../controllers/sysadminController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Protegido por JWT y solo accesible para el rol "SYSADMIN"
router.use(verifyToken);
router.use(requireRole('SYSADMIN'));

// GET /api/sysadmin/auditoria
router.get('/auditoria', getAuditoria);

// PUT /api/sysadmin/reset-password/:legajo
router.put('/reset-password/:legajo', resetPassword);

module.exports = router;
