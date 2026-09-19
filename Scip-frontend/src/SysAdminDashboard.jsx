import React, { useState } from 'react';

function SysAdminDashboard({ onNavigate }) {
  const [activeSection, setActiveSection] = useState('monitor'); // 'monitor' | 'accesos'

  // Mock data para Auditoría (luego se reemplaza por el fetch al backend)
  const [auditoriaData] = useState([
    { id: 1, fecha_hora: '2026-09-19 02:15:33', legajo_empleado: 41233, nombre: 'Pérez, Juan', tipo_consulta: 'Vehiculo', dato_consultado: 'AB123CD' },
    { id: 2, fecha_hora: '2026-09-19 02:10:12', legajo_empleado: 55891, nombre: 'López, María', tipo_consulta: 'Persona', dato_consultado: '22222222' },
    { id: 3, fecha_hora: '2026-09-19 01:45:00', legajo_empleado: 41233, nombre: 'Pérez, Juan', tipo_consulta: 'Persona', dato_consultado: '11111111' },
    { id: 4, fecha_hora: '2026-09-18 23:30:10', legajo_empleado: 62104, nombre: 'Díaz, Carlos', tipo_consulta: 'Vehiculo', dato_consultado: 'ZZ999YY' }
  ]);

  const [resetLegajo, setResetLegajo] = useState('');
  const [resetResult, setResetResult] = useState(null);

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Simulamos la llamada al backend (PUT /api/sysadmin/reset-password/:legajo)
    const tempPassword = Math.random().toString(36).substring(2, 10).toUpperCase();
    setResetResult({
      legajo: resetLegajo,
      tempPassword: tempPassword
    });
    setResetLegajo('');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      
      {/* SIDEBAR */}
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: '280px', backgroundColor: '#0b1c31' }}>
        <a href="#" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <i className="bi bi-hdd-network-fill fs-3 me-2"></i>
          <span className="fs-5 fw-bold">SysAdmin Panel</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          <li className="nav-item">
            <button 
              className={`nav-link text-start w-100 fw-medium ${activeSection === 'monitor' ? 'active bg-primary' : 'text-white'}`}
              onClick={() => setActiveSection('monitor')}
            >
              <i className="bi bi-activity me-2"></i> Monitor de Consultas
            </button>
          </li>
          <li>
            <button 
              className={`nav-link text-start w-100 fw-medium ${activeSection === 'accesos' ? 'active bg-primary' : 'text-white'}`}
              onClick={() => setActiveSection('accesos')}
            >
              <i className="bi bi-key-fill me-2"></i> Gestión de Accesos
            </button>
          </li>
        </ul>
        <hr />
        <div className="dropdown">
          <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="bi bi-person-circle fs-4 me-2"></i>
            <strong>Soporte Técnico</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
            <li><button className="dropdown-item" onClick={() => onNavigate('login')}>Cerrar sesión</button></li>
          </ul>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-grow-1 p-4 p-md-5 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark m-0">S.C.I.P. IT Soporte</h2>
          <span className="badge bg-danger rounded-pill px-3 py-2 fw-medium"><i className="bi bi-shield-check me-1"></i> Acceso Restringido</span>
        </div>

        {/* SECCIÓN 1: MONITOR DE CONSULTAS */}
        {activeSection === 'monitor' && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-bottom p-4">
              <h5 className="fw-bold mb-0"><i className="bi bi-eye-fill text-primary me-2"></i> Auditoría en Tiempo Real</h5>
              <p className="text-muted small mb-0 mt-1">Historial inmutable de búsquedas realizadas por el personal policial.</p>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3">Fecha y Hora</th>
                      <th className="py-3">Efectivo Policial</th>
                      <th className="py-3">Tipo de Consulta</th>
                      <th className="px-4 py-3">Dato Buscado (DNI/Patente)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditoriaData.map(log => (
                      <tr key={log.id}>
                        <td className="px-4 text-muted small fw-medium">{log.fecha_hora}</td>
                        <td>
                          <div className="fw-bold text-dark">{log.nombre}</div>
                          <div className="small text-muted">Legajo: #{log.legajo_empleado}</div>
                        </td>
                        <td>
                          {log.tipo_consulta === 'Persona' 
                            ? <span className="badge bg-info text-dark"><i className="bi bi-person-fill"></i> Persona</span>
                            : <span className="badge bg-secondary"><i className="bi bi-car-front-fill"></i> Vehículo</span>
                          }
                        </td>
                        <td className="px-4 fw-bold font-monospace">{log.dato_consultado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: GESTIÓN DE ACCESOS */}
        {activeSection === 'accesos' && (
          <div className="row">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-bottom p-4">
                  <h5 className="fw-bold mb-0"><i className="bi bi-shield-lock-fill text-warning me-2"></i> Restablecer Contraseña</h5>
                  <p className="text-muted small mb-0 mt-1">Genera una clave temporal para oficiales que hayan perdido el acceso.</p>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleResetPassword}>
                    <div className="mb-4">
                      <label className="form-label fw-bold text-secondary">Número de Legajo del Efectivo</label>
                      <input 
                        type="number" 
                        className="form-control form-control-lg" 
                        placeholder="Ej. 12345" 
                        value={resetLegajo}
                        onChange={(e) => setResetLegajo(e.target.value)}
                        required 
                      />
                    </div>
                    <button type="submit" className="btn btn-warning fw-bold w-100 py-2">
                      <i className="bi bi-arrow-clockwise me-2"></i> Restablecer Acceso
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL RESULTADO DE RESETEO */}
        {resetResult && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 bg-light rounded-top-4 p-4 pb-0">
                  <h5 className="modal-title fw-bold text-success"><i className="bi bi-check-circle-fill me-2"></i> Acceso Restablecido</h5>
                  <button type="button" className="btn-close" onClick={() => setResetResult(null)}></button>
                </div>
                <div className="modal-body p-4 text-center">
                  <p className="text-muted mb-2">Se ha generado una nueva contraseña temporal para el legajo <strong>#{resetResult.legajo}</strong>.</p>
                  <p className="small text-danger fw-bold mb-4">Entregue esta clave al oficial de forma segura.</p>
                  
                  <div className="bg-dark text-white rounded-3 p-3 mb-2">
                    <span className="fs-3 fw-bold font-monospace" style={{ letterSpacing: '2px' }}>{resetResult.tempPassword}</span>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0 justify-content-center">
                  <button type="button" className="btn btn-primary px-5 fw-bold" onClick={() => setResetResult(null)}>Entendido</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SysAdminDashboard;
