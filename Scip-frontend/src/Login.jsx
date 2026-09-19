import React, { useState } from 'react';

function Login({ onLogin }) {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulamos un inicio de sesión
    if (legajo.toLowerCase() === 'admin') {
      onLogin('admin'); // Jefes
    } else if (legajo.toLowerCase() === 'sysadmin') {
      onLogin('sysadmin'); // Soporte IT
    } else {
      onLogin('search'); // Oficiales comunes
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="text-center mb-4">
          <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-light mb-3" style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-shield-shaded" style={{ fontSize: '2.5rem', color: 'var(--police-navy)' }}></i>
          </div>
          <h3 className="fw-bold" style={{ color: 'var(--police-navy)', letterSpacing: '1px' }}>S.C.I.P.</h3>
          <p className="text-secondary small fw-medium">Sistema de Consulta de Identidad Policial<br/>Policía de Tucumán</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>NÚMERO DE LEGAJO / DNI</label>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-person-vcard"></i></span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-0 bg-light" 
                placeholder="Ej. 12345" 
                value={legajo}
                onChange={(e) => setLegajo(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold text-secondary" style={{ fontSize: '0.85rem' }}>CONTRASEÑA</label>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-light border-end-0 text-secondary"><i className="bi bi-lock"></i></span>
              <input 
                type="password" 
                className="form-control border-start-0 ps-0 bg-light" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-police btn-lg w-100 mb-4 shadow-sm fw-bold">
            <i className="bi bi-box-arrow-in-right me-2"></i> Ingresar al Sistema
          </button>
          
          <div className="text-center mt-2">
            <a href="#" className="text-decoration-none text-secondary" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
              <i className="bi bi-question-circle me-1"></i> Olvidé mi contraseña o solicitar acceso a Jefatura
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
