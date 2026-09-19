-- S.C.I.P. Database Schema
-- Run this script in your MySQL server to set up the database and tables.

CREATE DATABASE IF NOT EXISTS scip_db;
USE scip_db;

-- 1. Tabla: empleados_policiales
-- Registra a los usuarios del sistema (Jefes, Oficiales, Suboficiales)
CREATE TABLE IF NOT EXISTS empleados_policiales (
    legajo INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dependencia VARCHAR(150) NOT NULL,
    jerarquia ENUM('Jefe', 'Oficial', 'Suboficial', 'SYSADMIN') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla: personas_antecedentes
-- Registra los datos y antecedentes de personas
CREATE TABLE IF NOT EXISTS personas_antecedentes (
    dni VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    estado ENUM('Limpio', 'Pedido de Captura') NOT NULL DEFAULT 'Limpio',
    detalles TEXT,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabla: vehiculos_captura
-- Registra los datos de vehículos y si tienen impedimentos
CREATE TABLE IF NOT EXISTS vehiculos_captura (
    dominio VARCHAR(15) PRIMARY KEY,
    chasis VARCHAR(50),
    motor VARCHAR(50),
    marca VARCHAR(100),
    modelo VARCHAR(100),
    estado ENUM('Sin impedimentos', 'Robo/Hurto') NOT NULL DEFAULT 'Sin impedimentos',
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Tabla: auditoria_consultas
-- Vital para la seguridad y control interno. Registra cada búsqueda realizada.
CREATE TABLE IF NOT EXISTS auditoria_consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    legajo_empleado INT NOT NULL,
    tipo_consulta ENUM('Persona', 'Vehiculo') NOT NULL,
    dato_consultado VARCHAR(50) NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (legajo_empleado) REFERENCES empleados_policiales(legajo) ON DELETE RESTRICT
);

-- ==========================================
-- DATOS DE PRUEBA (MOCK DATA) PARA TESTING
-- ==========================================

-- Insertar un usuario "Jefe" por defecto (Contraseña: admin123)
-- El hash bcrypt corresponde a "admin123" generado para pruebas
INSERT IGNORE INTO empleados_policiales (legajo, nombre, apellido, dependencia, jerarquia, password_hash)
VALUES (
    12345, 
    'Administrador', 
    'Sistema', 
    'Jefatura Central', 
    'Jefe', 
    '$2b$10$tZ2O8qD2zCqO.K7aK00gKefQ6wT8P/D6a/4nZ2n.o5pS8k2D2y.7a'
);

-- Insertar un usuario "SysAdmin" por defecto (Contraseña: admin123)
INSERT IGNORE INTO empleados_policiales (legajo, nombre, apellido, dependencia, jerarquia, password_hash)
VALUES (
    99999, 
    'Soporte', 
    'Técnico', 
    'Dirección de Informática', 
    'SYSADMIN', 
    '$2b$10$tZ2O8qD2zCqO.K7aK00gKefQ6wT8P/D6a/4nZ2n.o5pS8k2D2y.7a'
);

-- Insertar una persona limpia y una con pedido de captura
INSERT IGNORE INTO personas_antecedentes (dni, nombre, apellido, estado, detalles) VALUES 
('11111111', 'JUAN PABLO', 'PEREZ', 'Limpio', 'Sin antecedentes registrados.'),
('22222222', 'CARLOS ALBERTO', 'GOMEZ', 'Pedido de Captura', 'Juzgado Penal N 3. Robo Calificado.');

-- Insertar un vehiculo limpio y uno con pedido de secuestro
INSERT IGNORE INTO vehiculos_captura (dominio, chasis, motor, marca, modelo, estado) VALUES 
('AB123CD', '8A123BCDEF', 'M123456', 'TOYOTA', 'COROLLA', 'Sin impedimentos'),
('ZZ999YY', '9Z987XYZAQ', 'M999888', 'VOLKSWAGEN', 'GOL TREND', 'Robo/Hurto');
