import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import Login from './Login'
import AdminDashboard from './AdminDashboard'
import SysAdminDashboard from './SysAdminDashboard'

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'search' | 'admin' | 'sysadmin'
  const [activeTab, setActiveTab] = useState('persona'); // 'persona' | 'vehiculo'
  const [searchResult, setSearchResult] = useState(null); // null | { isCaptura: boolean, data: any }

  // ESTADOS DEL ESCÁNER QR
  const [isScanning, setIsScanning] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const scannerRef = useRef(null);

  const [formPersona, setFormPersona] = useState({
    dni: '',
    nombre: '',
    apellido: ''
  });

  const [formVehiculo, setFormVehiculo] = useState({
    dominio: '',
    chasis: '',
    motor: ''
  });

  // EFECTO DE CÁMARA PARA ESCANEO QR
  useEffect(() => {
    if (isScanning) {
      // 1. Inicializamos la instancia apuntando al ID del div "qr-reader"
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      // 2. Configuramos la cámara: preferir la cámara trasera ("environment")
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      html5QrCode.start(
        { facingMode: "environment" }, // Intenta forzar la cámara trasera en celulares
        config,
        (decodedText, decodedResult) => {
          // 3. CALLBACK DE ÉXITO: Se dispara cuando lee correctamente un QR
          console.log(`QR Leído: ${decodedText}`);
          
          // 4. Detener el escáner y cerrar el modal
          html5QrCode.stop().then(() => {
            setIsScanning(false);
            
            // 5. Simulación (Mockup) de extracción de datos JSON desde el QR
            // Intentamos parsear, si el QR no es JSON válido, usamos datos "fake" de Tarjeta Verde
            let vehiculoData = { dominio: 'AF981WZ', chasis: '8A1B2C3D4E5F6G7H8', motor: 'M4B5C6D7' };
            try {
              const parsed = JSON.parse(decodedText);
              if(parsed.dominio) vehiculoData = parsed;
            } catch (e) {
              console.log("No es JSON válido, inyectando datos simulados de Tarjeta Verde.");
            }

            // 6. Autocompletar los inputs inyectando los datos al estado del formulario
            setFormVehiculo({
              dominio: vehiculoData.dominio || '',
              chasis: vehiculoData.chasis || '',
              motor: vehiculoData.motor || ''
            });

            // 7. Mostrar la notificación flotante (Toast) de éxito
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000); // Ocultar a los 3 segundos

          }).catch(err => console.error("Error al detener el lector:", err));
        },
        (errorMessage) => {
          // Ignoramos errores de "no se encontró QR" (ocurren en cada frame que no lee nada)
        }
      ).catch(err => {
        console.error("Error iniciando cámara", err);
        alert("No se pudo acceder a la cámara. Verifique los permisos.");
        setIsScanning(false);
      });
    } else {
      // Limpieza de memoria: Si el componente o modal se desmontan, detener la cámara forzosamente
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    }
    
    // Función de limpieza del useEffect
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(e => console.log("Lector ya detenido."));
      }
    };
  }, [isScanning]);


  const handleSearch = (e) => {
    e.preventDefault();
    setSearchResult(null); // Hide briefly for "loading" effect

    let isCaptura = false;
    let data = {};

    if (activeTab === 'persona') {
      const valorBusqueda = formPersona.dni;
      isCaptura = (parseInt(valorBusqueda.slice(-1) || '0') % 2 !== 0);
      
      const nombre = formPersona.nombre.toUpperCase() || 'NO ESPECIFICADO';
      const apellido = formPersona.apellido.toUpperCase() || 'NO ESPECIFICADO';
      const identidad = apellido !== 'NO ESPECIFICADO' ? `${apellido}, ${nombre}` : nombre;

      data = { doc: valorBusqueda, identidad, nacionalidad: 'ARGENTINA' };
    } else {
      const valorBusqueda = formVehiculo.dominio.toUpperCase();
      isCaptura = (parseInt(valorBusqueda.replace(/\D/g, '').slice(-1) || '0') % 2 !== 0);
      
      const chasis = formVehiculo.chasis.toUpperCase() || 'NO VERIFICADO';
      const motor = formVehiculo.motor.toUpperCase() || 'NO VERIFICADO';

      data = { dominio: valorBusqueda, chasis, motor };
    }

    setTimeout(() => {
      setSearchResult({ isCaptura, data });
    }, 200);
  };

  const handleClear = () => {
    if (activeTab === 'persona') {
      setFormPersona({ dni: '', nombre: '', apellido: '' });
    } else {
      setFormVehiculo({ dominio: '', chasis: '', motor: '' });
    }
    setSearchResult(null);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchResult(null);
  };

  // Render Conditional Views
  if (currentView === 'login') {
    return <Login onLogin={(view) => setCurrentView(view)} />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard onNavigate={(view) => setCurrentView(view)} />;
  }

  if (currentView === 'sysadmin') {
    return <SysAdminDashboard onNavigate={(view) => setCurrentView(view)} />;
  }

  // View: Search Module
  return (
    <>
      {/* Toast Notificación: QR Leído */}
      {showToast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className="toast show align-items-center text-white bg-success border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body fw-bold" style={{ fontSize: '1rem' }}>
                <i className="bi bi-qr-code-scan me-2"></i> Tarjeta Verde leída y autocompletada exitosamente.
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar Institucional */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-police sticky-top py-3">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#" onClick={(e) => e.preventDefault()}>
            <i className="bi bi-shield-shaded fs-2 me-3 text-white"></i>
            <div className="d-flex flex-column">
              <span className="lh-1 mb-1">S.C.I.P.</span>
              <small className="text-white-50 fw-normal" style={{ fontSize: '0.75rem', letterSpacing: '0' }}>Sistema de Consulta de Identidad Policial</small>
            </div>
          </a>
          
          <div className="d-flex align-items-center ms-auto">
            <div className="d-flex align-items-center text-white user-profile rounded-pill px-3 py-2 me-2">
              <div className="d-none d-md-block text-end me-3">
                <div className="fw-bold lh-1 fs-6">Oficial J. Pérez</div>
                <small className="text-white-50" style={{ fontSize: '0.75rem' }}>División Investigaciones</small>
              </div>
              <div className="bg-light text-dark rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: '38px', height: '38px' }}>
                <i className="bi bi-person-fill fs-5"></i>
              </div>
            </div>
            <button className="btn btn-danger btn-sm rounded-circle shadow-sm" style={{ width: '38px', height: '38px' }} title="Cerrar Sesión" onClick={() => setCurrentView('login')}>
              <i className="bi bi-power"></i>
            </button>
          </div>
        </div>
      </nav>

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs nav-fill card-header-tabs m-0">
                  <li className="nav-item">
                    <button 
                      className={`nav-link d-flex align-items-center justify-content-center ${activeTab === 'persona' ? 'active' : ''}`}
                      onClick={() => switchTab('persona')}
                    >
                      <i className="bi bi-person-badge fs-5 me-2"></i>
                      Consulta de Personas
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link d-flex align-items-center justify-content-center ${activeTab === 'vehiculo' ? 'active' : ''}`}
                      onClick={() => switchTab('vehiculo')}
                    >
                      <i className="bi bi-car-front fs-5 me-2"></i>
                      Consulta de Vehículos
                    </button>
                  </li>
                </ul>
              </div>
              
              <div className="card-body p-4 p-md-5">
                {activeTab === 'persona' && (
                  <form onSubmit={handleSearch}>
                    <div className="row g-4">
                      <div className="col-md-4">
                        <label className="form-label fw-bold text-secondary"><i className="bi bi-credit-card-2-front me-1"></i> Número de DNI <span className="text-danger">*</span></label>
                        <input 
                          type="number" 
                          className="form-control form-control-lg" 
                          placeholder="Ej. 12345678" 
                          required 
                          value={formPersona.dni}
                          onChange={(e) => setFormPersona({...formPersona, dni: e.target.value})}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold text-secondary"><i className="bi bi-fonts me-1"></i> Apellido(s)</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg text-uppercase" 
                          placeholder="Apellido paterno" 
                          value={formPersona.apellido}
                          onChange={(e) => setFormPersona({...formPersona, apellido: e.target.value})}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold text-secondary"><i className="bi bi-fonts me-1"></i> Nombre(s)</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg text-uppercase" 
                          placeholder="Nombre completo" 
                          value={formPersona.nombre}
                          onChange={(e) => setFormPersona({...formPersona, nombre: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-4 pt-3 border-top gap-3">
                      <button type="button" className="btn btn-light border px-4 py-2 text-secondary fw-semibold" onClick={handleClear}><i className="bi bi-eraser me-2"></i> Limpiar Campos</button>
                      <button type="submit" className="btn btn-police px-5 py-2"><i className="bi bi-search me-2"></i> Iniciar Búsqueda</button>
                    </div>
                  </form>
                )}

                {activeTab === 'vehiculo' && (
                  <form onSubmit={handleSearch}>
                    
                    {/* BOTÓN DE ESCANEO DE TARJETA VERDE DESTACADO */}
                    <div className="mb-4 text-center text-md-start">
                      <button 
                        type="button" 
                        className="btn btn-success btn-lg px-4 shadow-sm fw-bold w-100 w-md-auto" 
                        style={{ backgroundColor: '#198754' }}
                        onClick={() => setIsScanning(true)}
                      >
                        <i className="bi bi-qr-code-scan me-2"></i> Escanear QR Tarjeta Verde
                      </button>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-4">
                        <label className="form-label fw-bold text-secondary"><i className="bi bi-123 me-1"></i> Dominio (Patente) <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg text-uppercase" 
                          placeholder="AB123CD o ABC123" 
                          required 
                          value={formVehiculo.dominio}
                          onChange={(e) => setFormVehiculo({...formVehiculo, dominio: e.target.value})}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold text-secondary"><i className="bi bi-nut me-1"></i> Número de Chasis</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg text-uppercase" 
                          placeholder="Opcional" 
                          value={formVehiculo.chasis}
                          onChange={(e) => setFormVehiculo({...formVehiculo, chasis: e.target.value})}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold text-secondary"><i className="bi bi-gear-wide-connected me-1"></i> Número de Motor</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg text-uppercase" 
                          placeholder="Opcional" 
                          value={formVehiculo.motor}
                          onChange={(e) => setFormVehiculo({...formVehiculo, motor: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-4 pt-3 border-top gap-3 flex-wrap">
                      <button type="button" className="btn btn-light border px-4 py-2 text-secondary fw-semibold w-100 w-md-auto" onClick={handleClear}><i className="bi bi-eraser me-2"></i> Limpiar Campos</button>
                      <button type="submit" className="btn btn-police px-5 py-2 w-100 w-md-auto"><i className="bi bi-search me-2"></i> Iniciar Búsqueda</button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {searchResult && (
              <div className="mt-4">
                <h5 className="text-secondary mb-3 d-flex align-items-center">
                  <i className="bi bi-file-earmark-text me-2"></i> Reporte del Sistema
                </h5>

                {searchResult.isCaptura ? (
                  <div className="result-box result-positive" style={{ display: 'block' }}>
                    <div className="d-flex flex-column flex-sm-row">
                      <div className="me-4 mb-3 mb-sm-0 text-center">
                        <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '3.5rem' }}></i>
                      </div>
                      <div className="w-100">
                        <h4 className="text-danger result-status mb-1">PEDIDO DE CAPTURA ACTIVO</h4>
                        <p className="text-danger mb-3 fw-medium"><i className="bi bi-broadcast me-1"></i> Alerta máxima: Proceder con cautela. Se requiere intervención e identificación inmediata.</p>
                        
                        <div className="result-data">
                          <div className="row">
                            <div className="col-md-6 mb-2">
                              {activeTab === 'persona' ? (
                                <>
                                  <strong>DNI/Doc:</strong> <span>{searchResult.data.doc}</span><br />
                                  <strong>Identidad:</strong> <span>{searchResult.data.identidad}</span><br />
                                  <strong>Nacionalidad:</strong> ARGENTINA
                                </>
                              ) : (
                                <>
                                  <strong>Dominio:</strong> <span>{searchResult.data.dominio}</span><br />
                                  <strong>Identidad:</strong> <span>VEHÍCULO CHASIS: {searchResult.data.chasis}</span><br />
                                </>
                              )}
                            </div>
                            <div className="col-md-6 mb-2 border-start border-sm-0 ps-sm-3">
                              <strong>Juzgado:</strong> JUZGADO PENAL N° 3<br />
                              <strong>Carátula:</strong> ROBO CALIFICADO POR EL USO DE ARMA<br />
                              <strong>Fecha Oficio:</strong> 15/08/2023
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="result-box result-negative" style={{ display: 'block' }}>
                    <div className="d-flex flex-column flex-sm-row">
                      <div className="me-4 mb-3 mb-sm-0 text-center">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3.5rem' }}></i>
                      </div>
                      <div className="w-100">
                        <h4 className="text-success result-status mb-1">SIN IMPEDIMENTOS LEGALES</h4>
                        <p className="text-muted mb-3"><i className="bi bi-info-circle me-1"></i> No se registran antecedentes penales, pedidos de secuestro ni de captura activos a la fecha.</p>
                        
                        <div className="result-data">
                          <div className="row">
                            <div className="col-md-6 mb-2">
                              {activeTab === 'persona' ? (
                                <>
                                  <strong>DNI/Doc:</strong> {searchResult.data.doc}<br />
                                  <strong>Identidad:</strong> {searchResult.data.identidad}<br />
                                  <strong>Nacionalidad:</strong> ARGENTINA
                                </>
                              ) : (
                                <>
                                  <strong>Dominio:</strong> {searchResult.data.dominio}<br />
                                  <strong>Chasis:</strong> {searchResult.data.chasis}<br />
                                  <strong>Motor:</strong> {searchResult.data.motor}
                                </>
                              )}
                            </div>
                            <div className="col-md-6 mb-2 border-start border-sm-0 ps-sm-3">
                              <strong>Última act. BD:</strong> 19/09/2026 02:00 AM<br />
                              <strong>Estado:</strong> Habilitado para circular<br />
                              <strong>Código Ref:</strong> OK-99421A
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL DE ESCÁNER DE CÁMARA */}
      {isScanning && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border-0">
              <div className="modal-header border-bottom-0 text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-upc-scan me-2 text-success"></i>
                  Escaneando Tarjeta Verde
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsScanning(false)}></button>
              </div>
              <div className="modal-body p-0">
                <p className="text-center text-white-50 small mb-2 px-3">Apunte la cámara trasera al código QR del vehículo.</p>
                {/* CONTENEDOR DONDE SE RENDERIZA LA CÁMARA */}
                <div id="qr-reader" style={{ width: '100%', minHeight: '300px', backgroundColor: '#000' }}></div>
              </div>
              <div className="modal-footer border-top-0 d-flex justify-content-center pb-4">
                <button type="button" className="btn btn-outline-light rounded-pill px-4" onClick={() => setIsScanning(false)}>
                  Cancelar Escaneo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
