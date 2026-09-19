/**
 * Configuración dinámica de la URL de la API (Backend S.C.I.P.)
 * Permite cambiar automáticamente el entorno dependiendo de dónde estemos ejecutando la app.
 */

// Detectamos si estamos en un entorno local de desarrollo
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// 1. URL de Desarrollo (Tu backend local)
const DEV_API_URL = "http://localhost:3000/api";

// 2. URL de Producción (Reemplaza esto por la URL real de tu backend cuando lo subas a Render, Heroku o VPS)
const PROD_API_URL = "https://scip-backend.tu-dominio.com/api";

// Exportamos la constante que debes usar en todos tus fetch()
export const API_URL = isLocalhost ? DEV_API_URL : PROD_API_URL;

export default API_URL;
