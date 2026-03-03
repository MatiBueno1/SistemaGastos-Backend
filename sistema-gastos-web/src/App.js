import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import dayjs from 'dayjs';

// Estilos globales de la aplicación
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  
  /* Fondo general negro profundo */
  body { font-family: 'Inter', sans-serif; background-color: #000000; color: #BBBBBB; }
  
  /* Tarjetas con bordes sutiles */
  .card-dark { background-color: #080808; border: 1px solid #1A1A1A; border-radius: 16px; }
  
  /* Configuración de los inputs del formulario */
  .form-control-dark { 
    background-color: #0F0F0F !important; 
    border: 1px solid #333 !important; 
    color: #FFFFFF !important; 
    border-radius: 10px; 
  }
  .form-control-dark:focus { border-color: #00FF88 !important; box-shadow: none; }
  .form-control-dark::placeholder { color: #555 !important; }

  /* TEXTO DE DESCRIPCIÓN: Optimizado para lectura sin brillo excesivo */
  .text-main { 
    color: #BBBBBB !important; 
    font-weight: 500; 
    font-size: 15px;
  }
  
  /* Textos secundarios y fechas */
  .text-sub { color: #555555 !important; font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 800; }
  .text-date { color: #444444 !important; font-size: 11px; font-weight: 600; }

  /* Colores de montos y balance */
  .monto-positivo { color: #00CC66 !important; font-weight: 800; font-size: 17px; }
  .monto-negativo { color: #FF4444 !important; font-weight: 800; font-size: 17px; }
  .balance-negativo { color: #FF4444 !important; }
  .balance-positivo { color: #00CC66 !important; }

  /* Botones */
  .btn-accent { background-color: #00CC66; color: #000; border: none; border-radius: 10px; font-weight: 800; padding: 12px; }
  .btn-delete { color: #333; background: none; border: none; font-size: 22px; transition: 0.2s; }
  .btn-delete:hover { color: #FF4444; }

  /* Filas de la tabla con separadores oscuros */
  .table-custom tr { background-color: #0A0A0A; border-bottom: 2px solid #000000; }
  
  /* Estilo para el mensaje cuando no hay datos */
  .empty-state { color: #888888 !important; background-color: #0D0D0D; font-weight: 600; }
  
  /* Textos en blanco más apagados */
  .text-white-soft { color: #AAAAAA !important; }
`;

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  // URLs y Estados principales
  const API_URL = "http://localhost:5181/api";
  const [transacciones, setTransacciones] = useState([]); // Lista de movimientos
  const [categorias, setCategorias] = useState([]); // Lista de categorías de la API
  const [mesFiltro, setMesFiltro] = useState((dayjs().month() + 1).toString()); // Filtro de mes actual
  const [montoVisual, setMontoVisual] = useState(""); // Estado para formatear el input de dinero con puntos
  
  // Estado para el nuevo registro
  const [nuevoGasto, setNuevoGasto] = useState({ 
    monto: 0, 
    descripcion: '', 
    fecha: dayjs().format('YYYY-MM-DDTHH:mm'), 
    categoriaId: 0 
  });

  // Función para obtener datos de la base de datos
// Función para obtener datos de la base de datos
  const cargarDatos = async () => {
    try {
      const [resT, resC] = await Promise.all([
        axios.get(`${API_URL}/Transacciones`),
        axios.get(`${API_URL}/Categorias`)
      ]);
      setTransacciones(resT.data);

      // FILTRO PARA CATEGORÍAS REPETIDAS:
      // Filtramos la lista para que solo quede la primera aparición de cada nombre
      const categoriasUnicas = resC.data.filter((cat, index, self) =>
        index === self.findIndex((c) => c.nombre === cat.nombre)
      );
      
      setCategorias(categoriasUnicas);
    } catch (e) { console.error("Error al conectar con la API"); }
  };

  // Carga inicial al abrir la app
  useEffect(() => { cargarDatos(); }, []);

  // Lógica para enviar un nuevo gasto/ingreso
  const guardarGasto = async (e) => {
    e.preventDefault();
    if (nuevoGasto.categoriaId === 0 || nuevoGasto.categoriaId === "0") return;
    try {
      await axios.post(`${API_URL}/Transacciones`, { 
        ...nuevoGasto, 
        categoriaId: parseInt(nuevoGasto.categoriaId) 
      });
      // Limpiar formulario tras éxito
      setMontoVisual("");
      setNuevoGasto({ monto: 0, descripcion: '', fecha: dayjs().format('YYYY-MM-DDTHH:mm'), categoriaId: 0 });
      cargarDatos();
    } catch (e) { console.error("Error al guardar"); }
  };

  // Función para eliminar un registro por ID
  const eliminarMovimiento = async (id) => {
    if (window.confirm("¿Deseas eliminar este registro de forma permanente?")) {
      try { 
        await axios.delete(`${API_URL}/Transacciones/${id}`); 
        cargarDatos(); 
      } catch (e) { console.error("Error al eliminar"); }
    }
  };

  // Cálculos de Balance y Filtros
  const transaccionesFiltradas = transacciones.filter(t => (dayjs(t.fecha).month() + 1).toString() === mesFiltro);
  
  // Identificamos ingresos si la categoría contiene la palabra "sueldo"
  const totalIngresos = transaccionesFiltradas
    .filter(t => t.categoria?.nombre?.toLowerCase().includes("sueldo"))
    .reduce((acc, t) => acc + t.monto, 0);
    
  const totalGastos = transaccionesFiltradas
    .filter(t => !t.categoria?.nombre?.toLowerCase().includes("sueldo"))
    .reduce((acc, t) => acc + t.monto, 0);
    
  const balance = totalIngresos - totalGastos;

  return (
    <>
      <style>{styles}</style>
      <div className="container py-5" style={{ maxWidth: '950px' }}>
        
        {/* Cabecera */}
        <header className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3">
          <h1 className="h3 fw-bold m-0" style={{ letterSpacing: '-1.5px', color: '#AAAAAA' }}>Cuentas</h1>
          <div className="text-sub">SISTEMA DE GESTIÓN</div>
        </header>

        {/* Tarjetas de Resumen Superior */}
        <div className="row g-4 mb-5 text-center">
          <div className="col-md-4"><div className="card-dark p-4"><span className="text-sub d-block mb-2">Ingresos</span><h3 className="fw-bold mb-0" style={{color: '#AAAAAA'}}>${totalIngresos.toLocaleString('de-DE')}</h3></div></div>
          <div className="col-md-4"><div className="card-dark p-4"><span className="text-sub d-block mb-2">Gastos</span><h3 className="fw-bold mb-0" style={{color: '#AAAAAA'}}>${totalGastos.toLocaleString('de-DE')}</h3></div></div>
          <div className="col-md-4">
            <div className="card-dark p-4" style={{ borderBottom: `4px solid ${balance >= 0 ? '#00CC66' : '#FF4444'}` }}>
              <span className="text-sub d-block mb-2">Balance</span>
              <h3 className={`fw-bold mb-0 ${balance >= 0 ? 'balance-positivo' : 'balance-negativo'}`}>
                ${balance.toLocaleString('de-DE')}
              </h3>
            </div>
          </div>
        </div>

        <div className="row g-5">
          {/* Formulario de Entrada */}
          <div className="col-lg-4">
            <div className="card-dark p-4">
              <h6 className="fw-bold mb-4" style={{color: '#777777'}}>AÑADIR MOVIMIENTO</h6>
              <form onSubmit={guardarGasto}>
                {/* Input de Monto con formateo automático */}
                <input className="form-control form-control-dark mb-3 fw-bold fs-4 text-center" placeholder="Monto $0" value={montoVisual} onChange={e => {
                  const val = e.target.value.replace(/\D/g, "");
                  setMontoVisual(new Intl.NumberFormat('de-DE').format(val));
                  setNuevoGasto({...nuevoGasto, monto: parseFloat(val) || 0});
                }} required />
                
                <input className="form-control form-control-dark mb-3" placeholder="Descripción" value={nuevoGasto.descripcion} onChange={e => setNuevoGasto({...nuevoGasto, descripcion: e.target.value})} required />
                
                <input type="datetime-local" className="form-control form-control-dark mb-3" value={nuevoGasto.fecha} onChange={e => setNuevoGasto({...nuevoGasto, fecha: e.target.value})} required />
                
                <select className="form-select form-control-dark mb-4" value={nuevoGasto.categoriaId} onChange={e => setNuevoGasto({...nuevoGasto, categoriaId: e.target.value})} required>
                  <option value="0">Seleccionar Categoría</option>
                  {categorias.map(c => <option key={c.categoriaId} value={c.categoriaId} style={{background: '#000'}}>{c.nombre}</option>)}
                </select>
                
                <button className="btn btn-accent w-100">REGISTRAR</button>
              </form>
            </div>
          </div>

          {/* Listado de Movimientos */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold m-0" style={{color: '#AAAAAA'}}>HISTORIAL</h6>
              <select className="form-select border-0 bg-transparent" value={mesFiltro} onChange={e => setMesFiltro(e.target.value)} style={{color: '#AAAAAA', fontWeight: 'bold', width: 'auto'}}>
                {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((m, i) => <option key={i} value={i + 1} style={{background: '#000'}}>{m}</option>)}
              </select>
            </div>

            <div className="card-dark overflow-hidden">
              <table className="table table-borderless align-middle mb-0 table-custom">
                <tbody>
                  {transaccionesFiltradas.length > 0 ? transaccionesFiltradas.map(t => {
                    const esIngreso = t.categoria?.nombre?.toLowerCase().includes("sueldo");
                    return (
                      <tr key={t.transaccionId}>
                        <td className="p-3">
                          <span className="text-date d-block">
                            {dayjs(t.fecha).format('DD MMM')} • {dayjs(t.fecha).format('HH:mm')}
                          </span>
                          <span className="text-main d-block">{t.descripcion}</span>
                        </td>
                        <td className="text-end p-3">
                          <span className={`d-block ${esIngreso ? 'monto-positivo' : 'monto-negativo'}`}>
                            {esIngreso ? '+' : '-'}${t.monto.toLocaleString('de-DE')}
                          </span>
                          <span className="text-sub">{t.categoria?.nombre}</span>
                        </td>
                        <td className="text-end pe-3" style={{ width: '40px' }}>
                          <button className="btn-delete" title="Eliminar" onClick={() => eliminarMovimiento(t.transaccionId)}>×</button>
                        </td>
                      </tr>
                    )
                  }) : (
                    /* Mensaje cuando no hay registros: Ahora con color visible */
                    <tr>
                      <td colSpan="3" className="text-center py-5 empty-state">
                        No se encontraron registros para este mes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;