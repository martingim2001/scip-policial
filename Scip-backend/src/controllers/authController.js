const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = async (req, res) => {
    try {
        const { legajo, password } = req.body;

        if (!legajo || !password) {
            return res.status(400).json({ success: false, message: 'Legajo y contraseña son requeridos.' });
        }

        // Buscamos al empleado
        const [rows] = await db.execute('SELECT * FROM empleados_policiales WHERE legajo = ?', [legajo]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
        }

        // Verificamos la contraseña hasheada
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
        }

        // Generamos el Payload del JWT
        const payload = {
            legajo: user.legajo,
            nombre: user.nombre,
            apellido: user.apellido,
            jerarquia: user.jerarquia,
            dependencia: user.dependencia
        };

        // Firmamos el token (expira en 8 horas para coincidir con un turno policial)
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({
            success: true,
            message: 'Autenticación exitosa',
            token,
            user: payload
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

module.exports = {
    login
};
