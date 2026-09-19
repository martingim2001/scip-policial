import React, { useState } from 'react';

function AdminDashboard({ onNavigate }) {
  const [showModal, setShowModal] = useState(false);

  const [personal, setPersonal] = useState([
    { id: 1, legajo: '30452', nombre: 'Gómez, Roberto', dependencia: 'Jefatura Central', jerarquia: 'Jefe', rol: 'Comisario General' },
    { id: 2, legajo: '41233', nombre: 'Pérez, Juan', dependencia: 'Comisaría 1ra', jerarquia: 'Oficial', rol: 'Subcomisario' },
    { id: 3, legajo: '55891', nombre: 'López, María', dependencia: 'División Investigaciones', jerarquia: 'Oficial', rol: 'Oficial Principal' },
    { id: 4, legajo: '62104', nombre: 'Díaz, Carlos', dependencia: 'Comando Radioeléctrico', jerarquia: 'Suboficial', rol: 'Cabo Primero' },
    { id: 5, legajo: '68921', nombre: 'Fernández, Luis', dependencia: 'Policía Vial', jerarquia: 'Suboficial', rol: 'Agente' },
  ]);

  const getBadgeClass = (jerarquia) => {
    switch(jerarquia) {
      case 'Jefe': return 'badge badge-jefe';
      case 'Oficial': return 'badge badge-oficial';
      case 'Suboficial': return 'badge badge-suboficial';
      default: return 'badge bg-secondary';
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar de Administración */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-police py-3 shadow-sm">
        <div className="container-fluid px-4">
          <a className="navbar-brand d-flex align-items-center" href="#" onClick={(e) => { e.preventDefault(); onNavigate('search'); }}>
            <i className="bi bi-shield-lock-fill fs-2 me-3 text-white"></i>
            <div className="d-flex flex-column">
              <span className="lh-1 mb-1 fw-bold">S.C.I.P. | Panel de Administración</span>
              <small className="text-white-50 fw-normal" style={{ fontSize: '0.75rem', letterSpacing: '0' }}>Policía de Tucumán</small>
            </div>
          </a>
          
          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="text-white-50 small d-none d-md-block"><i className="bi bi-person-fill-gear me-1"></i> Administrador de Sistema</span>
            <button className="btn btn-outline-light btn-sm px-3 rounded-pill" onClick={() => onNavigate('search')}>
              <i className="bi bi-search me-1"></i> Módulo de Consultas
            </button>
            <button className="btn btn-danger btn-sm px-3 rounded-pill" onClick={() => onNavigate('login')}>
              <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container-fluid py-5 px-md-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">Gestión de Personal Policial</h4>
            <p className="text-secondary mb-0 small">Administración de perfiles y jerarquías autorizadas en el sistema.</p>
          </div>
          <button className="btn btn-police px-4 fw-bold shadow-sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-person-plus-fill me-2"></i> Registrar Nuevo Efectivo
          </button>
        </div>

        {/* Tabla de Datos (Data Table) */}
        <div className="admin-table-wrapper bg-white">
          <div className="table-responsive">
            <table className="table table-hover table-police mb-0 align-middle">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-uppercase" style={{ fontSize: '0.8rem' }}>Legajo</th>
                  <th className="py-3 text-uppercase" style={{ fontSize: '0.8rem' }}>Apellido y Nombre</th>
                  <th className="py-3 text-uppercase" style={{ fontSize: '0.8rem' }}>Dependencia</th>
                  <th className="py-3 text-uppercase text-center" style={{ fontSize: '0.8rem' }}>Jerarquía Estructural</th>
                  <th className="py-3 text-uppercase" style={{ fontSize: '0.8rem' }}>Grado / Rol</th>
                  <th className="py-3 text-end px-4 text-uppercase" style={{ fontSize: '0.8rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {personal.map(p => (
                  <tr key={p.id}>
                    <td className="px-4 fw-bold text-secondary">#{p.legajo}</td>
                    <td className="fw-bold" style={{ color: '#2c3e50' }}>{p.nombre}</td>
                    <td className="text-secondary">{p.dependencia}</td>
                    <td className="text-center">
                      <span className={`${getBadgeClass(p.jerarquia)} px-3 py-2 rounded-pill fw-bold`} style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                        {p.jerarquia}
                      </span>
                    </td>
                    <td className="fw-medium text-secondary">{p.rol}</td>
                    <td className="text-end px-4">
                      <button className="btn btn-sm btn-light border text-primary me-2 shadow-sm rounded-circle" style={{ width: '35px', height: '35px' }} title="Editar Perfil">
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-sm btn-light border text-warning me-2 shadow-sm rounded-circle" style={{ width: '35px', height: '35px' }} title="Suspender Acceso">
                        <i className="bi bi-pause-circle"></i>
                      </button>
                      <button className="btn btn-sm btn-light border text-danger shadow-sm rounded-circle" style={{ width: '35px', height: '35px' }} title="Dar de Baja">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Registrar Nuevo Efectivo */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(11, 28, 49, 0.6)', backdropFilter: 'blur(3px)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom-0 bg-light pb-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="modal-title fw-bold" style={{ color: 'var(--police-navy)' }}>
                  <i className="bi bi-person-badge-fill me-2 text-primary"></i>
                  Registrar Nuevo Efectivo Policial
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                <form>
                  <div className="row g-4 bg-white p-4 rounded border shadow-sm mx-0">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-secondary">N° de Legajo <span className="text-danger">*</span></label>
                      <input type="number" className="form-control" placeholder="Ej. 12345" required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-secondary">Apellido(s) <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="Apellidos" required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-secondary">Nombre(s) <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="Nombres" required />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Dependencia / Unidad <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="Ej. Comisaría 1ra, Comando..." required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-secondary">Jerarquía (Policía de Tucumán) <span className="text-danger">*</span></label>
                      <select className="form-select border-primary" required>
                        <option value="">Seleccione una jerarquía...</option>
                        <option value="Jefe">Jefes (Comisario Gral, Comisario Mayor, etc.)</option>
                        <option value="Oficial">Oficiales (Subcomisario, Oficial Principal, etc.)</option>
                        <option value="Suboficial">Suboficiales (Sargento, Cabo, Agente, etc.)</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-top-0 bg-light" style={{ borderRadius: '0 0 12px 12px' }}>
                <button type="button" className="btn btn-outline-secondary fw-bold px-4" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-police fw-bold px-5" onClick={() => setShowModal(false)}>Guardar Registro</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
