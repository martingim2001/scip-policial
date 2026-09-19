const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Obtener el historial de auditoría de consultas
const getAuditoria = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.fecha_hora,
                a.legajo_empleado,
                e.nombre,
                e.apellido,
                e.dependencia,
                a.tipo_consulta,
                a.dato_consultado
            FROM auditoria_consultas a
            JOIN empleados_policiales e ON a.legajo_empleado = e.legajo
            ORDER BY a.fecha_hora DESC
            LIMIT 500
        `;
        const [rows] = await db.execute(query);

        return res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error en getAuditoria:', error);
        return res.status(500).json({ success: false, message: 'Error interno obteniendo auditoría.' });
    }
};

// Resetear contraseña de un efectivo
const resetPassword = async (req, res) => {
    try {
        const { legajo } = req.params;

        if (!legajo) {
            return res.status(400).json({ success: false, message: 'Legajo es requerido.' });
        }

        // Verificar existencia
        const [empleados] = await db.execute('SELECT legajo, nombre, apellido FROM empleados_policiales WHERE legajo = ?', [legajo]);
        if (empleados.length === 0) {
            return res.status(404).json({ success: false, message: 'Empleado no encontrado.' });
        }

        // Generar clave temporal de 8 caracteres alfanuméricos
        const tempPassword = crypto.randomBytes(4).toString('hex');
        
        // Hashear
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(tempPassword, salt);

        // Actualizar en BD
        await db.execute('UPDATE empleados_policiales SET password_hash = ? WHERE legajo = ?', [hash, legajo]);

        return res.json({ 
            success: true, 
            message: 'Contraseña reseteada exitosamente.',
            data: {
                legajo,
                empleado: `${empleados[0].apellido}, ${empleados[0].nombre}`,
                tempPassword // Se devuelve al SysAdmin para que se la entregue al oficial
            }
        });

    } catch (error) {
        console.error('Error en resetPassword:', error);
        return res.status(500).json({ success: false, message: 'Error interno reseteando contraseña.' });
    }
};

module.exports = {
    getAuditoria,
    resetPassword
};
