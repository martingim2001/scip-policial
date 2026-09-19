const db = require('../config/db');

// Consulta de Personas
const consultarPersona = async (req, res) => {
    const { dni } = req.params;
    const legajoEmpleado = req.user.legajo; // Obtenido del token JWT

    if (!dni) {
        return res.status(400).json({ success: false, message: 'DNI es requerido.' });
    }

    // Iniciamos una conexión para manejar la Transacción (Búsqueda + Auditoría)
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Registrar en Auditoría (antes o junto con la consulta)
        await connection.execute(
            'INSERT INTO auditoria_consultas (legajo_empleado, tipo_consulta, dato_consultado) VALUES (?, ?, ?)',
            [legajoEmpleado, 'Persona', dni]
        );

        // 2. Realizar la Búsqueda
        const [rows] = await connection.execute('SELECT * FROM personas_antecedentes WHERE dni = ?', [dni]);
        const persona = rows[0];

        await connection.commit(); // Confirmamos la transacción

        if (!persona) {
            return res.json({ success: true, message: 'No se encontraron registros para el DNI provisto.', data: null });
        }

        return res.json({ success: true, data: persona });

    } catch (error) {
        await connection.rollback(); // Si algo falla, deshacemos los cambios
        console.error('Error en consultarPersona:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    } finally {
        connection.release(); // Siempre liberamos la conexión al pool
    }
};

// Consulta de Vehículos
const consultarVehiculo = async (req, res) => {
    const { dominio } = req.params;
    const legajoEmpleado = req.user.legajo;

    if (!dominio) {
        return res.status(400).json({ success: false, message: 'Dominio/Patente es requerido.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Auditoría
        await connection.execute(
            'INSERT INTO auditoria_consultas (legajo_empleado, tipo_consulta, dato_consultado) VALUES (?, ?, ?)',
            [legajoEmpleado, 'Vehiculo', dominio]
        );

        // 2. Búsqueda
        const [rows] = await connection.execute('SELECT * FROM vehiculos_captura WHERE dominio = ?', [dominio]);
        const vehiculo = rows[0];

        await connection.commit();

        if (!vehiculo) {
            return res.json({ success: true, message: 'No se encontraron registros para el dominio provisto.', data: null });
        }

        return res.json({ success: true, data: vehiculo });

    } catch (error) {
        await connection.rollback();
        console.error('Error en consultarVehiculo:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    } finally {
        connection.release();
    }
};

module.exports = {
    consultarPersona,
    consultarVehiculo
};
