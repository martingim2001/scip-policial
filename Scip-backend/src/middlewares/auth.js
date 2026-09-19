const jwt = require('jsonwebtoken');

// Middleware para verificar si la petición trae un token válido
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        // Esperamos formato: "Bearer [token]"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ success: false, message: 'Se requiere un token de acceso.' });
        }

        const token = authHeader.split(' ')[1];

        // Verificamos el token con nuestra clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Guardamos los datos del usuario logueado en "req.user" para su uso posterior
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
    }
};

// Middleware Factory para control de acceso basado en roles (RBAC)
const requireRole = (roleRequired) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
        }

        if (req.user.jerarquia !== roleRequired) {
            return res.status(403).json({ 
                success: false, 
                message: `Acceso denegado. Se requiere jerarquía de ${roleRequired}.` 
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    requireRole
};
