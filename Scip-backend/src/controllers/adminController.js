const bcrypt = require('bcrypt');
const db = require('../config/db');

// Registro de nuevos efectivos (Protegido solo para Jefes)
const registrarEmpleado = async (req, res) => {
    try {
        const { legajo, nombre, apellido, dependencia, jerarquia, password } = req.body;

        // Validaciones básicas
        if (!legajo || !nombre || !apellido || !dependencia || !jerarquia || !password) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
        }

        const jerarquiasValidas = ['Jefe', 'Oficial', 'Suboficial'];
        if (!jerarquiasValidas.includes(jerarquia)) {
            return res.status(400).json({ success: false, message: 'Jerarquía no válida.' });
        }

        // Verificar si el legajo ya existe
        const [exist] = await db.execute('SELECT legajo FROM empleados_policiales WHERE legajo = ?', [legajo]);
        if (exist.length > 0) {
            return res.status(409).json({ success: false, message: 'El legajo ya se encuentra registrado.' });
        }

        // Encriptar la contraseña (hash)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar en la base de datos
        await db.execute(
            'INSERT INTO empleados_policiales (legajo, nombre, apellido, dependencia, jerarquia, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
            [legajo, nombre, apellido, dependencia, jerarquia, passwordHash]
        );

        return res.status(201).json({ 
            success: true, 
            message: 'Efectivo registrado exitosamente.' 
        });

    } catch (error) {
        console.error('Error en registrarEmpleado:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

module.exports = {
    registrarEmpleado
};
